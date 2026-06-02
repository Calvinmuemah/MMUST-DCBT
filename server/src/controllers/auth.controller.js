import {
  registerUser,
  loginUser,
  getUserProfile,
  completeOnboarding,
  updateUserProfile,
  updateAccountPreferences,
  changeUserPassword,
  revokeUserSessions,
  getDailyAssessmentStatus,
  submitDailyAssessment,
  requestPasswordReset,
  verifyOTP,
  resetPasswordWithOTP,
} from "../services/auth.service.js";

// =======================
// REGISTER
// =======================
export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// =======================
// LOGIN
// =======================
export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// =======================
// PROFILE
// =======================
export const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.dbId);
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// =======================
// ONBOARDING (NEW)
// =======================
export const onboarding = async (req, res) => {
  try {
    const { answers, totalScore } = req.body || {};

    if (!Array.isArray(answers) || typeof totalScore !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid onboarding payload: 'answers' must be an array and 'totalScore' must be a number",
      });
    }

    const result = await completeOnboarding(req.user.dbId, req.body);

    res.json({
      success: true,
      message: "Onboarding saved successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// UPDATE PROFILE
// =======================
export const updateProfile = async (req, res) => {
  try {
    const result = await updateUserProfile(req.user.dbId, req.body);

    res.json({
      message: "Profile updated successfully",
      user: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// =======================
// UPDATE PREFERENCES
// =======================
export const updatePreferences = async (req, res) => {
  try {
    const result = await updateAccountPreferences(req.user.dbId, req.body);

    res.json({
      message: "Preferences saved successfully",
      user: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// =======================
// CHANGE PASSWORD
// =======================
export const changePassword = async (req, res) => {
  try {
    await changeUserPassword(req.user.dbId, req.body);

    res.json({
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// =======================
// LOGOUT / REVOKE SESSIONS
// =======================
export const logout = async (req, res) => {
  try {
    await revokeUserSessions(req.user.dbId);

    res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// =======================
// DAILY ASSESSMENT STATUS
// =======================
export const dailyAssessmentStatus = async (req, res) => {
  try {
    const result = await getDailyAssessmentStatus(req.user.dbId);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =======================
// DAILY ASSESSMENT SUBMIT
// =======================
export const submitDailyAssessmentController = async (req, res) => {
  try {
    const result = await submitDailyAssessment(req.user.dbId, req.body);

    res.status(201).json({
      success: true,
      message: "Daily assessment saved successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// PASSWORD RESET / OTP
// =======================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    const result = await requestPasswordReset(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const result = await verifyOTP(email, otp);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const result = await resetPasswordWithOTP(email, otp, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
