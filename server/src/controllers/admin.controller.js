import * as adminService from "../services/admin.service.js";

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
    console.error("getDashboardMetrics error:", err.message);
    await adminService.createLog('error', 'analytics', `Dashboard metrics error: ${err.message}`, { path: '/metrics' });
    res.status(500).json({
      success: false,
      message: "Server error while fetching metrics"
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getDetailedUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    await adminService.createLog('error', 'system', `Get users error: ${err.message}`, { path: '/users' });
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCrisisReports = async (req, res) => {
  try {
    const reports = await adminService.getCrisisReports();
    res.json({ success: true, data: reports });
  } catch (err) {
    await adminService.createLog('error', 'analytics', `Get crisis reports error: ${err.message}`, { path: '/crisis' });
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const { category, limit } = req.query;
    const logs = await adminService.getSystemLogs(category, limit);
    res.json({ success: true, data: logs });
  } catch (err) {
    await adminService.createLog('error', 'system', `Get logs error: ${err.message}`, { path: '/logs' });
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await adminService.deleteUser(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await adminService.createLog('warn', 'auth', `User deleted by admin`, { adminId: req.user.id, userId: id });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ADMIN] Fetching user details for: ${id}`);
    const user = await adminService.getUserFullProfile(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error("[ADMIN] getUserDetails error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
