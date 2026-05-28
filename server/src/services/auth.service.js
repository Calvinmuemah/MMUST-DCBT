import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { ensureUserPublicId } from "../utils/ids.js";
import { ensureReferralCode } from "./referral.service.js";

const selectUserFields = `
  id, public_id, name, email, password, stress, challenge, mood,
  notifications_enabled, email_updates, token_version,
  referral_code, referred_by_user_id, referral_reward_points, referral_invites_count
`;

const toUserResponse = (user) => ({
  id: user.public_id || user.id,
  name: user.name,
  email: user.email,
  stress: user.stress,
  challenge: user.challenge,
  mood: user.mood,
  notificationsEnabled: user.notifications_enabled,
  emailUpdates: user.email_updates,
  referralCode: user.referral_code,
  referredByUserId: user.referred_by_user_id,
  referralRewardPoints: user.referral_reward_points || 0,
  referralInvitesCount: user.referral_invites_count || 0,
});

const getUserById = async (userId) => {
  const result = await pool.query(
    `SELECT ${selectUserFields}
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
};

const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT ${selectUserFields}
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
};

// =======================
// REGISTER (AUTH ONLY)
// =======================
export const registerUser = async (data) => {
  const { name, email, password } = data;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING ${selectUserFields}`,
    [name, email, hashedPassword]
  );
  const created = newUser.rows[0];
  const publicId = await ensureUserPublicId(created.id, created.email);
  const referralCode = await ensureReferralCode(created.id, created.email);

  const freshUser = await getUserById(created.id);

  const token = generateToken({
    id: created.id,
    uid: publicId,
    email: created.email,
    tokenVersion: freshUser?.token_version || created.token_version || 0,
  });

  return {
    user: toUserResponse({
      ...freshUser,
      public_id: publicId,
      referral_code: referralCode,
    }),
    token,
  };
};

// =======================
// LOGIN
// =======================
export const loginUser = async (data) => {
  const { email, password } = data;

  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const publicId = user.public_id || (await ensureUserPublicId(user.id, user.email));
  const referralCode = await ensureReferralCode(user.id, user.email);
  const freshUser = await getUserById(user.id);
  const token = generateToken({
    id: user.id,
    uid: publicId,
    email: user.email,
    tokenVersion: user.token_version || 0,
  });

  return {
    user: toUserResponse({
      ...(freshUser || user),
      public_id: publicId,
      referral_code: freshUser?.referral_code || referralCode,
    }),
    token,
  };
};

// =======================
// PROFILE
// =======================
export const getUserProfile = async (userId) => {
  const profile = await getUserById(userId);

  if (profile) {
    const referralCode = await ensureReferralCode(profile.id, profile.email);

    return toUserResponse({
      ...profile,
      referral_code: profile.referral_code || referralCode,
    });
  }

  return null;
};

// =======================
// UPDATE PROFILE
// =======================
export const updateUserProfile = async (userId, data) => {
  const updates = [];
  const values = [];

  if (data.name !== undefined) {
    updates.push(`name = $${updates.length + 1}`);
    values.push(String(data.name).trim());
  }

  if (data.email !== undefined) {
    updates.push(`email = $${updates.length + 1}`);
    values.push(String(data.email).trim().toLowerCase());
  }

  if (data.stress !== undefined) {
    updates.push(`stress = $${updates.length + 1}`);
    values.push(data.stress);
  }

  if (data.challenge !== undefined) {
    updates.push(`challenge = $${updates.length + 1}`);
    values.push(data.challenge);
  }

  if (data.mood !== undefined) {
    updates.push(`mood = $${updates.length + 1}`);
    values.push(data.mood);
  }

  if (updates.length === 0) {
    const profile = await getUserById(userId);
    return profile ? toUserResponse(profile) : null;
  }

  values.push(userId);

  const result = await pool.query(
    `UPDATE users
     SET ${updates.join(", ")}
     WHERE id = $${values.length}
     RETURNING ${selectUserFields}`,
    values
  );

  const updated = result.rows[0];

  return updated ? toUserResponse(updated) : null;
};

// =======================
// ACCOUNT PREFERENCES
// =======================
export const updateAccountPreferences = async (userId, data) => {
  const updates = [];
  const values = [];

  if (data.notificationsEnabled !== undefined) {
    updates.push(`notifications_enabled = $${updates.length + 1}`);
    values.push(Boolean(data.notificationsEnabled));
  }

  if (data.emailUpdates !== undefined) {
    updates.push(`email_updates = $${updates.length + 1}`);
    values.push(Boolean(data.emailUpdates));
  }

  if (updates.length === 0) {
    const profile = await getUserById(userId);
    return profile ? toUserResponse(profile) : null;
  }

  values.push(userId);

  const result = await pool.query(
    `UPDATE users
     SET ${updates.join(", ")}
     WHERE id = $${values.length}
     RETURNING ${selectUserFields}`,
    values
  );

  const updated = result.rows[0];

  return updated ? toUserResponse(updated) : null;
};

// =======================
// CHANGE PASSWORD
// =======================
export const changeUserPassword = async (userId, data) => {
  const currentPassword = String(data.currentPassword || "");
  const newPassword = String(data.newPassword || "");
  const confirmPassword = String(data.confirmPassword || "");

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await pool.query(
    `UPDATE users
     SET password = $1,
         token_version = COALESCE(token_version, 0) + 1
     WHERE id = $2
     RETURNING ${selectUserFields}`,
    [hashedPassword, userId]
  );

  const updated = result.rows[0];

  return updated ? toUserResponse(updated) : null;
};

// =======================
// LOGOUT / SESSION REVOCATION
// =======================
export const revokeUserSessions = async (userId) => {
  const result = await pool.query(
    `UPDATE users
     SET token_version = COALESCE(token_version, 0) + 1
     WHERE id = $1
     RETURNING id`,
    [userId]
  );

  return result.rowCount > 0;
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
     RETURNING ${selectUserFields}`,
    [stress, challenge, mood, userId]
  );

  const profile = updated.rows[0];

  return profile
    ? toUserResponse(profile)
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