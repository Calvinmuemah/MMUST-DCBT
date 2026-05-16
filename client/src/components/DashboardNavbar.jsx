import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold">
          M
        </div>

        <div>
          <h1 className="font-bold text-slate-900">MMUSTCare</h1>
          <p className="text-xs text-slate-500">CBT Dashboard</p>
        </div>
      </div>

      {/* CENTER NAV */}
      <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
        <button onClick={() => navigate("/dashboard")} className="hover:text-blue-600">
          Dashboard
        </button>

        <button onClick={() => navigate("/cbt")} className="hover:text-teal-600">
          CBT Exercises
        </button>

        <button onClick={() => navigate("/chat")} className="hover:text-blue-600">
          AI Chat
        </button>

        <button onClick={() => navigate("/crisis")} className="hover:text-red-600">
          Crisis
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <div className="text-sm text-slate-600 hidden sm:block">
          {user?.name || "Student"}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}