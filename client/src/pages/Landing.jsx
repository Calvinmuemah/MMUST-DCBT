import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postRequest } from "../utils/api";

export default function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [name, setName] = useState("");

  const handleAnonymousJoin = async () => {
    if (!name.trim()) return;
    
    try {
      setLoading(true);
      const res = await postRequest("/auth/anonymous", { name });
      
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/assessment");
      }
    } catch (err) {
      alert(err.message || "Failed to join anonymously");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 overflow-hidden font-sans">
      
      {/* NAVBAR COMPONENT */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative px-6 md:px-12 py-20 md:py-32">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/10 blur-[120px] rounded-full animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8 border border-blue-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              AI Powered CBT Support for Students
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight">
              Your Mental
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent italic">
                {" "}Wellbeing
              </span>
              <br />
              Matters.
            </h1>

            <p className="mt-8 text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
              A premium digital cognitive behavioural therapy platform helping
              university students manage stress, anxiety, and academic pressure 
              privately and effectively.
            </p>

            {/* BUTTONS */}
            <div className="mt-12 flex flex-col sm:flex-row gap-5">
              
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
              >
                Get Started
              </button>

              <button
                onClick={() => setShowNameDialog(true)}
                className="px-8 py-4 rounded-2xl border-2 border-blue-600 text-blue-600 font-bold text-lg hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300"
              >
                Join Anonymously
              </button>

            </div>

            {/* QUICK STATS */}
            <div className="mt-16 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-black text-slate-900">500+ Students</p>
                <p className="text-slate-500 font-medium">Using MMUSTCare daily</p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - APP MOCKUP */}
          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-[60px] blur-3xl"></div>

            <div className="relative w-full max-w-[420px] mx-auto perspective-1000 group">
              <div className="relative rounded-[48px] bg-slate-900 p-4 shadow-2xl transition-transform duration-500 group-hover:rotate-y-12">
                
                {/* INNER UI MOCKUP */}
                <div className="bg-white rounded-[36px] overflow-hidden aspect-[9/19] flex flex-col">
                  
                  {/* TOP NAV */}
                  <div className="h-16 px-6 flex items-center justify-between border-b bg-white/80 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">M</div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dashboard</p>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight">Welcome to MMUSTCare</h3>
                    </div>

                    {/* AI CARD */}
                    <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-5 text-white shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">🤖</div>
                        <p className="font-bold">CBT Assistant</p>
                      </div>
                      <p className="text-sm font-medium opacity-90 leading-relaxed mb-4">
                        Ready to talk about your thoughts and feelings today?
                      </p>
                      <button className="w-full py-2.5 bg-white text-blue-700 font-bold rounded-xl text-sm">
                        Start Chatting
                      </button>
                    </div>

                    {/* MOOD STATS */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Weekly Goal</p>
                        <p className="text-lg font-black text-slate-900 mt-1">85%</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Mindfulness</p>
                        <p className="text-lg font-black text-slate-900 mt-1">12h</p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANONYMOUS NAME DIALOG */}
      {showNameDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNameDialog(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in fade-in duration-300">
            <h2 className="text-2xl font-black text-slate-900">What's your name?</h2>
            <p className="text-slate-500 mt-2 font-medium">We'll use this to personalize your journey. You remain 100% anonymous.</p>
            
            <div className="mt-8">
              <input
                type="text"
                autoFocus
                placeholder="Enter your name or nickname"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnonymousJoin()}
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowNameDialog(false)}
                className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAnonymousJoin}
                disabled={loading || !name.trim()}
                className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? "Joining..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURES SECTION (RETOUCHED) */}
      <section id="features" className="px-6 md:px-12 py-32 bg-white relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Powerful Features to <span className="text-blue-600">Elevate</span> Your Mind.
              </h2>
            </div>
            <p className="text-slate-500 font-medium text-lg max-w-sm">
              Science-backed tools integrated with modern technology for the best support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "AI Chat Support", desc: "24/7 personalized CBT guidance with our advanced AI.", icon: "🤖", color: "blue" },
              { title: "Mood Tracking", desc: "Visual insights into your emotional patterns over time.", icon: "📈", color: "teal" },
              { title: "CBT Exercises", desc: "Interactive modules to reframe thoughts and reduce stress.", icon: "🧠", color: "purple" },
              { title: "Crisis Support", desc: "Immediate access to university and emergency help.", icon: "🆘", color: "red" }
            ].map((item, i) => (
              <div key={i} className="group p-8 bg-[#F8FAFC] rounded-[40px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 cursor-default">
                <div className={`w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}