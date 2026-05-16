import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 text-slate-800 overflow-hidden">
      
      {/* NAVBAR COMPONENT */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative px-6 md:px-12 py-16 md:py-24">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-200/40 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              AI Powered CBT Support for Students
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight text-slate-900">
              Your Mental
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                {" "}Wellbeing
              </span>
              <br />
              Matters.
            </h1>

            <p className="mt-8 text-lg text-slate-600 leading-relaxed max-w-xl">
              A modern digital cognitive behavioural therapy platform helping
              university students manage stress, anxiety, depression, and
              academic pressure privately and effectively.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              
              <button
                onClick={() => navigate("/register")}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-lg shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Free Assessment
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-7 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-100 transition-all duration-300"
              >
                Login
              </button>

            </div>

            {/* STATS */}
            <div className="mt-14 grid grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl">
                <h2 className="text-3xl font-black text-blue-600">24/7</h2>
                <p className="text-sm text-slate-500 mt-2">
                  Mental Wellness Access
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl">
                <h2 className="text-3xl font-black text-teal-500">100%</h2>
                <p className="text-sm text-slate-500 mt-2">
                  Anonymous Support
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl">
                <h2 className="text-3xl font-black text-purple-500">AI</h2>
                <p className="text-sm text-slate-500 mt-2">
                  Personalized Guidance
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT (UNCHANGED UI) */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-teal-300/20 rounded-[40px] blur-2xl"></div>

            <div className="relative w-full max-w-md rounded-[36px] bg-white/80 backdrop-blur-xl border border-white shadow-2xl overflow-hidden">
              
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Welcome Back</p>
                    <h3 className="text-2xl font-bold mt-1">Calm Mind</h3>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                    😊
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">

                <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100">
                  <p className="text-sm text-slate-500">Today's Mood</p>
                  <h2 className="text-2xl font-bold mt-1 text-slate-800">
                    Feeling Better
                  </h2>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <p className="font-semibold text-slate-700">CBT Progress</p>
                    <p className="text-sm text-blue-600 font-semibold">72%</p>
                  </div>

                  <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[72%] bg-gradient-to-r from-blue-600 to-teal-500"></div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                  <p className="text-sm opacity-90">Daily Reminder</p>
                  <h3 className="text-lg font-bold mt-2">
                    Small steps every day lead to better mental wellbeing.
                  </h3>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 md:px-12 py-20 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center">
          
          <h2 className="text-4xl font-black text-slate-900">
            Designed for Student <span className="text-teal-500">Mental Wellness</span>
          </h2>

          <p className="mt-6 text-slate-600 text-lg">
            CBT + AI + Mood Tracking + Crisis Support
          </p>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {[
              { title: "AI Chat Support", emoji: "🤖" },
              { title: "Mood Tracking", emoji: "📈" },
              { title: "CBT Exercises", emoji: "🧠" },
              { title: "Emergency Support", emoji: "🆘" }
            ].map((item, i) => (
              <div key={i} className="p-7 bg-white rounded-[32px] shadow">
                <div className="text-3xl">{item.emoji}</div>
                <h3 className="mt-4 font-bold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-12 py-24 text-center">
        <h2 className="text-4xl font-black">How It Works</h2>

        <div className="mt-16 grid lg:grid-cols-3 gap-8 text-left">
          {[
            "Take Assessment",
            "Get Personalized CBT",
            "Track Progress"
          ].map((t, i) => (
            <div key={i} className="p-8 bg-white rounded-[36px] shadow">
              <h3 className="text-2xl font-bold">{t}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 pb-24">
        <div className="bg-gradient-to-r from-blue-700 to-teal-500 text-white p-12 rounded-[40px] text-center">
          <h2 className="text-4xl font-black">
            Start Your Mental Wellness Journey
          </h2>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-7 py-4 bg-white text-blue-700 font-bold rounded-2xl"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/features")}
              className="px-7 py-4 border border-white/40 rounded-2xl"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}