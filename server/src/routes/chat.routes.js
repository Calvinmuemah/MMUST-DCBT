import express from "express";
import { chat, startSession, getSessionMessages } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { chatLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// 🧠 start CBT session
router.post("/session/start", protect, chatLimiter, startSession);

// 💬 send message
router.post("/", protect, chatLimiter, chat);

// 📜 fetch history
router.get("/:sessionId", protect, getSessionMessages);
export default router;