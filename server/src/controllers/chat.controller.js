import { generateResponse } from "../services/chatbot.service.js";
import { detectCrisis } from "../services/crisis.service.js";
import { pool } from "../config/db.js";

/**
 * 🧠 START CBT SESSION
 * POST /chat/session/start
 */
export const startSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const session = await pool.query(
      `INSERT INTO chat_sessions (user_id, topic)
       VALUES ($1, $2)
       RETURNING id`,
      [userId, topic]
    );

    return res.json({
      sessionId: session.rows[0].id,
      message: "Hi, I’m here with you. What’s been going on?"
    });

  } catch (err) {
    console.log("Start Session Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * 💬 MAIN CHAT ENDPOINT
 * POST /chat
 */
export const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;

    if (!message || !sessionId) {
      return res.status(400).json({
        message: "Message and sessionId are required",
      });
    }

    // 🚨 Crisis detection FIRST
    if (detectCrisis(message)) {
      return res.json({
        emergency: true,
        response:
          "I’m really sorry you're feeling this way. Please reach out to someone you trust or a counselor immediately.",
      });
    }

    // 🔒 Verify session belongs to user + get topic
    const sessionRes = await pool.query(
      `SELECT * FROM chat_sessions
       WHERE id = $1 AND user_id = $2`,
      [sessionId, userId]
    );

    if (sessionRes.rowCount === 0) {
      return res.status(403).json({
        message: "Unauthorized session access",
      });
    }

    const topic = sessionRes.rows[0].topic;

    // 💾 Save user message
    await pool.query(
      `INSERT INTO chat_messages (session_id, sender, message)
       VALUES ($1, 'user', $2)`,
      [sessionId, message]
    );

    // 🧠 CBT RESPONSE WITH MEMORY (IMPORTANT CHANGE)
    const reply = await generateResponse(message, topic, sessionId);

    // 💾 Save AI response
    await pool.query(
      `INSERT INTO chat_messages (session_id, sender, message)
       VALUES ($1, 'ai', $2)`,
      [sessionId, reply]
    );

    return res.json({
      emergency: false,
      response: reply,
      sessionId,
    });

  } catch (error) {
    console.log("Chat Controller Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * 📜 GET SESSION MESSAGES
 * GET /chat/:sessionId
 */
export const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // 🔒 ownership check
    const sessionCheck = await pool.query(
      `SELECT id FROM chat_sessions
       WHERE id = $1 AND user_id = $2`,
      [sessionId, userId]
    );

    if (sessionCheck.rowCount === 0) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const result = await pool.query(
      `SELECT * FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId]
    );

    return res.json(result.rows);

  } catch (err) {
    console.error("Get Messages Error:", err);
    return res.status(500).json({
      message: "Error fetching messages",
    });
  }
};