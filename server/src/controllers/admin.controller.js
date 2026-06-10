import * as adminService from "../services/admin.service.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    
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
