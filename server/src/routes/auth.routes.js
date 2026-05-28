import express from "express";
import {
  register,
  login,
  getProfile,
  onboarding,
  updateProfile,
  updatePreferences,
  changePassword,
  logout,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);

// PROFILE
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/preferences", protect, updatePreferences);
router.put("/password", protect, changePassword);
router.post("/logout", protect, logout);

// ONBOARDING (NEW)
router.post("/onboarding", protect, onboarding);

export default router;