import { 
  ShieldCheck, 
  Brain, 
  Clock, 
  HeartHandshake, 
  Award, 
  GraduationCap, 
  Lock, 
  CheckCircle2 
} from "lucide-react";

export default function AboutSection() {
  const pillars = [
    {
      icon: <Brain className="w-5 h-5 text-blue-600" />,
      title: "Evidence-Based CBT",
      subtitle: "Clinically validated methods",
      desc: "Built on proven Cognitive Behavioural Therapy frameworks to help you identify automatic negative thoughts, question cognitive distortions, and build durable coping habits.",
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-600" />,
      title: "Private & Anonymous",
      subtitle: "Zero tracking of identity",
      desc: "Use the platform without your student registration number or real name. Faculty, lecturers, and peers have zero visibility into your entries or check-ins.",
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: "24/7 AI Thought Reframing",
      subtitle: "Support when you need it",
      desc: "Late-night exam anxiety or sudden distress can be managed in real time. Guided breathing, grounding exercises, and structured thought reframing are always accessible.",
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-blue-600" />,
      title: "Campus Counselor Link",
      subtitle: "Real professional care",
      desc: "When you need human guidance, connect directly with licensed counselors at the MMUST Guidance and Counseling Division and Health Directorate.",
    },
  ];

  return (
    <section id="about" className="relative px-3 sm:px-6 py-20 md:py-28 bg-slate-50/70 border-t border-slate-200">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            About the platform
          </p>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Built for the realities of university life.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            University life brings intense demands — from exams and coursework deadlines to financial stress and isolation. MMUST DCBT provides structured, confidential mental health tools directly on your phone.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                  {pillar.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5 mb-2.5">
                  {pillar.subtitle}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* University Commitment Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-left max-w-2xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Institutional Student Support Initiative</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Developed in coordination with the MMUST Directorate of Health Services and the Guidance & Counseling Division to support student psychological well-being across all faculties.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              href="#modules"
              className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors inline-block text-center"
            >
              Explore CBT Modules
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
