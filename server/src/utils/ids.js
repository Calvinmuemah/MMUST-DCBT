import { v5 as uuidv5 } from "uuid";
import { pool } from "../config/db.js";

const NAMESPACE_BASE = uuidv5.DNS;

export const getNamespace = () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  return uuidv5(secret, NAMESPACE_BASE);
};

export const generatePublicId = (seed) => {
  return uuidv5(String(seed), getNamespace());
};

export const ensureUserPublicId = async (userId, email) => {
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS public_id uuid`);

    const publicId = generatePublicId(`user:${userId}:${email}`);

    await pool.query(
      `UPDATE users SET public_id = $1 WHERE id = $2`,
      [publicId, userId]
    );

    return publicId;
  } catch (error) {
    console.error("ensureUserPublicId error:", error.message);
    return null;
  }
};

export const ensureSessionPublicId = async (sessionId, userId, topic) => {
  try {
    await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS public_id uuid`);

    const publicId = generatePublicId(`session:${sessionId}:${userId}:${topic}`);

    await pool.query(
      `UPDATE chat_sessions SET public_id = $1 WHERE id = $2`,
      [publicId, sessionId]
    );

    return publicId;
  } catch (error) {
    console.error("ensureSessionPublicId error:", error.message);
    return null;
  }
};

export const resolveSessionId = async (sessionIdentifier) => {
  if (typeof sessionIdentifier === "string" && sessionIdentifier.includes("-")) {
    const result = await pool.query(
      `SELECT id FROM chat_sessions WHERE public_id = $1 LIMIT 1`,
      [sessionIdentifier]
    );

    return result.rowCount > 0 ? result.rows[0].id : null;
  }

  const numericId = Number(sessionIdentifier);
  return Number.isInteger(numericId) ? numericId : null;
};
