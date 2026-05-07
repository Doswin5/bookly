import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import testRoutes from "./routes/test.routes.js";

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

export default app;