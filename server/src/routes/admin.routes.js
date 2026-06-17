import express from "express";
import { 
  getDashboardMetrics, 
  getUsers, 
  getUserDetails,
  getCrisisReports,
  getLogs,
  deleteUser
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// NOTE: In a real production app, we would add an isAdmin middleware check here.
// For now, we protect it with the standard auth check.
router.get("/metrics", protect, getDashboardMetrics);
router.get("/users", protect, getUsers);
router.get("/users/:id", protect, getUserDetails);
router.get("/crisis", protect, getCrisisReports);
router.get("/logs", protect, getLogs);
router.delete("/users/:id", protect, deleteUser);

export default router;
