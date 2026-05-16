import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../utils/api";

// import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [mood, setMood] = useState(null);
  const [loadingMood, setLoadingMood] = useState(false);

  const navigate = useNavigate();

  // =========================
  // 📡 LOAD USER PROFILE
  // =========================
  useEffect(() => {
    // ✅ GET USER FROM LOCAL STORAGE
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setProfile(parsedUser);

      // optional → set current mood from onboarding
      if (parsedUser.mood) {
        setMood(parsedUser.mood);
      }
    }

    // FUTURE:
    // fetch profile from backend
  }, []);

  // =========================
  // 🌿 MOOD TRACKING API
  // =========================
  const submitMood = async (selectedMood) => {
    try {
      setMood(selectedMood);
      setLoadingMood(true);

      await postRequest("/mood/track", {
        mood: selectedMood,
        timestamp: new Date().toISOString(),
      });

      setLoadingMood(false);
    } catch (err) {
      setLoadingMood(false);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* PAGE CONTENT */}
      <div className="flex-1 px-6 py-8">

        {/* BACKGROUND BLURS */}
        <div className="absolute w-72 h-72 bg-blue-100/30 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-teal-100/30 rounded-full blur-3xl bottom-10 right-10"></div>

        <div className="relative max-w-5xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="bg-white/80 backdrop-blur-xl border shadow-xl rounded-[28px] p-6 flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Good day, {profile?.name || "Student"} 👋
              </h1>

              <p className="text-slate-500 mt-1">
                Your mental wellness control center
              </p>
            </div>

            <button
              onClick={() => navigate("/chat")}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-lg"
            >
              AI Support
            </button>
          </div>

          {/* ========================= */}
          {/* 📊 STATS */}
          {/* ========================= */}
          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow border">
              <p className="text-sm text-slate-500">Stress Level</p>

              <h2 className="text-xl font-bold text-blue-600 mt-1">
                {profile?.stress || "Not set"}
              </h2>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow border">
              <p className="text-sm text-slate-500">Main Challenge</p>

              <h2 className="text-xl font-bold text-teal-600 mt-1">
                {profile?.challenge || "Not set"}
              </h2>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow border">
              <p className="text-sm text-slate-500">Mood Status</p>

              <h2 className="text-xl font-bold text-purple-600 mt-1 capitalize">
                {mood || "Not tracked"}
              </h2>
            </div>
          </div>

          {/* ========================= */}
          {/* 🌿 MOOD TRACKER */}
          {/* ========================= */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-6 shadow border">

            <h2 className="text-xl font-bold text-slate-800">
              Daily Mood Tracker
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Track how you're feeling today
            </p>

            <div className="mt-5 flex gap-3 flex-wrap">

              {[
                { label: "😄 Great", value: "great" },
                { label: "🙂 Good", value: "good" },
                { label: "😐 Okay", value: "okay" },
                { label: "😟 Low", value: "low" },
                { label: "😢 Bad", value: "bad" },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => submitMood(m.value)}
                  disabled={loadingMood}
                  className={`px-4 py-2 rounded-xl border transition ${
                    mood === m.value
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* ========================= */}
          {/* 🧠 CBT MODULES */}
          {/* ========================= */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              CBT Exercises
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div
                onClick={() => navigate("/cbt")}
                className="cursor-pointer bg-white/80 p-5 rounded-2xl shadow border hover:scale-[1.02] transition"
              >
                <h3 className="font-bold text-blue-600">
                  Breathing Exercise
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  Reduce anxiety using guided breathing.
                </p>
              </div>

              <div
                onClick={() => navigate("/cbt")}
                className="cursor-pointer bg-white/80 p-5 rounded-2xl shadow border hover:scale-[1.02] transition"
              >
                <h3 className="font-bold text-teal-600">
                  Thought Reframing
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  Challenge negative thinking patterns.
                </p>
              </div>

              <div className="bg-white/80 p-5 rounded-2xl shadow border">
                <h3 className="font-bold text-purple-600">
                  Journaling
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  Express emotions and reflect daily.
                </p>
              </div>

              <div className="bg-white/80 p-5 rounded-2xl shadow border">
                <h3 className="font-bold text-blue-500">
                  Behavioral Activation
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  Improve mood through positive actions.
                </p>
              </div>

            </div>
          </div>

          {/* ========================= */}
          {/* ⚡ QUICK ACTIONS */}
          {/* ========================= */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* AI SUPPORT */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-[28px] shadow-xl">

              <h2 className="text-xl font-bold">
                AI Support
              </h2>

              <p className="text-sm mt-2 opacity-90">
                Talk to your CBT assistant anytime.
              </p>

              <button
                onClick={() => navigate("/chat")}
                className="mt-4 px-5 py-2 bg-white text-blue-700 font-bold rounded-xl"
              >
                Open Chat
              </button>
            </div>

            {/* CRISIS SUPPORT */}
            <div
              onClick={() => navigate("/crisis")}
              className="cursor-pointer bg-white border border-red-200 p-6 rounded-[28px] shadow hover:scale-[1.02] transition"
            >

              <h2 className="text-xl font-bold text-red-600">
                Crisis Support
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Immediate help if you're overwhelmed.
              </p>

              <button className="mt-4 px-5 py-2 bg-red-100 text-red-600 font-bold rounded-xl">
                Get Help Now
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 🌿 FOOTER */}
      <Footer />
    </div>
  );
}