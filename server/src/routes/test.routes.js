import express from "express";
import User from "../models/user.model.js";
import Slot from "../models/slot.model.js";
import Booking from "../models/booking.model.js";

const router = express.Router();

router.get("/models", (req, res) => {
  res.status(200).json({
    success: true,
    models: {
      user: User.modelName,
      slot: Slot.modelName,
      booking: Booking.modelName
    }
  });
});

export default router;