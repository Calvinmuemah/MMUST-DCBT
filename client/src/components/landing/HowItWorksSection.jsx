import { 
  ClipboardCheck, 
  BrainCircuit, 
  TrendingUp, 
  Sparkles
} from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: "Self Assessment",
      subtitle: "PHQ-9 & GAD-7 Severity Scoring",
      desc: "Complete a quick, confidential mental wellness baseline. The system determines your stress severity score without asking for personal identification.",
      icon: <ClipboardCheck className="w-5 h-5 text-blue-600" />,
      badge: "Step 01",
    },
    {
      step: 2,
      title: "Daily CBT Exercises",
      subtitle: "Thought Restructuring & Journaling",
      desc: "Engage in guided cognitive reframing, log automatic negative thoughts, and chat with our 24/7 empathetic AI CBT assistant to build mental resilience.",
      icon: <BrainCircuit className="w-5 h-5 text-blue-600" />,
      badge: "Step 02",
    },
    {
      step: 3,
      title: "Track Progress & Growth",
      subtitle: "Mood Trends & Habit Mastery",
      desc: "Monitor your emotional well-being over time with weekly insights, streak tracking, and evidence-based CBT exercises to sustain long-term resilience.",
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      badge: "Step 03",
    },
  ];

  return (
    <section id="how-it-works" className="relative px-3 sm:px-6 py-20 md:py-28 bg-[#090D16] border-t border-slate-800/80 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            How it works
          </p>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How does it work?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
            A straightforward, confidential 3-step pathway to help students manage stress, negative thoughts, and emotional strain.
          </p>
        </div>

        {/* 3 STEPS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item, i) => (
            <div 
              key={i} 
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    0{item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-blue-400 mb-3">
                  {item.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
