import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌿 MOCK MOOD DATA (for CBT tracking)
  const [moodData, setMoodData] = useState([
    { day: "Mon", mood: 3 },
    { day: "Tue", mood: 4 },
    { day: "Wed", mood: 2 },
    { day: "Thu", mood: 5 },
    { day: "Fri", mood: 4 },
  ]);

  useEffect(() => {
    setMessages([
      {
        role: "ai",
        text: "Hi, I’m your CBT support assistant. How are you feeling today?",
      },
    ]);
  }, []);

  const generateMockResponse = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("anxious") || msg.includes("stress")) {
      return "Try a 4-7-8 breathing exercise. Inhale 4s, hold 7s, exhale 8s.";
    }

    if (msg.includes("sad")) {
      return "I'm here with you. What’s one small positive thing today?";
    }

    if (msg.includes("exam")) {
      return "Break study into 25-minute focus blocks (Pomodoro method).";
    }

    return "Tell me more about how you're feeling.";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    const aiResponse = generateMockResponse(currentInput);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
      setLoading(false);

      // 🌿 MOCK MOOD UPDATE (simulate emotional tracking)
      setMoodData((prev) => [
        ...prev.slice(-4),
        {
          day: "Now",
          mood: Math.floor(Math.random() * 5) + 1,
        },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* HEADER */}
      <div className="p-4 bg-white/70 backdrop-blur-xl border-b">
        <h1 className="text-xl font-black text-slate-900">
          AI CBT Support Chat
        </h1>
        <p className="text-sm text-slate-500">
          Safe, private mental health assistant
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* CHAT SIDE */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-slate-600 text-white"
                    : "bg-slate-50 border text-slate-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-slate-500 text-sm">AI is thinking...</div>
          )}
        </div>

        {/* 📊 SIDEBAR CHART */}
        <div className="hidden md:block w-[320px] border-l bg-white/60 backdrop-blur-xl p-4">

          <h2 className="text-sm font-bold text-slate-700 mb-4">
            Mood Tracking
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <XAxis dataKey="day" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Mood scale: 1 (low) → 5 (high)
          </p>
        </div>
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white/70 border-t flex gap-3">

        <input
          className="flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-blue-300 outline-none"
          placeholder="Share how you're feeling..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-slate-600 text-white font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}