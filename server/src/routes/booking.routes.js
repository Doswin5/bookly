import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelMyBooking
} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelMyBooking);

export default router;