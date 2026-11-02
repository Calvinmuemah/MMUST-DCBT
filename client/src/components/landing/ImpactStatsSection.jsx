import { 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";

export default function ImpactStatsSection() {
  const stats = [
    {
      value: "94%",
      label: "Stress Reduction",
      desc: "Reported decrease in anxiety and academic distress after 4 weeks of structured CBT check-ins.",
      badge: "Clinical Outcome"
    },
    {
      value: "< 90s",
      label: "Intervention Speed",
      desc: "Instant grounding exercises and de-escalation response during late-night distress episodes.",
      badge: "24/7 Availability"
    },
    {
      value: "5,000+",
      label: "Thought Logs Completed",
      desc: "Anonymous cognitive restructuring sessions completed by university students across all faculties.",
      badge: "Campus Adoption"
    },
    {
      value: "100%",
      label: "Student Anonymity",
      desc: "Zero tracking of student registration numbers, grades, or personal identifying records.",
      badge: "Ethical Guarantee"
    }
  ];

  return (
    <section id="impact" className="relative px-3 sm:px-6 py-24 md:py-32 bg-white border-t border-slate-200/80">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Research & Campus Impact
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Measurable Psychological Outcomes
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Data-backed metrics derived from ongoing digital mental wellness trials at Masinde Muliro University.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-blue-400 hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="inline-block px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-6">
                  {s.badge}
                </div>

                <div className="text-4xl sm:text-5xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {s.value}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mt-2 mb-3">
                  {s.label}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-teal-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Trial Data</span>
              </div>
            </div>
          ))}
        </div>

        {/* Research Quote Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-blue-50/60 border border-blue-200/80 text-center max-w-4xl mx-auto space-y-3">
          <p className="text-base sm:text-lg text-slate-800 italic font-medium leading-relaxed">
            "By offering cognitive restructuring and mood tracking on a mobile device without requiring identification, 
            MMUST DCBT removes the societal stigma associated with seeking university mental healthcare."
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
            — MMUST Mental Health Advisory Working Group
          </p>
        </div>

      </div>
    </section>
  );
}
