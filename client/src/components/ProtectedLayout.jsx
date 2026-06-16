import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import DashboardNavbar from "./DashboardNavbar";

export default function ProtectedLayout() {
  const { user } = useAuth();

  // 🚨 if not logged in → redirect
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* DASHBOARD NAVBAR */}
      <DashboardNavbar />

      {/* PAGE CONTENT */}
      <div className="p-4">
        <Outlet />
      </div>

    </div>
  );
}