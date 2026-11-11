import { 
  Download,
  CheckCircle2
} from "lucide-react";

export default function EarlyAdopterSection() {
  return (
    <section id="download" className="relative px-3 sm:px-6 py-14 sm:py-16 md:py-20 bg-[#060911] overflow-hidden border-t border-slate-800/80">
      {/* Ambient radial glows behind CTA and mockup */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: HEADLINE, BULLETS & DOWNLOAD APK BUTTON */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
          
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Mobile Application
          </p>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Get the MMUST DCBT Android App.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
            Access confidential self-care tools, daily CBT exercises, and guided thought restructuring anytime directly from your Android phone.
          </p>

          <div className="space-y-3 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Key Features:
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <p>
                <strong className="text-white font-semibold">24/7 AI Guidance:</strong> Guided thought reframing and grounding exercises ready day or night.
              </p>
              <p>
                <strong className="text-white font-semibold">Direct APK Install:</strong> Download and install directly onto your Android device in seconds.
              </p>
              <p>
                <strong className="text-white font-semibold">100% Anonymous:</strong> No student registration number, email, or personal details required.
              </p>
              <p>
                <strong className="text-white font-semibold">Self-Care & Journaling:</strong> Structured thought records, day planner, and mood tracking.
              </p>
            </div>
          </div>

          {/* DEDICATED APK DOWNLOAD BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a 
              href="/app-release.apk" 
              download="MMUSTDCBT.apk"
              className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Download Android APK</span>
              <span className="text-xs text-blue-200 border-l border-blue-400/40 pl-2">v1.0 • ~28MB</span>
            </a>
          </div>

          <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Compatible with Android 7.0 and newer • Direct download</span>
          </p>

        </div>

        {/* RIGHT COLUMN: SMARTPHONE MOCKUP WITH SCREENSHOT */}
        <div className="lg:col-span-6 flex justify-center items-center relative w-full mt-4 lg:mt-0 py-2 sm:py-4">
          <div className="relative w-full max-w-[210px] sm:max-w-[230px] md:max-w-[250px]">
            
            {/* Suspended Ground Shadow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-blue-900/40 blur-lg rounded-full animate-shadow-hang pointer-events-none" />

            {/* Ambient Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-teal-500/20 to-indigo-600/30 blur-2xl rounded-[50px] transform -rotate-6 scale-105 pointer-events-none" />

            {/* Hanging & Tilted Phone Frame */}
            <div className="relative animate-phone-hang will-change-transform transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Realistic Metallic Phone Bezel with Chrome Accent */}
              <div className="relative rounded-[36px] sm:rounded-[42px] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 p-[6px] sm:p-[8px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_10px_20px_-5px_rgba(37,99,235,0.2)] border-2 border-slate-600/60 ring-2 ring-slate-900/80">
                
                {/* Speaker Ear-piece Notch bar at top of bezel */}
                <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-700/90 rounded-full z-30" />

                {/* Inner screen container with realistic curved glass */}
                <div className="relative rounded-[30px] sm:rounded-[34px] bg-white overflow-hidden border border-slate-200 select-none shadow-inner">
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

      </div>
    </section>
  );
}
