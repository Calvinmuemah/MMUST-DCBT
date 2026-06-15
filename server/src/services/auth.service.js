import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { ensureUserPublicId, generatePublicId } from "../utils/ids.js";
import { applyReferralCode, ensureReferralCode } from "./referral.service.js";
import { createLog } from "./admin.service.js";

const selectUserFields = `
  id, public_id, name, email, password,
  notifications_enabled, email_updates, token_version,
  referral_code, referred_by_user_id, referral_reward_points, referral_invites_count,
  onboarding_answers, onboarding_total_score, onboarding_risk_level, onboarding_completed, onboarding_completed_at,
  is_anonymous, role
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
  isAnonymous: Boolean(user.is_anonymous),
  role: user.role || 'student',
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

const recordLoginEvent = async (userId) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_login_events (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(
      `INSERT INTO user_login_events (user_id) VALUES ($1)`,
      [userId]
    );
  } catch (error) {
    console.error("recordLoginEvent error:", error.message);
  }
};

// =======================
// REGISTER (AUTH ONLY)
// =======================
export const registerUser = async (data) => {
  const { name, email, password, referralCode: incomingReferralCode, role = 'student' } = data;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING ${selectUserFields}`,
    [name, email, hashedPassword, role]
  );
  const created = newUser.rows[0];
  const publicId = await ensureUserPublicId(created.id, created.email);
  const referralCode = await ensureReferralCode(created.id, created.email);

  // Apply referral code if provided
  if (incomingReferralCode) {
    try {
      await applyReferralCode(created.id, incomingReferralCode);
    } catch (err) {
      console.error("Failed to apply referral code during registration:", err.message);
      // We don't throw here to avoid failing the whole registration
      // just because of an invalid/expired referral code
    }
  }

  const freshUser = await getUserById(created.id);

  await createLog('info', 'auth', `New user registered: ${email} (${role})`, { userId: created.id, role });

  const token = generateToken({
    id: created.id,
    uid: publicId,
    email: created.email,
    role: freshUser?.role || created.role || role,
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
// REGISTER ANONYMOUS
// =======================
export const registerAnonymousUser = async (data) => {
  const name = data?.name || `Guest ${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newUser = await pool.query(
    `INSERT INTO users (name, is_anonymous)
     VALUES ($1, TRUE)
     RETURNING ${selectUserFields}`,
    [name]
  );
  
  const created = newUser.rows[0];
  const publicId = await ensureUserPublicId(created.id, `anon-${created.id}`);
  const referralCode = await ensureReferralCode(created.id, `anon-${created.id}`);

  const freshUser = await getUserById(created.id);

  await recordLoginEvent(created.id);
  await createLog('info', 'auth', `Guest session started: ${name}`, { userId: created.id });

  const token = generateToken({
    id: created.id,
    uid: publicId,
    email: null,
    role: 'student',
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
    role: user.role,
    tokenVersion: user.token_version || 0,
  });

  await recordLoginEvent(user.id);
  await createLog('info', 'auth', `User logged in: ${user.email || 'Anonymous'}`, { userId: user.id, role: user.role });

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
// =======================
// EMAIL HELPER
// =======================

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"MMUSTCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; borderRadius: 10px;">
          <h2 style="color: #2563EB; text-align: center;">MMUSTCare Password Reset</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed. This code is valid for 15 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1E293B; background: #f3f4f6; padding: 10px 20px; border-radius: 8px;">${otp}</span>
          </div>
          <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748B; text-align: center;">MMUSTCare - Student Mental Health & Well-being Platform</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

// =======================
// PASSWORD RESET / OTP
// =======================

const ensureOtpTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_otps (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

export const requestPasswordReset = async (email) => {
  await ensureOtpTable();
  
  const user = await getUserByEmail(email);
  if (!user) {
    // We don't want to reveal if a user exists or not for security
    return { message: "If an account exists with this email, an OTP has been sent." };
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

  // Delete any existing OTPs for this email
  await pool.query(`DELETE FROM user_otps WHERE email = $1`, [email]);

  await pool.query(
    `INSERT INTO user_otps (email, otp, expires_at) VALUES ($1, $2, $3)`,
    [email, otp, expiresAt]
  );

  // Send the actual email
  const emailSent = await sendOTPEmail(email, otp);

  if (!emailSent) {
    console.log(`[AUTH] Failed to send email to ${email}. Logging OTP to console: ${otp}`);
  }

  return { message: "If an account exists with this email, an OTP has been sent." };
};

export const verifyOTP = async (email, otp) => {
  await ensureOtpTable();

  const result = await pool.query(
    `SELECT * FROM user_otps WHERE email = $1 AND otp = $2 AND expires_at > NOW() AND verified = FALSE`,
    [email, otp]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid or expired OTP");
  }

  await pool.query(
    `UPDATE user_otps SET verified = TRUE WHERE id = $1`,
    [result.rows[0].id]
  );

  return { message: "OTP verified successfully. you can now reset your password." };
};

export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  await ensureOtpTable();

  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const result = await pool.query(
    `SELECT * FROM user_otps WHERE email = $1 AND otp = $2 AND verified = TRUE AND expires_at > NOW()`,
    [email, otp]
  );

  if (result.rowCount === 0) {
    throw new Error("OTP not verified or expired. Please start over.");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users 
     SET password = $1, 
         token_version = COALESCE(token_version, 0) + 1 
     WHERE id = $2`,
    [hashedPassword, user.id]
  );

  // Clean up used OTP
  await pool.query(`DELETE FROM user_otps WHERE email = $1`, [email]);

  return { message: "Password reset successful. You can now login with your new password." };
};
