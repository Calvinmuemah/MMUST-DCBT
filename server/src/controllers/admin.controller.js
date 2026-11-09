import * as adminService from "../services/admin.service.js";

const getSafeErrorMessage = (err, fallback = "An unexpected administrative error occurred") => {
  return process.env.NODE_ENV === "production" ? fallback : (err.message || fallback);
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const { range } = req.query;
    const stats = await adminService.getDashboardStats(range);
    
    await adminService.createLog('info', 'analytics', 'Admin dashboard metrics viewed', { adminId: req.user.id, range });

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("getDashboardMetrics error:", err);
    }
    await adminService.createLog('error', 'analytics', 'Dashboard metrics query failed', { path: '/metrics' });
    res.status(500).json({
      success: false,
      message: getSafeErrorMessage(err, "Server error while fetching metrics")
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getDetailedUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("getUsers error:", err);
    }
    await adminService.createLog('error', 'system', 'Failed to retrieve user list', { path: '/users' });
    res.status(500).json({ success: false, message: getSafeErrorMessage(err, "Failed to retrieve users") });
  }
};

export const getCrisisReports = async (req, res) => {
  try {
    const reports = await adminService.getCrisisReports();
    res.json({ success: true, data: reports });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("getCrisisReports error:", err);
    }
    await adminService.createLog('error', 'analytics', 'Failed to retrieve crisis reports', { path: '/crisis' });
    res.status(500).json({ success: false, message: getSafeErrorMessage(err, "Failed to retrieve crisis reports") });
  }
};

export const getLogs = async (req, res) => {
  try {
    const { category, limit } = req.query;
    const logs = await adminService.getSystemLogs(category, limit);
    res.json({ success: true, data: logs });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("getLogs error:", err);
    }
    await adminService.createLog('error', 'system', 'Failed to retrieve system logs', { path: '/logs' });
    res.status(500).json({ success: false, message: getSafeErrorMessage(err, "Failed to retrieve logs") });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await adminService.deleteUser(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await adminService.createLog('warn', 'auth', 'User deleted by admin', { adminId: req.user.id, userId: id });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("deleteUser error:", err);
    }
    res.status(500).json({ success: false, message: getSafeErrorMessage(err, "Failed to delete user") });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (process.env.NODE_ENV !== "production") {
      console.log(`[ADMIN] Fetching user details for: ${id}`);
    }
    const user = await adminService.getUserFullProfile(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ADMIN] getUserDetails error:", err);
    }
    res.status(500).json({ success: false, message: getSafeErrorMessage(err, "Failed to retrieve user details") });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionData = await adminService.getChatSessionMessages(sessionId);
    
    if (!sessionData) {
      return res.status(404).json({ success: false, message: "Chat session not found" });
    }

    await adminService.createLog('info', 'analytics', 'Admin viewed chat history details', { adminId: req.user.id, sessionId });

    res.json({
      success: true,
      data: sessionData
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("getChatMessages error:", err);
    }
    res.status(500).json({ success: false, message: getSafeErrorMessage(err, "Failed to retrieve chat session messages") });
  }
};
