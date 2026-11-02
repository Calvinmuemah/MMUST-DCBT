import { useState } from "react";
import { 
  Brain, 
  MessageSquare, 
  Activity, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function ModulesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const modules = [
    {
      id: "cbt-restructuring",
      title: "CBT Cognitive Restructuring",
      category: "Evidence-Based Therapy",
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      desc: "Identify and deconstruct automatic negative thoughts (ANTs). Challenge cognitive distortions such as catastrophizing, mind-reading, and black-and-white thinking through guided Socratic dialogues.",
      benefits: [
        "Interactive 5-column Thought Record exercises",
        "Clinical cognitive distortion categorization",
        "Personalized rational replacement thought generation"
      ],
      previewCard: {
        tag: "Active CBT Exercise",
        title: "Thought: 'I am going to fail my engineering exam.'",
        distortion: "Identified: Catastrophizing & Fortune-telling",
        reframed: "Rational Reframe: 'I have prepared for 3 weeks and passed the cats. Feeling nervous is natural, but does not dictate my outcome.'",
        severity: "Anxiety Reduced: 85% → 30%"
      }
    },
    {
      id: "ai-companion",
      title: "24/7 CBT AI Companion",
      category: "Autonomous Mental Guidance",
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      desc: "Our conversational agent is specifically tailored for university students. Locked into strict CBT therapeutic bounds, it never offers medical diagnosis or unsafe medical advice.",
      benefits: [
        "Immediate emotional de-escalation scripts",
        "Grounding techniques (5-4-3-2-1 sensory exercises)",
        "Zero latency responses during late night hours"
      ],
      previewCard: {
        tag: "Live AI Session",
        title: "Session Topic: Academic Burnout & Imposter Syndrome",
        distortion: "Safe Mode: Locked to CBT Framework",
        reframed: "AI: 'Let us take a slow breath. You are dealing with a heavy semester workload. What is one small task we can focus on right now?'",
        severity: "Status: Calming Grounding Active"
      }
    },
    {
      id: "mood-analytics",
      title: "Mood & Stress Analytics",
      category: "Data-Driven Wellness",
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      desc: "Visualize your psychological trajectory over weeks and exam periods. Correlate daily challenges with stress levels to understand your emotional triggers.",
      benefits: [
        "Visual 7-day, 14-day and semester mood charts",
        "Correlations with sleep, exams, and social events",
        "Max streak monitoring to maintain daily mindfulness"
      ],
      previewCard: {
        tag: "Wellness Heatmap",
        title: "Weekly Check-in Completion: 100%",
        distortion: "Dominant Mood: Balanced & Focused",
        reframed: "Average Stress Score: 4.2 / 10 (Down 35% from midterms)",
        severity: "Current Streak: 18 Consecutive Days"
      }
    },
    {
      id: "guided-journaling",
      title: "Guided Journaling & Self-Care",
      category: "Reflective Self-Management",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      desc: "Process complex university experiences through structured emotional journaling, daily gratitude exercises, and grounded self-reflection routines.",
      benefits: [
        "Confidential encrypted journaling entries",
        "Guided prompts targeting student stress and burnout",
        "Daily reflection habit tracking and milestones"
      ],
      previewCard: {
        tag: "Daily Reflection Log",
        title: "Entry: 'Managing End-of-Semester Project Pressure'",
        distortion: "Focus Area: Time Management & Emotional Calm",
        reframed: "Self-Reflection: 'I broke my assignment into three 30-minute milestones. Feeling composed and clear-headed.'",
        severity: "Mood Outcome: Calm & Accomplished"
      }
    }
  ];

  const current = modules[activeTab];

  return (
    <section id="modules" className="relative px-3 sm:px-6 py-24 md:py-32 bg-slate-50/60 border-t border-slate-200/80">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Clinical Modules Crafted for <span className="text-blue-600">Student Well-being.</span>
            </h2>
          </div>
          <p className="text-slate-600 text-base max-w-sm">
            Proven cognitive tools combined with modern software engineering for seamless, confidential care.
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 custom-scrollbar">
          {modules.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all duration-300 ${
                activeTab === idx
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                  : "bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 border border-slate-200 shadow-sm"
              }`}
            >
              {m.icon}
              <span>{m.title}</span>
            </button>
          ))}
        </div>

        {/* 3D-STYLE SHOWCASE (Clean White Palette) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-[36px] p-8 md:p-12 shadow-xl">
          
          {/* Left info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-wider">
              {current.category}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {current.title}
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              {current.desc}
            </p>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Key Clinical Capabilities:
              </p>
              {current.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>Learn how this module operates</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right: Display Card */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Main Display Card */}
            <div className="relative w-full max-w-lg bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                    {current.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{current.title}</h4>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{current.previewCard.tag}</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Dynamic content simulation */}
              <div className="py-6 space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm font-medium text-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Trigger Scenario</span>
                  {current.previewCard.title}
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs font-semibold text-blue-900 leading-relaxed">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-1">Clinical Detection</span>
                  {current.previewCard.distortion}
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs font-medium text-teal-900 leading-relaxed">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block mb-1">CBT Therapeutic Output</span>
                  {current.previewCard.reframed}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {current.previewCard.severity}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  Verified Protocol
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
