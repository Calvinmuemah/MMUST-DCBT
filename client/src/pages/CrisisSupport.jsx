import { useState } from "react";
import { postRequest } from "../utils/api";

// import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

export default function Crisis() {
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // 🚨 Panic button action (backend-ready)
  const triggerPanicAlert = async () => {
    try {
      setLoading(true);

      // await postRequest("/crisis/panic", { type: "urgent_support" });

      setTimeout(() => {
        setMessageSent(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
    }
  };

  // 📩 Notify counselor (future backend hook)
  const notifyCounselor = async () => {
    try {
      setLoading(true);

      // await postRequest("/crisis/counselor", { urgency: "medium" });

      setTimeout(() => {
        setMessageSent(true);
        setLoading(false);
      }, 800);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* 🌿 DASHBOARD NAVBAR */}
      {/* <DashboardNavbar /> */}

      {/* PAGE CONTENT */}
      <div className="flex-1 px-6 py-10">

        {/* BACKDROP (softened for mental health UX) */}
        <div className="absolute w-72 h-72 bg-red-100/20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-blue-100/20 rounded-full blur-3xl bottom-10 right-10"></div>

        <div className="relative max-w-4xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="bg-white/80 backdrop-blur-xl border rounded-[28px] p-6 text-center shadow">

            <h1 className="text-2xl font-black text-red-500">
              Crisis Support Center
            </h1>

            <p className="text-slate-500 mt-2">
              Calm, private and immediate support options
            </p>

            <p className="text-xs text-slate-400 mt-3">
              This area provides structured emotional support pathways
            </p>
          </div>

          {/* 🚨 PANIC BUTTON */}
          <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-[28px] p-6 shadow-xl text-center">

            <h2 className="text-xl font-bold">
              Feeling overwhelmed right now?
            </h2>

            <p className="mt-2 text-sm opacity-90">
              Activate immediate support assistance
            </p>

            <button
              onClick={triggerPanicAlert}
              disabled={loading}
              className="mt-5 px-6 py-3 bg-white text-red-500 font-bold rounded-xl shadow hover:scale-105 transition"
            >
              {loading ? "Activating..." : "Activate Panic Support"}
            </button>

            {messageSent && (
              <p className="mt-4 text-sm font-semibold">
                Support request has been initiated.
              </p>
            )}
          </div>

          {/* SUPPORT OPTIONS */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* UNIVERSITY SUPPORT */}
            <div className="bg-white/80 backdrop-blur-xl border rounded-[28px] p-6 shadow">

              <h3 className="text-lg font-bold text-blue-600">
                University Counseling
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Connect with institutional mental health support
              </p>

              <button
                onClick={notifyCounselor}
                disabled={loading}
                className="mt-4 px-5 py-2 bg-blue-100 text-blue-700 font-semibold rounded-xl"
              >
                Notify Counselor
              </button>
            </div>

            {/* AI SUPPORT */}
            <div className="bg-white/80 backdrop-blur-xl border rounded-[28px] p-6 shadow">

              <h3 className="text-lg font-bold text-teal-600">
                AI Stabilization Mode
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Immediate grounding & CBT-based calming support
              </p>

              <button className="mt-4 px-5 py-2 bg-teal-100 text-teal-700 font-semibold rounded-xl">
                Start Calm Mode
              </button>
            </div>

          </div>

          {/* SUPPORT INFO */}
          <div className="bg-white/80 backdrop-blur-xl border rounded-[28px] p-6 shadow">

            <h3 className="text-lg font-bold text-slate-800">
              Support System Overview
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-600">

              <div className="p-3 bg-blue-50 rounded-xl">
                🧠 AI CBT Support — 24/7 emotional guidance
              </div>

              <div className="p-3 bg-teal-50 rounded-xl">
                🏫 University Counseling — institutional support system
              </div>

              <div className="p-3 bg-purple-50 rounded-xl">
                🌿 Self-help tools — breathing, CBT exercises, journaling
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 🌿 FOOTER */}
      <Footer />
    </div>
  );
}