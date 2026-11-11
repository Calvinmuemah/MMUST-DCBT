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
import {
  getSubscribers,
  deleteSubscriber,
  getBroadcastHistory,
  sendBroadcast,
} from "../controllers/newsletter.controller.js";
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

// Email Broadcast & Newsletter Management
router.get("/broadcast/subscribers", getSubscribers);
router.delete("/broadcast/subscribers/:id", deleteSubscriber);
router.get("/broadcast/history", getBroadcastHistory);
router.post("/broadcast/send", sendBroadcast);

export default router;
