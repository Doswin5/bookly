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