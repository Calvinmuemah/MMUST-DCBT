import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { ensureUserPublicId, generatePublicId } from "../utils/ids.js";
import { ensureReferralCode } from "./referral.service.js";

const selectUserFields = `
  id, public_id, name, email, password,
  notifications_enabled, email_updates, token_version,
  referral_code, referred_by_user_id, referral_reward_points, referral_invites_count,
  onboarding_answers, onboarding_total_score, onboarding_risk_level, onboarding_completed, onboarding_completed_at
`;

const toUserResponse = (user) => ({
  id: user.public_id || user.id,
  name: user.name,
  email: user.email,
  notificationsEnabled: user.notifications_enabled,
  emailUpdates: user.email_updates,
  referralCode: user.referral_code,
  referredByUserId: user.referred_by_user_id,
  referralRewardPoints: user.referral_reward_points || 0,
  referralInvitesCount: user.referral_invites_count || 0,
  onboardingAnswers: user.onboarding_answers || null,
  onboardingTotalScore: user.onboarding_total_score || null,
  onboardingRiskLevel: user.onboarding_risk_level || null,
  onboardingCompleted: Boolean(user.onboarding_completed),
  onboardingCompletedAt: user.onboarding_completed_at || null,
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

const isMissingDailyAssessmentsSchema = (error) => {
  return error?.code === "42P01" || error?.code === "42703";
};

const getTodayDailyAssessment = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, stress_level, main_challenge, overwhelm_frequency,
              answers, total_score, risk_level, assessment_date, created_at
       FROM daily_assessments
       WHERE user_id = $1
       AND assessment_date = CURRENT_DATE
       LIMIT 1`,
      [userId]
    );

    return result.rows[0] || null;
  } catch (error) {
    if (isMissingDailyAssessmentsSchema(error)) {
      return null;
    }

    throw error;
  }
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

  const freshUser = await getUserById(user.id);
  const publicId = user.public_id || generatePublicId(`user:${user.id}:${user.email}`);
  const referralCode = freshUser?.referral_code || user.referral_code || null;
  const todayDailyAssessment = await getTodayDailyAssessment(user.id);
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
      referral_code: referralCode,
    }),
    dailyAssessmentRequired: !todayDailyAssessment,
    dailyAssessment: todayDailyAssessment
      ? {
          id: todayDailyAssessment.id,
          stressLevel: todayDailyAssessment.stress_level,
          mainChallenge: todayDailyAssessment.main_challenge,
          overwhelmFrequency: todayDailyAssessment.overwhelm_frequency,
          answers: todayDailyAssessment.answers || null,
          totalScore: todayDailyAssessment.total_score,
          riskLevel: todayDailyAssessment.risk_level,
          assessmentDate: todayDailyAssessment.assessment_date,
          createdAt: todayDailyAssessment.created_at,
        }
      : null,
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
  // Expecting payload from frontend: { answers: [...], totalScore: number, riskLevel: string }
  const answers = data.answers;
  const totalScore = data.totalScore;
  const riskLevel = data.riskLevel ?? null;

  if (answers !== null && answers !== undefined && !Array.isArray(answers)) {
    throw new Error("Invalid onboarding data: 'answers' must be an array");
  }

  if (totalScore !== null && totalScore !== undefined && typeof totalScore !== 'number') {
    throw new Error("Invalid onboarding data: 'totalScore' must be a number");
  }

  // Strict schema validation for each answer item
  if (Array.isArray(answers)) {
    for (let i = 0; i < answers.length; i += 1) {
      const item = answers[i];

      if (typeof item !== 'object' || item === null) {
        throw new Error(`Invalid onboarding answer at index ${i}: must be an object`);
      }

      const { questionNumber, question, answer, score } = item;

      if (questionNumber === undefined || typeof questionNumber !== 'number') {
        throw new Error(`Invalid onboarding answer at index ${i}: 'questionNumber' must be a number`);
      }

      if (question === undefined || typeof question !== 'string') {
        throw new Error(`Invalid onboarding answer at index ${i}: 'question' must be a string`);
      }

      if (answer === undefined || typeof answer !== 'string') {
        throw new Error(`Invalid onboarding answer at index ${i}: 'answer' must be a string`);
      }

      if (score === undefined || typeof score !== 'number') {
        throw new Error(`Invalid onboarding answer at index ${i}: 'score' must be a number`);
      }
    }
  }

  const updated = await pool.query(
    `UPDATE users
     SET onboarding_answers = $1,
         onboarding_total_score = $2,
         onboarding_risk_level = $3,
         onboarding_completed = TRUE,
         onboarding_completed_at = NOW()
     WHERE id = $4
     RETURNING ${selectUserFields}`,
    [answers ? JSON.stringify(answers) : null, totalScore, riskLevel, userId]
  );

  const profile = updated.rows[0];

  return profile ? toUserResponse(profile) : null;
};

// =======================
// CBT CONTEXT HELPERS (NEW - IMPORTANT FOR YOUR CHAT SYSTEM)
// =======================

// Get user mental profile (for AI personalization later)
export const getUserCBTContext = async (userId) => {
  return {
    userId,
  };
};

export const getDailyAssessmentStatus = async (userId) => {
  const todayDailyAssessment = await getTodayDailyAssessment(userId);

  return {
    required: !todayDailyAssessment,
    assessment: todayDailyAssessment
      ? {
          id: todayDailyAssessment.id,
          stressLevel: todayDailyAssessment.stress_level,
          mainChallenge: todayDailyAssessment.main_challenge,
          overwhelmFrequency: todayDailyAssessment.overwhelm_frequency,
          answers: todayDailyAssessment.answers || null,
          totalScore: todayDailyAssessment.total_score,
          riskLevel: todayDailyAssessment.risk_level,
          assessmentDate: todayDailyAssessment.assessment_date,
          createdAt: todayDailyAssessment.created_at,
        }
      : null,
  };
};

export const submitDailyAssessment = async (userId, data) => {
  const stressLevel = String(data?.stressLevel || "").trim();
  const mainChallenge = String(data?.mainChallenge || "").trim();
  const overwhelmFrequency = String(data?.overwhelmFrequency || "").trim();
  const answers = data?.answers;
  const totalScore = data?.totalScore;
  const riskLevel = data?.riskLevel !== undefined && data?.riskLevel !== null
    ? String(data.riskLevel).trim()
    : null;

  if (!stressLevel || !mainChallenge || !overwhelmFrequency) {
    throw new Error("stressLevel, mainChallenge, and overwhelmFrequency are required");
  }

  if (answers !== undefined && answers !== null && !Array.isArray(answers)) {
    throw new Error("answers must be an array when provided");
  }

  if (totalScore !== undefined && totalScore !== null && typeof totalScore !== "number") {
    throw new Error("totalScore must be a number when provided");
  }

  const alreadySubmittedToday = await getTodayDailyAssessment(userId);

  if (alreadySubmittedToday) {
    throw new Error("Daily assessment already submitted for today");
  }

  const result = await pool.query(
    `INSERT INTO daily_assessments (
      user_id,
      stress_level,
      main_challenge,
      overwhelm_frequency,
      answers,
      total_score,
      risk_level,
      assessment_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
    RETURNING id, user_id, stress_level, main_challenge, overwhelm_frequency,
              answers, total_score, risk_level, assessment_date, created_at`,
    [
      userId,
      stressLevel,
      mainChallenge,
      overwhelmFrequency,
      answers ? JSON.stringify(answers) : null,
      totalScore ?? null,
      riskLevel,
    ]
  );

  const row = result.rows[0];

  return {
    id: row.id,
    stressLevel: row.stress_level,
    mainChallenge: row.main_challenge,
    overwhelmFrequency: row.overwhelm_frequency,
    answers: row.answers || null,
    totalScore: row.total_score,
    riskLevel: row.risk_level,
    assessmentDate: row.assessment_date,
    createdAt: row.created_at,
  };
};