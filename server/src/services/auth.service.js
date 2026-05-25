import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { ensureUserPublicId } from "../utils/ids.js";

// =======================
// REGISTER (AUTH ONLY)
// =======================
export const registerUser = async (data) => {
  const { name, email, password } = data;

  const userExists = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userExists.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, hashedPassword]
  );
  const created = newUser.rows[0];
  const publicId = await ensureUserPublicId(created.id, created.email);

  const token = generateToken({ id: created.id, uid: publicId, email: created.email });

  return {
    user: {
      id: publicId || created.id,
      name: created.name,
      email: created.email,
    },
    token,
  };
};

// =======================
// LOGIN
// =======================
export const loginUser = async (data) => {
  const { email, password } = data;

  const userResult = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = userResult.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const publicId = user.public_id || (await ensureUserPublicId(user.id, user.email));
  const token = generateToken({ id: user.id, uid: publicId, email: user.email });

  return {
    user: {
      id: publicId || user.id,
      name: user.name,
      email: user.email,
      stress: user.stress,
      challenge: user.challenge,
      mood: user.mood,
    },
    token,
  };
};

// =======================
// PROFILE
// =======================
export const getUserProfile = async (userId) => {
  const user = await pool.query(
    "SELECT id, public_id, name, email, stress, challenge, mood FROM users WHERE id = $1",
    [userId]
  );

  const profile = user.rows[0];

  return profile
    ? {
      id: profile.public_id || profile.id,
        name: profile.name,
        email: profile.email,
        stress: profile.stress,
        challenge: profile.challenge,
        mood: profile.mood,
      }
    : null;
};

// =======================
// ONBOARDING (UPDATE USER CBT PROFILE)
// =======================
export const completeOnboarding = async (userId, data) => {
  const { stress, challenge, mood } = data;

  const updated = await pool.query(
    `UPDATE users
     SET stress = $1,
         challenge = $2,
         mood = $3
     WHERE id = $4
     RETURNING id, public_id, name, email, stress, challenge, mood`,
    [stress, challenge, mood, userId]
  );

  const profile = updated.rows[0];

  return profile
    ? {
      id: profile.public_id || profile.id,
        name: profile.name,
        email: profile.email,
        stress: profile.stress,
        challenge: profile.challenge,
        mood: profile.mood,
      }
    : null;
};

// =======================
// CBT CONTEXT HELPERS (NEW - IMPORTANT FOR YOUR CHAT SYSTEM)
// =======================

// Get user mental profile (for AI personalization later)
export const getUserCBTContext = async (userId) => {
  const result = await pool.query(
    `SELECT stress, challenge, mood
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0];
};