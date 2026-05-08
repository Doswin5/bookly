import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelMyBooking,
  getAllBookings,
  cancelBookingByAdmin
} from "../controllers/booking.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/admin/all", protect, adminOnly, getAllBookings);
router.patch("/admin/:id/cancel", protect, adminOnly, cancelBookingByAdmin);

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelMyBooking);

export default router;