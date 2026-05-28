import {
  registerUser,
  loginUser,
  getUserProfile,
  completeOnboarding,
  updateUserProfile,
  updateAccountPreferences,
  changeUserPassword,
  revokeUserSessions,
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