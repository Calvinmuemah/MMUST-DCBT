import { 
  Smartphone, 
  Download,
  ShieldCheck,
  CheckCircle2,
  Cpu
} from "lucide-react";

export default function EarlyAdopterSection() {
  return (
    <section id="download" className="relative px-3 sm:px-6 py-16 sm:py-24 md:py-32 bg-slate-50/70 overflow-hidden border-t border-slate-200/80">
      <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: HEADLINE, BULLETS & DOWNLOAD APK BUTTON */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-blue-600" />
            Android Application Download
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Get the MMUST DCBT Android App.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
            Take command of your emotional resilience. Build daily habits to overcome anxiety, 
            academic stress, and depression — directly on your smartphone.
          </p>

          <div className="space-y-3.5 sm:space-y-4 pt-1">
            <p className="text-xs font-black uppercase tracking-widest text-blue-700">
              Key Application Features:
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-bold">24/7 AI Guidance:</strong> Evidence-based thought reframing and grounding exercises ready day or night.
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-bold">Direct APK Install:</strong> Download and install directly onto your Android device without waiting for store approval.
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-bold">100% Confidential:</strong> Complete anonymity with no student ID or phone number required to use the platform.
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-bold">Daily Self-Care & Journaling:</strong> Structured CBT exercises, mood tracking, and thought restructuring tools.
                </p>
              </div>
            </div>
          </div>

          {/* DEDICATED APK DOWNLOAD BUTTON (Replacing App Store / Play Store / PWA) */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            <a 
              href="/app-release.apk" 
              download="MMUSTDCBT.apk"
              className="flex items-center justify-center sm:justify-start gap-4 px-6 sm:px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] font-bold text-base transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-[10px] sm:text-[11px] text-blue-200 block uppercase font-bold tracking-wider">Direct Download</span>
                <span className="text-base sm:text-lg font-black text-white block">Download Android APK</span>
              </div>
              <span className="ml-1 sm:ml-3 px-2 sm:px-2.5 py-1 rounded-lg bg-blue-800/60 text-[10px] sm:text-xs font-bold text-blue-100 shrink-0">
                v1.0 • 28MB
              </span>
            </a>

          </div>

          <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Compatible with Android 7.0 and newer • Verified secure build</span>
          </p>

        </div>

        {/* RIGHT COLUMN: HAND HOLDING SMARTPHONE (Clean isolated transparent cutout) */}
        <div className="lg:col-span-6 flex justify-center items-center relative w-full mt-6 lg:mt-0">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] flex justify-center">
            
            {/* Ambient soft backlight behind the hand */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/15 via-teal-400/10 to-transparent blur-3xl rounded-full pointer-events-none" />

            {/* Hand holding the phone (isolated transparent cutout) */}
            <img 
              src="/mockup-hand.png" 
              alt="Hand holding MMUST DCBT Mobile App" 
              className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(15,23,42,0.18)] hover:scale-[1.03] transition-transform duration-500 select-none"
              loading="eager"
            />

          </div>
        </div>

      </div>
    </section>
  );
}
