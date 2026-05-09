import express from "express";
import {
  createSlot,
  getSlots,
  updateSlot,
  cancelSlot,
  deleteSlot
} from "../controllers/slot.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getSlots);

router.post("/", protect, adminOnly, createSlot);
router.patch("/:id", protect, adminOnly, updateSlot);
router.patch("/:id/cancel", protect, adminOnly, cancelSlot);
router.delete("/:id", protect, adminOnly, deleteSlot);

export default router;