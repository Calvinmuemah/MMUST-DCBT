import {
  generateResponse,
  generateSessionStarter
} from "../services/chatbot.service.js";

import { detectCrisis } from "../services/crisis.service.js";

import { pool } from "../config/db.js";

import {
  ensureSessionPublicId,
  resolveSessionId
} from "../utils/ids.js";


// ======================================
// START SESSION
// ======================================

export const startSession = async (req, res) => {
  try {
    const userId = req.user.dbId;
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        message: "Topic required"
      });
    }

    // Create session
    const session = await pool.query(
      `
      INSERT INTO chat_sessions (user_id, topic)
      VALUES ($1, $2)
      RETURNING id, topic
      `,
      [userId, topic]
    );

    const created = session.rows[0];

    // create public id (for frontend safety)
    const publicId = await ensureSessionPublicId(
      created.id,
      userId,
      created.topic
    );

    // generate CBT starter (NO INTRO)
    const starter = await generateSessionStarter(topic);

    // save starter message
    await pool.query(
      `
      INSERT INTO chat_messages (session_id, sender, message)
      VALUES ($1, 'ai', $2)
      `,
      [created.id, starter]
    );

    return res.json({
      sessionId: publicId || created.id,
      message: starter,
      topic,
      language: "english"
    });

  } catch (error) {
    console.log("START SESSION ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ======================================
// CHAT
// ======================================

export const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.dbId;

    if (!message || !sessionId) {
      return res.status(400).json({
        message: "Message and sessionId required"
      });
    }

    // ======================================
    // CRISIS DETECTION (CBT SAFE MODE)
    // ======================================

    if (detectCrisis(message)) {
      return res.json({
        emergency: true,
        response:
          "I hear that things feel really heavy right now. You don’t have to go through this alone. Can you tell me what’s making it feel this way?",
        language: "english",
        sessionId
      });
    }

    // ======================================
    // RESOLVE SESSION
    // ======================================

    const resolvedId = await resolveSessionId(sessionId);

    const session = await pool.query(
      `
      SELECT *
      FROM chat_sessions
      WHERE id = $1
      AND user_id = $2
      `,
      [resolvedId, userId]
    );

    if (session.rowCount === 0) {
      return res.status(403).json({
        message: "Unauthorized session"
      });
    }

    const topic = session.rows[0].topic;

    // ======================================
    // SAVE USER MESSAGE
    // ======================================

    await pool.query(
      `
      INSERT INTO chat_messages (session_id, sender, message)
      VALUES ($1, 'user', $2)
      `,
      [resolvedId, message]
    );

    // ======================================
    // AI RESPONSE (CBT LOCKED)
    // ======================================

    const aiResult = await generateResponse(
      message,
      topic,
      resolvedId
    );

    const reply = aiResult.reply;
    const language = aiResult.language;

    // ======================================
    // SAVE AI RESPONSE
    // ======================================

    await pool.query(
      `
      INSERT INTO chat_messages (session_id, sender, message)
      VALUES ($1, 'ai', $2)
      `,
      [resolvedId, reply]
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.json({
      emergency: false,
      response: reply,
      language,
      sessionId: resolvedId   // ✅ FIXED (was wrong before)
    });

  } catch (error) {
    console.log("CHAT ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ======================================
// GET SESSION HISTORY
// ======================================

export const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.dbId;

    const resolvedId = await resolveSessionId(sessionId);

    // ownership check
    const check = await pool.query(
      `
      SELECT id
      FROM chat_sessions
      WHERE id = $1
      AND user_id = $2
      `,
      [resolvedId, userId]
    );

    if (check.rowCount === 0) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    // fetch messages
    const result = await pool.query(
      `
      SELECT sender, message, created_at
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at ASC
      `,
      [resolvedId]
    );

    return res.json(result.rows);

  } catch (error) {
    console.log("GET HISTORY ERROR:", error);

    return res.status(500).json({
      message: "Error fetching history"
    });
  }
};