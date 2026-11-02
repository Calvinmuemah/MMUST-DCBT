import { 
  ClipboardCheck, 
  BrainCircuit, 
  TrendingUp, 
  Download, 
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
    <section id="how-it-works" className="relative px-3 sm:px-6 py-16 sm:py-24 md:py-32 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="w-full relative z-10">
        
        {/* Section Heading (Screenshot 3 style) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 md:mb-28 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Clinical Protocol
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            How does it work?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            A simple, evidence-based 3-step therapeutic pathway designed to guide students from acute stress to psychological stability.
          </p>
        </div>

        {/* 3 STEPS CONNECTED BY CURVED DASHED LINE (Screenshot 3 Recreation) */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* SVG DOTTED CURVED LINE (Visible on Desktop) */}
          <div className="hidden md:block absolute top-7 left-1/6 right-1/6 w-2/3 h-12 mx-auto pointer-events-none z-0">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 800 60" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 50 30 C 200 -10, 250 70, 400 30 C 550 -10, 600 70, 750 30"
                stroke="rgba(37, 99, 235, 0.4)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {steps.map((item, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center text-center space-y-4 sm:space-y-5 group"
              >
                {/* Circular Numbered Badge (Screenshot 3 style) */}
                <div className="relative">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-white border-2 border-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-blue-600 font-black text-lg sm:text-xl shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-all duration-300">
                    <span className="group-hover:text-white transition-colors">
                      {item.step}
                    </span>
                  </div>
                  
                  {/* Icon Indicator Pill */}
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 max-w-xs px-2">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    {item.badge}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 sm:mt-20 text-center">
          <a
            href="#download"
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span>Download APK & Start Your Journey</span>
          </a>
        </div>

      </div>
    </section>
  );
}
