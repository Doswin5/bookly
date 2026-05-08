import Booking from "../models/booking.model.js";
import Slot from "../models/slot.model.js";

export const createBooking = async (req, res) => {
  try {
    const { slotId, notes } = req.body;

    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: "Slot ID is required."
      });
    }

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found."
      });
    }

    if (slot.status !== "available") {
      return res.status(409).json({
        success: false,
        message: "This slot is no longer available."
      });
    }

    if (slot.startTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book a past slot."
      });
    }

    const existingBooking = await Booking.findOne({
      slot: slot._id,
      status: "confirmed"
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This slot has already been booked."
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      slot: slot._id,
      notes,
      status: "confirmed"
    });

    slot.status = "booked";
    await slot.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("slot")
      .populate("user", "name email");

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking: populatedBooking
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This slot has already been booked."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create booking."
    });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("slot")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your bookings."
    });
  }
};

export const cancelMyBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("slot");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings."
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled."
      });
    }

    if (booking.slot.startTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "You cannot cancel a past booking."
      });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    booking.slot.status = "available";
    await booking.slot.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking."
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, date } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const slots = await Slot.find({
        startTime: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }).select("_id");

      filter.slot = {
        $in: slots.map((slot) => slot._id)
      };
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate("slot")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings."
    });
  }
};

export const cancelBookingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("slot");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled."
      });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    if (booking.slot && booking.slot.status === "booked") {
      booking.slot.status = "available";
      await booking.slot.save();
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled by admin.",
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking."
    });
  }
};