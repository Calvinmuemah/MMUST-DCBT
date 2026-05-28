import express from "express";
import {
  applyReferral,
  checkReferralCode,
  getMyReferral,
} from "../controllers/referral.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/validate", checkReferralCode);
router.get("/me", protect, getMyReferral);
router.post("/apply", protect, applyReferral);

export default router;
