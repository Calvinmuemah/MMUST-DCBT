import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

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

  const token = generateToken(newUser.rows[0]);

  return {
    user: newUser.rows[0],
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

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
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
    "SELECT id, name, email, stress, challenge, mood FROM users WHERE id = $1",
    [userId]
  );

  return user.rows[0];
};

// =======================
// ONBOARDING (NEW)
// =======================
export const completeOnboarding = async (userId, data) => {
  const { stress, challenge, mood } = data;

  const updated = await pool.query(
    `UPDATE users
     SET stress = $1,
         challenge = $2,
         mood = $3
     WHERE id = $4
     RETURNING id, name, email, stress, challenge, mood`,
    [stress, challenge, mood, userId]
  );

  return updated.rows[0];
};