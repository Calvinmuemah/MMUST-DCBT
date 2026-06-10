import express from "express";
import {
  register,
  registerAnonymous,
  login,
  getProfile,
  onboarding,
  updateProfile,
  updatePreferences,
  changePassword,
  logout,
  dailyAssessmentStatus,
  submitDailyAssessmentController,
  forgotPassword,
  verifyOtpController,
  resetPasswordController,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { loginLimiter, otpLimiter, passwordResetLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/anonymous", registerAnonymous);
router.post("/login", loginLimiter, login);

// PASSWORD RESET / OTP
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", passwordResetLimiter, resetPasswordController);

// PROFILE
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/preferences", protect, updatePreferences);
router.put("/password", protect, changePassword);
router.post("/logout", protect, logout);

// ONBOARDING (NEW)
router.post("/onboarding", protect, onboarding);
router.get("/daily-assessment/status", protect, dailyAssessmentStatus);
router.post("/daily-assessment", protect, submitDailyAssessmentController);

export default router;
