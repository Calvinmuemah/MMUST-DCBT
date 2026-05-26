import { pool } from "../config/db.js";

// check if valid uuid
const isUUID = (id) => {
  return /^[0-9a-fA-F-]{36}$/.test(id);
};

export const resolveSessionId = async (sessionId) => {
  try {
    // CASE 1: already UUID
    if (isUUID(sessionId)) {
      return sessionId;
    }

    // CASE 2: publicId lookup
    const result = await pool.query(
      `
      SELECT session_id
      FROM session_public_ids
      WHERE public_id = $1
      LIMIT 1
      `,
      [sessionId]
    );

    if (result.rowCount > 0) {
      return result.rows[0].session_id;
    }

    throw new Error("Invalid sessionId");
  } catch (err) {
    console.log("resolveSessionId error:", err);
    throw new Error("Invalid sessionId");
  }
};