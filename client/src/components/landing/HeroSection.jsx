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
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 overflow-hidden bg-white text-slate-900 border-b border-slate-200/60">
      
      {/* 1. Full-Cover Background Image with Soft Clean Opacity on White */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img 
          src={depressionHeroImg} 
          alt="African university student reflecting the weight of campus depression" 
          className="w-full h-full object-cover object-center scale-105 opacity-20 filter contrast-105"
          loading="eager"
        />
        {/* Soft White Wash Gradient for crystal-clear readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95" />
      </div>

      {/* Soft Ambient Light Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-100/40 blur-[130px] rounded-full pointer-events-none" />

      {/* 2. Centered Content Container with Left & Right Margins */}
      <div className="w-full max-w-4xl mx-auto relative z-10 text-center space-y-6 sm:space-y-8">
        
        {/* Main Hero Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Behind the quiet smiles in class,{" "}
          <span className="text-blue-600 block mt-1.5">
            you don't have to carry depression alone.
          </span>
        </h1>

        {/* Culturally Grounded Narrative */}
        <div className="space-y-3.5 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-3xl mx-auto">
          <p>
            University life in Kenya carries heavy, unspoken burdens—the relentless pressure to succeed, financial strain, family expectations, and the days where getting out of bed feels like an impossible mountain.
          </p>
          <p className="text-slate-700 font-medium">
            Too often, we suffer in silence because of stigma or fear of being misunderstood. <strong className="text-slate-900 font-semibold">MMUST DCBT is built by our community, for our reality</strong>: a safe, completely anonymous digital sanctuary where you can unburden your mind, learn evidence-based Cognitive Behavioral tools, and heal on your own terms.
          </p>
        </div>

        {/* Action Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <a
            href="#download"
            onClick={() => trackEvent("begin_support_click", { source: "hero_section" })}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Begin Confidential Support</span>
            <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#app-showcase"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/90 hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base shadow-sm backdrop-blur-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Mobile App</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Reassurance & Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-slate-700 shadow-sm backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Anonymous & Free
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-slate-700 shadow-sm backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Zero Judgement & Stigma
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-slate-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" /> University Clinicians & Peer Support
          </span>
        </div>

      </div>

    </section>
  );
}
