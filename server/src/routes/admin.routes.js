import express from "express";
import { 
  getDashboardMetrics, 
  getUsers, 
  getUserDetails,
  getCrisisReports,
  getLogs,
  deleteUser,
  getChatMessages
} from "../controllers/admin.controller.js";
import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Enforce authentication AND administrator role on all admin routes
router.use(protect, isAdmin);

router.get("/metrics", getDashboardMetrics);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.get("/crisis", getCrisisReports);
router.get("/logs", getLogs);
router.get("/chats/:sessionId", getChatMessages);
router.delete("/users/:id", deleteUser);

export default router;
