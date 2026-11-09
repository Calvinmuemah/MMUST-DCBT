import { 
  Smartphone, 
  Download,
  ShieldCheck,
  CheckCircle2,
  Cpu
} from "lucide-react";

export default function EarlyAdopterSection() {
  return (
    <section id="download" className="relative px-3 sm:px-6 py-16 sm:py-24 md:py-32 bg-[#060911] overflow-hidden border-t border-slate-800/80">
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

        {/* RIGHT COLUMN: HAND HOLDING SMARTPHONE */}
        <div className="lg:col-span-6 flex justify-center items-center relative w-full mt-6 lg:mt-0">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] flex justify-center">
            
            {/* Ambient soft backlight behind the hand */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/25 via-teal-400/15 to-transparent blur-3xl rounded-full pointer-events-none" />

            {/* Hand holding the phone (isolated transparent cutout) */}
            <img 
              src="/mockup-hand.png" 
              alt="Hand holding MMUST DCBT Mobile App" 
              className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:scale-[1.03] transition-transform duration-500 select-none"
              loading="eager"
            />

          </div>
        </div>

      </div>
    </section>
  );
}
