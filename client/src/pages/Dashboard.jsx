import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../utils/api";
import { Bot, ChevronRight } from "lucide-react";

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

  // =========================
  // 📡 START AI SESSION
  // =========================
  const startChat = async () => {
    try {
      setLoadingMood(true); // Reusing loading state for button
      const res = await postRequest("/chat/session/start", { topic: "general" });
      navigate("/chat", { state: { sessionId: res.sessionId } });
    } catch (err) {
      alert(err.message || "Failed to start chat session");
    } finally {
      setLoadingMood(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      {/* PAGE CONTENT */}
      <div className="flex-1 px-6 py-8 md:py-12">

        <div className="relative max-w-6xl mx-auto space-y-8 animate-in fade-in duration-1000">

          {/* HEADER */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Good day, {profile?.name || "Student"} 👋
              </h1>

              <p className="text-slate-400 mt-1 font-bold text-sm uppercase tracking-[0.15em]">
                Your mental wellness control center
              </p>
            </div>

            <button
              onClick={startChat}
              disabled={loadingMood}
              className="w-full md:w-auto px-10 py-4 rounded-2xl bg-slate-900 text-white font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Bot size={20} />
              {loadingMood ? "Initializing..." : "Talk to MMUSTCare AI"}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN - STATS & MOOD */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* STATS CARDS */}
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard 
                  label="Risk Level" 
                  value={profile?.onboardingRiskLevel || "Low"} 
                  color="blue"
                  icon="🛡️"
                />
                <MetricCard 
                  label="Daily Goal" 
                  value="85%" 
                  color="teal"
                  icon="🎯"
                />
                <MetricCard 
                  label="Mood Status" 
                  value={mood || "Unset"} 
                  color="purple"
                  icon="✨"
                  capitalize
                />
              </div>

              {/* MOOD TRACKER */}
              <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
                
                <div className="relative z-10">
                  <h2 className="text-xl font-black text-slate-900 mb-2">How are you today?</h2>
                  <p className="text-slate-400 font-medium mb-8">Logging your mood daily helps track emotional trends.</p>

                  <div className="flex gap-4 flex-wrap">
                    {[
                      { label: "😄 Great", value: "great", color: "hover:bg-green-50 hover:border-green-200" },
                      { label: "🙂 Good", value: "good", color: "hover:bg-blue-50 hover:border-blue-200" },
                      { label: "😐 Okay", value: "okay", color: "hover:bg-slate-50 hover:border-slate-200" },
                      { label: "😟 Low", value: "low", color: "hover:bg-orange-50 hover:border-orange-200" },
                      { label: "😢 Bad", value: "bad", color: "hover:bg-red-50 hover:border-red-200" },
                    ].map((m) => (
                      <button
                        key={m.value}
                        onClick={() => submitMood(m.value)}
                        disabled={loadingMood}
                        className={`px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                          mood === m.value
                            ? "bg-slate-900 border-slate-900 text-white shadow-xl -translate-y-1"
                            : `bg-white border-slate-50 text-slate-500 ${m.color}`
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CBT MODULES */}
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  CBT Support Modules
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <ModuleCard 
                    title="Breathing Exercise" 
                    desc="Reduce anxiety using guided box breathing."
                    icon="🫁"
                    onClick={() => navigate("/cbt")}
                  />
                  <ModuleCard 
                    title="Thought Reframing" 
                    desc="Challenge negative thinking patterns effectively."
                    icon="🧠"
                    onClick={() => navigate("/cbt")}
                  />
                  <ModuleCard 
                    title="Self-Reflection" 
                    desc="Private journaling for emotional processing."
                    icon="📝"
                  />
                  <ModuleCard 
                    title="Sleep Hygiene" 
                    desc="CBT-based tools for better rest quality."
                    icon="🌙"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - SIDEBAR ACTIONS */}
            <div className="space-y-8">
              
              {/* CRISIS CARD */}
              <div 
                onClick={() => navigate("/crisis")}
                className="bg-red-600 rounded-[32px] p-8 text-white shadow-2xl shadow-red-200 cursor-pointer hover:bg-red-700 transition-all group"
              >
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-500">🆘</div>
                <h2 className="text-2xl font-black tracking-tight mb-3">Crisis Support</h2>
                <p className="text-white/80 font-medium leading-relaxed mb-8 text-sm">
                  If you're feeling completely overwhelmed or unsafe, immediate help is available.
                </p>
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20">
                  Get Help Now <ChevronRight size={16} />
                </div>
              </div>

              {/* TIPS CARD */}
              <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full"></div>
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">CBT Tip of the Day</h3>
                <p className="text-lg font-bold leading-relaxed relative z-10 italic">
                  "Thoughts are not facts. You can observe them without letting them define your reality."
                </p>
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

// 🧩 SUB-COMPONENTS
const MetricCard = ({ label, value, color, icon, capitalize }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
    <div className="flex items-center justify-between mb-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="text-xl">{icon}</div>
    </div>
    <h2 className={`text-xl font-black text-slate-900 ${capitalize ? 'capitalize' : ''}`}>{value}</h2>
  </div>
);

const ModuleCard = ({ title, desc, icon, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-[28px] border border-slate-100 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex gap-5 items-start ${onClick ? 'cursor-pointer' : 'opacity-60 grayscale'}`}
  >
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-400 text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);