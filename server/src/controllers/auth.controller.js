import {
  registerUser,
  loginUser,
  getUserProfile,
  completeOnboarding,
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
    const result = await completeOnboarding(req.user.dbId, req.body);

    res.json({
      message: "Onboarding saved successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};