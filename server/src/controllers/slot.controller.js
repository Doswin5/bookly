import Slot from "../models/slot.model.js";

export const createSlot = async (req, res) => {
  try {
    const { serviceName, startTime, endTime } = req.body;

    if (!serviceName || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Service name, start time, and end time are required."
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format."
      });
    }

    if (start <= now) {
      return res.status(400).json({
        success: false,
        message: "Slot start time must be in the future."
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time."
      });
    }

    const existingSlot = await Slot.findOne({
      startTime: start,
      endTime: end
    });

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: "A slot already exists for this time."
      });
    }

    const slot = await Slot.create({
      serviceName,
      startTime: start,
      endTime: end,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Slot created successfully.",
      slot
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create slot."
    });
  }
};

export const getSlots = async (req, res) => {
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

      filter.startTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const slots = await Slot.find(filter).sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      count: slots.length,
      slots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch slots."
    });
  }
};


export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, startTime, endTime } = req.body;

    const slot = await Slot.findById(id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found."
      });
    }

    if (slot.status === "booked") {
      return res.status(400).json({
        success: false,
        message: "You cannot update a booked slot."
      });
    }

    if (startTime || endTime) {
      const newStart = startTime ? new Date(startTime) : slot.startTime;
      const newEnd = endTime ? new Date(endTime) : slot.endTime;

      if (Number.isNaN(newStart.getTime()) || Number.isNaN(newEnd.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format."
        });
      }

      if (newStart <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Slot start time must be in the future."
        });
      }

      if (newEnd <= newStart) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time."
        });
      }

      slot.startTime = newStart;
      slot.endTime = newEnd;
    }

    if (serviceName) {
      slot.serviceName = serviceName;
    }

    await slot.save();

    return res.status(200).json({
      success: true,
      message: "Slot updated successfully.",
      slot
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A slot already exists for this time."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update slot."
    });
  }
};


export const cancelSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findById(id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found."
      });
    }

    if (slot.status === "booked") {
      return res.status(400).json({
        success: false,
        message: "You cannot cancel a booked slot. Cancel the booking first."
      });
    }

    if (slot.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Slot is already cancelled."
      });
    }

    slot.status = "cancelled";
    await slot.save();

    return res.status(200).json({
      success: true,
      message: "Slot cancelled successfully.",
      slot
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel slot."
    });
  }
};


export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findById(id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found."
      });
    }

    if (slot.status === "booked") {
      return res.status(400).json({
        success: false,
        message: "You cannot delete a booked slot."
      });
    }

    await slot.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete slot."
    });
  }
};