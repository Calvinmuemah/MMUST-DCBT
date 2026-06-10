import express from "express";
import { getDashboardMetrics } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// NOTE: In a real production app, we would add an isAdmin middleware check here.
// For now, we protect it with the standard auth check.
router.get("/metrics", protect, getDashboardMetrics);

export default router;
