import express from "express";
import {
  register,
  login,
  getProfile,
  onboarding,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);

// PROFILE
router.get("/profile", protect, getProfile);

// ONBOARDING (NEW)
router.post("/onboarding", protect, onboarding);

export default router;