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
    <section id="modules" className="relative px-3 sm:px-6 py-20 md:py-28 bg-slate-50/70 border-t border-slate-200">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Interactive Tools
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Clinical Modules Crafted for <span className="text-blue-600">Student Well-being.</span>
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-sm leading-relaxed">
            Evidence-based CBT methods structured into easy, daily exercises on your phone.
          </p>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 custom-scrollbar">
          {modules.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === idx
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span className={activeTab === idx ? "text-blue-400" : "text-blue-600"}>
                {m.icon}
              </span>
              <span>{m.title}</span>
            </button>
          ))}
        </div>

        {/* SHOWCASE CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          
          {/* Left info */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-50 text-xs font-semibold text-blue-700">
              {current.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {current.title}
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {current.desc}
            </p>

            <div className="space-y-2.5 pt-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                What you can do:
              </p>
              {current.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>See how it works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Display Card */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-7 space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    {current.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{current.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{current.previewCard.tag}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active
                </span>
              </div>

              {/* Real Thought Record Exercise View */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-normal text-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Automatic Negative Thought</span>
                  {current.previewCard.title}
                </div>

                <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">Identified Distortion</span>
                  {current.previewCard.distortion}
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Balanced Reframe</span>
                  {current.previewCard.reframed}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
