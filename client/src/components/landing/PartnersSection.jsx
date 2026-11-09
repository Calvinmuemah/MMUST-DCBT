import { 
  Building2, 
  Quote, 
  Star
} from "lucide-react";

export default function PartnersSection() {
  const testimonials = [
    {
      name: "Brian O.",
      role: "3rd Year Computer Science",
      faculty: "School of Computing & Informatics",
      text: "During last semester's exam season, I was having recurring panic attacks. Using the 5-4-3-2-1 grounding exercise and the thought reframing module at 1:00 AM completely de-escalated my anxiety. It changed how I handle academic pressure.",
      avatarSeed: "brian",
      rating: 5
    },
    {
      name: "Faith K.",
      role: "2nd Year Nursing",
      faculty: "School of Nursing, Midwifery & Paramedical",
      text: "As a nursing student, clinical rotations combined with heavy lectures left me overwhelmed. MMUST DCBT gave me a safe, anonymous place to journal and reflect without fear of faculty judgment.",
      avatarSeed: "faith",
      rating: 5
    },
    {
      name: "Dr. E. Wasike",
      role: "Clinical Psychologist & Counselor",
      faculty: "MMUST Guidance & Counseling Division",
      text: "This platform is an invaluable asset to our campus community. It catches mild distress before it escalates, giving students accessible cognitive tools whenever they need support.",
      avatarSeed: "counselor",
      rating: 5
    }
  ];

  const stakeholders = [
    { name: "MMUST Health Services", role: "Primary Clinical Partner", desc: "Main campus medical clinic promoting student wellness and counseling initiatives." },
    { name: "Guidance & Counseling", role: "Counseling Division", desc: "Certified mental health professionals on campus." },
    { name: "Dean of Students", role: "Student Affairs", desc: "Promoting student welfare and academic resilience." },
    { name: "Student Health Committee", role: "Peer Advocates", desc: "Student champions raising campus mental health awareness." }
  ];

  return (
    <section id="partners" className="relative px-3 sm:px-6 py-20 md:py-28 bg-white border-t border-slate-200">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Student & Counselor Feedback
          </p>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by students and campus counselors.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Practical reflections from students managing coursework pressure and campus mental health professionals.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-blue-500/30" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-blue-600 font-medium">{item.role}</p>
                  <p className="text-[10px] text-slate-500">{item.faculty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stakeholders Strip */}
        <div className="pt-10 border-t border-slate-200">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            Campus Counseling & Support Partners
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stakeholders.map((s, i) => (
              <div 
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{s.name}</h4>
                <p className="text-[11px] text-blue-600 font-medium">{s.role}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
