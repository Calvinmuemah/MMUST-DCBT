import express from "express";
import { chat, startSession, getSessionMessages } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🧠 start CBT session
router.post("/session/start", protect, startSession);

// 💬 send message
router.post("/", protect, chat);

// 📜 fetch history
router.get("/:sessionId", protect, getSessionMessages);
export default router;