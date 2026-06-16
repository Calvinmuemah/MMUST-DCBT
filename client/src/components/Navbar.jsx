import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-6 md:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-slate-100">

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-200">
          <span className="text-white font-bold text-lg">M</span>
        </div>

        <div>
          <h1 className="font-bold text-xl text-slate-900">MMUSTCare</h1>
          <p className="text-xs text-slate-500">
            Digital Mental Wellness Platform
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#features" className="hover:text-blue-600 transition">
          Features
        </a>

        <a href="#how" className="hover:text-blue-600 transition">
          How It Works
        </a>

        <a href="#support" className="hover:text-blue-600 transition">
          Support
        </a>
      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium shadow-lg shadow-blue-200 hover:scale-105 transition-all duration-300"
        >
          Get Started
        </button>

      </div>
    </nav>
  );
}