import { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";

export default function ImpactStatsSection() {
  const [counts, setCounts] = useState({
    students: 1,
    privacy: 1,
    modules: 1,
  });
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let animId = null;
    let startTime = null;
    const duration = 1500; // 1.5s smooth easing

    const targets = {
      students: 500,
      privacy: 100,
      modules: 6,
    };

    const startAnimation = () => {
      if (animId) cancelAnimationFrame(animId);
      startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // easeOutExpo curve for pleasant acceleration and gentle deceleration
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        setCounts({
          students: Math.floor(1 + (targets.students - 1) * ease),
          privacy: Math.floor(1 + (targets.privacy - 1) * ease),
          modules: Math.floor(1 + (targets.modules - 1) * ease),
        });

        if (progress < 1) {
          animId = requestAnimationFrame(animate);
        } else {
          setCounts(targets);
        }
      };

      animId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          if (animId) cancelAnimationFrame(animId);
          setCounts({ students: 1, privacy: 1, modules: 1 });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  const stats = [
    {
      display: `${counts.students}+`,
      label: "Students Supported",
      desc: "MMUST students actively using guided CBT check-ins and reflection logs across various faculties.",
    },
    {
      display: "24/7",
      label: "Always Accessible",
      desc: "Immediate grounding exercises, chat reframing, and self-care tools ready at any hour.",
    },
    {
      display: `${counts.privacy}%`,
      label: "Anonymous & Private",
      desc: "No student registration numbers, academic grades, or personal identifying records stored.",
    },
    {
      display: `${counts.modules}+`,
      label: "Targeted Modules",
      desc: "Structured exercises for study stress, thought distortions, financial anxiety, and daily planning.",
    }
  ];

  return (
    <section id="impact" className="relative px-3 sm:px-6 py-20 md:py-28 bg-white border-t border-slate-200">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Campus Impact
          </p>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Supporting mental health across campus.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Practical, evidence-informed digital tools designed to make seeking support normal, accessible, and stigma-free.
          </p>
        </div>

        {/* 4 Stats Cards with Smooth Number Count Animations */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
                  {s.display}
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2 mb-2">
                  {s.label}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Quote Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-3xl mx-auto space-y-2.5">
          <p className="text-sm sm:text-base text-slate-800 italic font-medium leading-relaxed">
            "By offering cognitive restructuring and self-care tools confidentially on mobile, MMUST DCBT removes the hesitation and fear of judgment associated with mental health support."
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            — MMUST Student Well-being Initiative
          </p>
        </div>

      </div>
    </section>
  );
}
