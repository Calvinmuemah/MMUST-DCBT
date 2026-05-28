import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import journalRoutes from "./src/routes/journal.routes.js";
import referralRoutes from "./src/routes/referral.routes.js";

dotenv.config();

const app = express();

// middleware
// setup request logging (skip in tests)
if (process.env.NODE_ENV !== "test") {
  const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
  app.use(morgan(morganFormat));
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to MMUST-DCBT API ",
    status: "running",
    version: "1.0.0",
  });
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/journal", journalRoutes);
app.use("/api/v1/referrals", referralRoutes);

// DB connect
connectDB();

export default app;