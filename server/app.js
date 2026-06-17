import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import journalRoutes from "./src/routes/journal.routes.js";
import referralRoutes from "./src/routes/referral.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

dotenv.config();

const app = express();

// rate limiting proxy trust (for Vercel/Render/Heroku)
app.set("trust proxy", 1);

// middleware
// setup request logging (skip in tests)
if (process.env.NODE_ENV !== "test") {
  const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
  app.use(morgan(morganFormat));
}

const allowedOrigins = [
  "https://mmust-dcbt.vercel.app",
  "https://mmust-dcbt-admin.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
}));
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
app.use("/api/v1/admin", adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// DB connect
connectDB();

export default app;
