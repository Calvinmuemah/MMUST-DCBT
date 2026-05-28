import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    // 2. Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    // 3. Extract token safely
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let dbId = decoded.id;
    let tokenVersion = decoded.tokenVersion || 0;

    if (decoded.uid) {
      const userRes = await pool.query(
        `SELECT id, token_version FROM users WHERE public_id = $1 LIMIT 1`,
        [decoded.uid]
      );

      if (userRes.rowCount > 0) {
        dbId = userRes.rows[0].id;
        tokenVersion = userRes.rows[0].token_version || 0;
      }
    }

    if ((decoded.tokenVersion || 0) !== tokenVersion) {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
      });
    }

    // 5. Attach user safely
    req.user = {
      id: decoded.uid || decoded.id,
      dbId,
      email: decoded.email,
      role: decoded.role || "user",
      tokenVersion,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};