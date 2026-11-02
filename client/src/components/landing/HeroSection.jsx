import { 
  Download, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-3 sm:px-6 py-12 sm:py-16 md:py-24 overflow-hidden bg-white">
      {/* Soft Ambient Light Glows (Light Grayish) */}
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-slate-200/50 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-slate-100/60 blur-[120px] rounded-full pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
        
        {/* LEFT COLUMN: SMARTPHONE MOCKUP WITH SCREENSHOT (Hanging & Tilted) */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full py-6 sm:py-10">
          <div className="relative w-full max-w-[270px] sm:max-w-[310px] md:max-w-[330px]">
            
            {/* Suspended Ground Shadow (hanging effect) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-slate-900/30 blur-xl rounded-full animate-shadow-hang pointer-events-none" />

            {/* Ambient Backlight (Light Grayish) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/70 via-slate-100/60 to-slate-300/40 blur-3xl rounded-[60px] transform -rotate-6 scale-110 pointer-events-none" />

            {/* Hanging & Tilted Phone Frame */}
            <div className="relative animate-phone-hang will-change-transform transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Realistic Metallic Phone Bezel with Chrome Accent */}
              <div className="relative rounded-[44px] sm:rounded-[50px] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 p-[8px] sm:p-[10px] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4),0_10px_25px_-5px_rgba(100,116,139,0.25)] border-2 border-slate-600/60 ring-2 ring-slate-900/80">
                
                {/* Speaker Ear-piece Notch bar at top of bezel */}
                <div className="absolute top-3 sm:top-3.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-700/90 rounded-full z-30" />

                {/* Inner screen container with realistic curved glass */}
                <div className="relative rounded-[36px] sm:rounded-[42px] bg-white overflow-hidden border border-slate-200 select-none shadow-inner">
                  <img 
                    src="/phone-display.jpeg" 
                    alt="MMUST DCBT App Home Screen" 
                    className="w-full h-auto object-cover block"
                    loading="eager"
                  />
                  {/* Subtle glass reflection sheen across screen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: HERO TYPOGRAPHY & CALL TO ACTION */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 sm:space-y-7 lg:pl-4 text-left">
          
          {/* Mega Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            DIGITAL MENTAL HEALTH
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
              DESIGNED FOR STUDENTS.
            </span>
          </h1>

          {/* Descriptive Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
            MMUST DCBT is an evidence-based Digital Cognitive Behavioural Therapy platform 
            built to help university students overcome stress, depression, anxiety, and academic burnout 
            with 24/7 AI thought reframing and personalized wellness guidance.
          </p>

          {/* Action CTAs (Download APK as primary CTA) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
            <a
              href="#download"
              className="px-7 py-3.5 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 group text-center"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              <span>Download Android APK</span>
            </a>

            <a
              href="#how-it-works"
              className="px-7 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold text-sm sm:text-base hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2 text-center shadow-sm"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Subtext */}
          <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1 text-blue-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 inline text-blue-600" /> Free for all students
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 inline text-teal-600" /> Direct APK download
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 inline text-indigo-600" /> Clinical CBT protocols
            </span>
          </p>

          {/* Mini Stat Bar */}
          <div className="pt-5 border-t border-slate-200 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl">
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">500+</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Active Scholars</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-blue-600">24/7</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">AI Guidance</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-teal-600">100%</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Confidential</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
