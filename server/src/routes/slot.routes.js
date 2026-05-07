import express from "express";
import {
  createSlot,
  getSlots
} from "../controllers/slot.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getSlots);
router.post("/", protect, adminOnly, createSlot);

export default router;