import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true
    },

    startTime: {
      type: Date,
      required: [true, "Start time is required"]
    },

    endTime: {
      type: Date,
      required: [true, "End time is required"]
    },

    status: {
      type: String,
      enum: ["available", "booked", "cancelled"],
      default: "available"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

slotSchema.index({ startTime: 1, endTime: 1 }, { unique: true });

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;