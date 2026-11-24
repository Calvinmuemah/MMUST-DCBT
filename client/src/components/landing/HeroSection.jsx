import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import depressionHeroImg from "../../assets/african-student-depression.jpg";
import { trackEvent } from "../../utils/analytics";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 overflow-hidden bg-slate-950 text-white">
      
      {/* 1. Full-Cover Background Image with Controlled Opacity */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img 
          src={depressionHeroImg} 
          alt="African university student reflecting the weight of campus depression" 
          className="w-full h-full object-cover object-center scale-105 opacity-25 filter brightness-75 contrast-110"
          loading="eager"
        />
        {/* Soft Vignette & Atmospheric Overlay for perfect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
      </div>

      {/* Subtle Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* 2. Centered Content Container with Left & Right Margins */}
      <div className="w-full max-w-4xl mx-auto relative z-10 text-center space-y-6 sm:space-y-8">
        
        {/* Main Hero Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Behind the quiet smiles in class,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-300 block mt-1.5">
            you don't have to carry depression alone.
          </span>
        </h1>

        {/* Culturally Grounded Narrative */}
        <div className="space-y-3.5 text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-3xl mx-auto">
          <p>
            University life in Kenya carries heavy, unspoken burdens—the relentless pressure to succeed, financial strain, family expectations, and the days where getting out of bed feels like an impossible mountain.
          </p>
          <p className="text-slate-100 font-medium">
            Too often, we suffer in silence because of stigma or fear of being misunderstood. <strong className="text-white font-semibold">MMUST DCBT is built by our community, for our reality</strong>: a safe, completely anonymous digital sanctuary where you can unburden your mind, learn evidence-based Cognitive Behavioral tools, and heal on your own terms.
          </p>
        </div>

        {/* Action Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <a
            href="#download"
            onClick={() => trackEvent("begin_support_click", { source: "hero_section" })}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Begin Confidential Support</span>
            <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#app-showcase"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 active:bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Mobile App</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Reassurance & Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Anonymous & Free
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-200 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Zero Judgement & Stigma
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" /> University Clinicians & Peer Support
          </span>
        </div>

      </div>

    </section>
  );
}
