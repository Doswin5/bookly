import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import testRoutes from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

import { notFound, errorHandler } from "./middleware/error.middleware.js";


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Booking API is running"
  });
});

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;