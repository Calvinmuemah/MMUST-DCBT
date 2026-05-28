import crypto from "crypto";
import { pool } from "../config/db.js";

const CODE_PREFIX = "MMUST";
const REWARD_POINTS = 10;

const normalizeReferralCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const makeReferralCode = (seed, attempt = 0) => {
  const digest = crypto
    .createHash("sha256")
    .update(`${seed}:${attempt}`)
    .digest("hex")
    .toUpperCase();

  return `${CODE_PREFIX}${digest.slice(0, 8)}`;
};

const getUserRow = async (userId) => {
  const result = await pool.query(
    `SELECT id, public_id, name, email, referral_code, referred_by_user_id,
            referral_reward_points, referral_invites_count
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
};

const getUserByReferralCode = async (referralCode) => {
  const result = await pool.query(
    `SELECT id, public_id, name, email, referral_code, referral_reward_points,
            referral_invites_count
     FROM users
     WHERE referral_code = $1
     LIMIT 1`,
    [referralCode]
  );

  return result.rows[0] || null;
};

export const ensureReferralCode = async (userId, email) => {
  const user = await getUserRow(userId);

  if (!user) {
    return null;
  }

  if (user.referral_code) {
    return user.referral_code;
  }

  const seed = user.public_id || email || user.id;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const referralCode = makeReferralCode(seed, attempt);

    const codeExists = await pool.query(
      `SELECT id
       FROM users
       WHERE referral_code = $1
       AND id <> $2
       LIMIT 1`,
      [referralCode, userId]
    );

    if (codeExists.rowCount === 0) {
      const updated = await pool.query(
        `UPDATE users
         SET referral_code = $1
         WHERE id = $2
         RETURNING referral_code`,
        [referralCode, userId]
      );

      return updated.rows[0]?.referral_code || referralCode;
    }
  }

  throw new Error("Unable to generate referral code");
};

export const getReferralOverview = async (userId) => {
  const user = await getUserRow(userId);

  if (!user) {
    return null;
  }

  const referralCode = user.referral_code || (await ensureReferralCode(userId, user.email));

  const invitedUsersResult = await pool.query(
    `SELECT rr.id,
            rr.referral_code,
            rr.reward_points,
            rr.created_at,
            u.id AS invited_user_id,
            u.public_id AS invited_user_public_id,
            u.name AS invited_user_name,
            u.email AS invited_user_email
     FROM referral_redemptions rr
     JOIN users u ON u.id = rr.referred_user_id
     WHERE rr.referrer_user_id = $1
     ORDER BY rr.created_at DESC`,
    [userId]
  );

  const referredByResult = await pool.query(
    `SELECT u.id, u.public_id, u.name, u.email, u.referral_code
     FROM users me
     JOIN users u ON u.id = me.referred_by_user_id
     WHERE me.id = $1
     LIMIT 1`,
    [userId]
  );

  return {
    referralCode,
    referralRewardPoints: user.referral_reward_points || 0,
    referralInvitesCount: user.referral_invites_count || 0,
    referredBy: referredByResult.rows[0]
      ? {
          id: referredByResult.rows[0].public_id || referredByResult.rows[0].id,
          name: referredByResult.rows[0].name,
          email: referredByResult.rows[0].email,
          referralCode: referredByResult.rows[0].referral_code,
        }
      : null,
    invitedUsers: invitedUsersResult.rows.map((row) => ({
      id: row.invited_user_public_id || row.invited_user_id,
      name: row.invited_user_name,
      email: row.invited_user_email,
      referralCode: row.referral_code,
      rewardPoints: row.reward_points,
      createdAt: row.created_at,
    })),
  };
};

export const validateReferralCode = async (referralCode, currentUserId = null) => {
  const normalizedCode = normalizeReferralCode(referralCode);

  if (!normalizedCode) {
    return {
      valid: false,
      message: "Referral code is required",
    };
  }

  const referrer = await getUserByReferralCode(normalizedCode);

  if (!referrer) {
    return {
      valid: false,
      message: "Invalid referral code",
    };
  }

  if (currentUserId && referrer.id === currentUserId) {
    return {
      valid: false,
      message: "You cannot use your own referral code",
    };
  }

  return {
    valid: true,
    message: "Referral code is valid",
    referrer: {
      id: referrer.public_id || referrer.id,
      name: referrer.name,
      code: referrer.referral_code,
    },
  };
};

export const applyReferralCode = async (userId, referralCode) => {
  const normalizedCode = normalizeReferralCode(referralCode);

  if (!normalizedCode) {
    throw new Error("Referral code is required");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `SELECT id, public_id, name, email, referral_code, referred_by_user_id,
              referral_reward_points, referral_invites_count
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new Error("User not found");
    }

    if (user.referred_by_user_id) {
      throw new Error("Referral code already applied");
    }

    if (user.referral_code === normalizedCode) {
      throw new Error("You cannot use your own referral code");
    }

    const referrerResult = await client.query(
      `SELECT id, public_id, name, email, referral_code,
              referral_reward_points, referral_invites_count
       FROM users
       WHERE referral_code = $1
       FOR UPDATE`,
      [normalizedCode]
    );

    const referrer = referrerResult.rows[0];

    if (!referrer) {
      throw new Error("Invalid referral code");
    }

    if (referrer.id === userId) {
      throw new Error("You cannot use your own referral code");
    }

    const redemptionResult = await client.query(
      `INSERT INTO referral_redemptions (
         referrer_user_id,
         referred_user_id,
         referral_code,
         reward_points
       )
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (referred_user_id) DO NOTHING
       RETURNING id, created_at`,
      [referrer.id, userId, normalizedCode, REWARD_POINTS]
    );

    if (redemptionResult.rowCount === 0) {
      throw new Error("Referral code already applied");
    }

    await client.query(
      `UPDATE users
       SET referred_by_user_id = $1
       WHERE id = $2`,
      [referrer.id, userId]
    );

    await client.query(
      `UPDATE users
       SET referral_invites_count = COALESCE(referral_invites_count, 0) + 1,
           referral_reward_points = COALESCE(referral_reward_points, 0) + $1
       WHERE id = $2`,
      [REWARD_POINTS, referrer.id]
    );

    await client.query("COMMIT");

    return {
      applied: true,
      rewardPoints: REWARD_POINTS,
      referrer: {
        id: referrer.public_id || referrer.id,
        name: referrer.name,
        email: referrer.email,
        referralCode: referrer.referral_code,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
