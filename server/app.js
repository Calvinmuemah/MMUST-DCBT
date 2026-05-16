import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to MMUST-DCBT API 🚀",
    status: "running",
    version: "1.0.0",
  });
});

// routes
app.use("/api/auth", authRoutes);

// DB connect
connectDB();

export default app;