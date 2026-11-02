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
    <section id="partners" className="relative px-3 sm:px-6 py-24 md:py-32 bg-white border-t border-slate-200/80">
      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Trusted by Students & Counselors
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Real feedback from students overcoming stress and campus clinical professionals advocating for early intervention.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white shadow-sm hover:shadow-xl flex flex-col justify-between group transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-300 group-hover:text-blue-500/40 transition-colors" />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-blue-600 font-semibold">{item.role}</p>
                  <p className="text-[10px] text-slate-500">{item.faculty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stakeholders Strip */}
        <div className="pt-12 border-t border-slate-200">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-500 mb-8">
            Institutional Stakeholders & Clinical Entities
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stakeholders.map((s, i) => (
              <div 
                key={i}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{s.name}</h4>
                <p className="text-[11px] text-blue-600 font-semibold">{s.role}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
