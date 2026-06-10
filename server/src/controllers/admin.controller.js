import * as adminService from "../services/admin.service.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const { range } = req.query;
    const stats = await adminService.getDashboardStats(range);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error("getDashboardMetrics error:", err.message);
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
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCrisisReports = async (req, res) => {
  try {
    const reports = await adminService.getCrisisReports();
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
