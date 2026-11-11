import { 
  HeartHandshake, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import depressionHeroImg from "../../assets/african-student-depression.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-3 sm:px-6 py-12 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      
      {/* Soft Ambient Warmth Glows */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-blue-100/60 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-50/70 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a06_1px,transparent_1px),linear-gradient(to_bottom,#0f172a06_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
        
        {/* ========================================================
            LEFT COLUMN: Human Story & Depression Awareness Copy
           ======================================================== */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
          

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Behind the quiet smiles in class,{" "}
            <span className="text-blue-600 block mt-1">
              you don't have to carry depression alone.
            </span>
          </h1>

          {/* Culturally Grounded Narrative ("Something that says about us") */}
          <div className="space-y-3 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            <p>
              University life in Kenya carries heavy, unspoken burdens—the relentless pressure to succeed, financial strain, family expectations, and the days where getting out of bed feels like an impossible mountain.
            </p>
            <p className="text-slate-700 font-medium">
              Too often, we suffer in silence because of stigma or fear of being misunderstood. <strong>MMUST DCBT is built by our community, for our reality</strong>: a safe, completely anonymous digital sanctuary where you can unburden your mind, learn evidence-based Cognitive Behavioral tools, and heal on your own terms.
            </p>
          </div>

          {/* Action Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <a
              href="/register"
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 text-center group cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
              <span>Begin Confidential Support</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="#app-showcase"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 text-center"
            >
              <span>Explore Mobile App</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Reassurance & Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Anonymous & Free
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Zero Judgement & Stigma
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" /> University Clinicians & Peer Support
            </span>
          </div>


        </div>

        {/* ========================================================
            RIGHT COLUMN: Authentic African Student Photograph & Testimonial
           ======================================================== */}
        <div className="lg:col-span-6 relative flex justify-center w-full">
          
          {/* Background Ambient Glow for Image */}
          <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-teal-500/10 rounded-[36px] blur-2xl transform rotate-1 pointer-events-none" />

          {/* Framed Image Container */}
          <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.18)] bg-slate-900 group">
            
            {/* The Authentic Photograph */}
            <img 
              src={depressionHeroImg} 
              alt="African university student sitting thoughtfully with books, reflecting the weight of campus depression" 
              className="w-full h-auto aspect-[4/3] sm:aspect-[16/11] object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              loading="eager"
            />

            {/* Subtle Gradient Overlay for visual polish */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />

          </div>

        </div>

      </div>

    </section>
  );
}
