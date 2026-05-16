import { useEffect, useState } from "react";
import { postRequest } from "../utils/api";

import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

export default function CBTExercise() {
  const [activeTab, setActiveTab] = useState("breathing");

  // =========================
  // 🫁 BREATHING EXERCISE
  // =========================
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer;

    if (running) {
      timer = setInterval(() => {
        setCount((prev) => {
          if (prev === 1) {
            setPhase((p) =>
              p === "inhale" ? "hold" : p === "hold" ? "exhale" : "inhale"
            );
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [running]);

  const startBreathing = async () => {
    setRunning(true);
    setPhase("inhale");

    // await postRequest("/cbt/breathing/start", { type: "4-7-8" });
  };

  const stopBreathing = async () => {
    setRunning(false);
    setPhase("ready");

    // await postRequest("/cbt/breathing/stop", {});
  };

  // =========================
  // 🧠 THOUGHT REFRAMING
  // =========================
  const [negativeThought, setNegativeThought] = useState("");
  const [reframedThought, setReframedThought] = useState("");

  const generateReframe = async () => {
    let response = "";

    const msg = negativeThought.toLowerCase();

    if (msg.includes("fail")) {
      response = "Failure is part of learning. This does not define your ability.";
    } else if (msg.includes("can't") || msg.includes("impossible")) {
      response = "Try breaking the task into smaller steps — you can improve gradually.";
    } else if (msg.includes("stupid") || msg.includes("worthless")) {
      response = "You are not defined by negative thoughts. Be kind to yourself.";
    } else {
      response = "Try viewing this situation from a more balanced perspective.";
    }

    setReframedThought(response);

    // await postRequest("/cbt/reframe", {
    //   input: negativeThought,
    //   output: response,
    // });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* 🌿 DASHBOARD NAVBAR */}
      <DashboardNavbar />

      {/* PAGE CONTENT */}
      <div className="flex-1 px-6 py-10">

        {/* BACKDROP */}
        <div className="absolute w-72 h-72 bg-blue-200/30 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-teal-200/30 rounded-full blur-3xl bottom-10 right-10"></div>

        <div className="relative max-w-4xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="bg-white/80 backdrop-blur-xl border rounded-[28px] p-6 shadow text-center">

            <h1 className="text-2xl font-black text-slate-900">
              CBT Exercises
            </h1>

            <p className="text-slate-500 mt-2">
              Guided therapeutic tools to improve mental wellbeing
            </p>

            {/* TABS */}
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setActiveTab("breathing")}
                className={`px-4 py-2 rounded-xl font-semibold ${
                  activeTab === "breathing"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                Breathing
              </button>

              <button
                onClick={() => setActiveTab("reframe")}
                className={`px-4 py-2 rounded-xl font-semibold ${
                  activeTab === "reframe"
                    ? "bg-teal-600 text-white"
                    : "bg-teal-100 text-teal-700"
                }`}
              >
                Thought Reframing
              </button>
            </div>
          </div>

          {/* 🫁 BREATHING MODULE */}
          {activeTab === "breathing" && (
            <div className="bg-white/80 backdrop-blur-xl border rounded-[28px] p-8 shadow text-center">

              <h2 className="text-xl font-bold text-blue-600">
                4-7-8 Breathing Exercise
              </h2>

              <p className="text-slate-500 mt-2">
                Follow the rhythm to calm your nervous system
              </p>

              <div className="mt-8 text-4xl font-black text-slate-800">
                {phase === "ready" ? "Ready" : phase.toUpperCase()}
              </div>

              <div className="text-2xl mt-3 text-slate-500">
                {running ? `${count}s` : ""}
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={startBreathing}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Start
                </button>

                <button
                  onClick={stopBreathing}
                  className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold"
                >
                  Stop
                </button>
              </div>
            </div>
          )}

          {/* 🧠 REFRAMING MODULE */}
          {activeTab === "reframe" && (
            <div className="bg-white/80 backdrop-blur-xl border rounded-[28px] p-8 shadow">

              <h2 className="text-xl font-bold text-teal-600">
                Thought Reframing Exercise
              </h2>

              <p className="text-slate-500 mt-2">
                Challenge negative thinking patterns
              </p>

              <textarea
                className="w-full mt-6 p-4 border rounded-xl focus:ring-2 focus:ring-teal-300 outline-none"
                rows="4"
                placeholder="Write a negative thought..."
                value={negativeThought}
                onChange={(e) => setNegativeThought(e.target.value)}
              />

              <button
                onClick={generateReframe}
                className="mt-4 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold"
              >
                Reframe Thought
              </button>

              {reframedThought && (
                <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl text-slate-700">
                  {reframedThought}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 🌿 FOOTER */}
      <Footer />
    </div>
  );
}