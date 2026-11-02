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
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      title: "Evidence-Based CBT",
      subtitle: "Scientifically Validated Frameworks",
      desc: "Built directly upon Beckian Cognitive Behavioural Therapy protocols to identify automatic thoughts, challenge cognitive distortions, and instill resilient coping mechanisms.",
      accent: "bg-blue-50 text-blue-600",
      border: "border-slate-200 hover:border-blue-400",
    },
    {
      icon: <Lock className="w-6 h-6 text-teal-600" />,
      title: "100% Anonymity & Zero Stigma",
      subtitle: "Absolute Student Privacy",
      desc: "Students can register anonymously or explore as guests with alias profiles. Academic departments, lecturers, and peers have zero visibility into user sessions.",
      accent: "bg-teal-50 text-teal-600",
      border: "border-slate-200 hover:border-teal-400",
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: "24/7 AI Therapeutic Companion",
      subtitle: "Always-On Empathetic Guidance",
      desc: "Late-night anxiety before an examination or sudden emotional distress can be addressed in real-time. Our safety-locked AI guides students through deep breathing and reframing.",
      accent: "bg-indigo-50 text-indigo-600",
      border: "border-slate-200 hover:border-indigo-400",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-600" />,
      title: "Campus Counselor Synergy",
      subtitle: "University Support Alignment",
      desc: "Connects students with professional counseling guidance and confidential mental health resources at the MMUST Health Directorate whenever needed.",
      accent: "bg-rose-50 text-rose-600",
      border: "border-slate-200 hover:border-rose-400",
    },
  ];

  return (
    <section id="about" className="relative px-3 sm:px-6 py-24 md:py-32 bg-slate-50/60 border-t border-slate-200/80">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            About MMUST DCBT
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Bridging Mental Care & Campus Life
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            University life presents intense hurdles — from exam strain and career uncertainty to social isolation. 
            MMUST DCBT is an institutional breakthrough providing confidential, accessible, and clinical cognitive support 
            directly to the hands of every student at Masinde Muliro University.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className={`p-8 rounded-3xl bg-white border ${pillar.border} hover:shadow-xl hover:scale-[1.01] transition-all duration-300 shadow-sm flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${pillar.accent} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    {pillar.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Pillar 0{i + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1 mb-3">
                  {pillar.subtitle}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>

            </div>
          ))}
        </div>

        {/* University Commitment Banner */}
        <div className="mt-16 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-blue-50 via-white to-teal-50 border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Institutional Mental Health Initiative
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Developed in strategic alignment with the MMUST Directorate of Health Services and the Student Affairs Division 
              to foster psychological well-being, academic resilience, and sustained mental wellness across all faculties.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="#modules"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all inline-block text-center"
            >
              Explore CBT Modules
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
