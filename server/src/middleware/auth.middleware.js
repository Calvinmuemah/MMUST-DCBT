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

    let userRecord = null;

    // Resolve by public_id if uid is in token claims
    if (decoded.uid) {
      const userRes = await pool.query(
        `SELECT id, public_id, token_version, role FROM users WHERE public_id = $1 LIMIT 1`,
        [decoded.uid]
      );
      if (userRes.rowCount > 0) {
        userRecord = userRes.rows[0];
      }
    }

    // Resilient fallback for legacy tokens containing only id (supports integer id or uuid)
    if (!userRecord && decoded.id) {
      const isIntegerId = !isNaN(decoded.id) && Number.isInteger(Number(decoded.id));
      const query = isIntegerId
        ? `SELECT id, public_id, token_version, role FROM users WHERE id = $1 LIMIT 1`
        : `SELECT id, public_id, token_version, role FROM users WHERE public_id = $1 LIMIT 1`;

      const userRes = await pool.query(query, [decoded.id]);
      if (userRes.rowCount > 0) {
        userRecord = userRes.rows[0];
      }
    }

    if (!userRecord) {
      return res.status(401).json({
        message: "User account no longer exists or has been disabled.",
      });
    }

    // Immediate token revocation check
    if ((decoded.tokenVersion || 0) !== (userRecord.token_version || 0)) {
      return res.status(401).json({
        message: "Session expired or revoked. Please log in again.",
      });
    }

    // 5. Attach live user state from database (role is always authoritative from DB)
    req.user = {
      id: userRecord.public_id || userRecord.id,
      dbId: userRecord.id,
      email: decoded.email,
      role: userRecord.role || "student",
      tokenVersion: userRecord.token_version || 0,
    };

    next();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Auth middleware error:", err.message);
    }

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/**
 * Middleware to restrict route access strictly to users with the 'admin' role
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access forbidden: administrative privileges required",
    });
  }
  next();
};