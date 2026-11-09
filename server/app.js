import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB, pool } from "./src/config/db.js";

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

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = [
  "https://mmust-dcbt.vercel.app",
  "https://mmust-dcbt-admin.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  ...envOrigins,
];

// Security HTTP headers
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

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

// Request body size limits (prevents payload flood attacks)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to MMUST-DCBT API",
    status: "running",
    version: "1.0.0",
  });
});

// ---------------------------------------------------------------------------
// HEALTH, LIVENESS & READINESS PROBES
// ---------------------------------------------------------------------------

// 1. Liveness Probe (Is Express alive and responsive? Does not touch database)
app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 2. Readiness Probe (Is the database connected and ready to process requests?)
app.get("/health/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "not_ready",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// 3. Combined Health Endpoint (Backward compatibility)
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "healthy",
      live: true,
      ready: true,
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(503).json({
      status: "unhealthy",
      live: true,
      ready: false,
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/journal", journalRoutes);
app.use("/api/v1/referrals", referralRoutes);
app.use("/api/v1/admin", adminRoutes);

// Error Handling Middleware (Sanitized for sensitive production data)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorType = err.name || "InternalError";
  const isDbError = Boolean(err.code && /^[0-9A-Z]{5}$/.test(err.code));
  const is5xx = statusCode >= 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${err.stack}`);
  } else {
    // In production, sanitize logs: log HTTP method, path, status, and error category.
    // Never log raw database query errors, passwords, tokens, or personal health info.
    console.error(`[ERROR] [${errorType}] Status: ${statusCode} - ${req.method} ${req.path}`);
  }
  
  // In production, strictly mask all 500-level and database query errors
  let clientMessage = err.message || "Request failed";
  if (process.env.NODE_ENV === "production" && (is5xx || isDbError)) {
    clientMessage = "An unexpected internal server error occurred.";
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
