import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },

    bookedAt: {
      type: Date,
      default: Date.now
    },

    cancelledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index(
  { slot: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" }
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;