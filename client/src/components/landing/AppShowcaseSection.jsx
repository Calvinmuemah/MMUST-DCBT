import { useState, useEffect, useRef } from "react";
import { 
  Download, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

export default function AppShowcaseSection() {
  const [studentCount, setStudentCount] = useState(1);
  const counterRef = useRef(null);

  useEffect(() => {
    const node = counterRef.current;
    if (!node) return;

    let animId = null;
    let startTime = null;
    const duration = 1400; // 1.4s smooth settling count
    const target = 500;
    const startValue = 1;

    const startCountAnimation = () => {
      if (animId) cancelAnimationFrame(animId);
      startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // easeOutExpo curve: fast burst then gentle settling
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(startValue + (target - startValue) * ease);
        
        setStudentCount(currentVal);

        if (progress < 1) {
          animId = requestAnimationFrame(animate);
        } else {
          setStudentCount(target);
        }
      };

      animId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger the animation from 1 to 500+ when scrolling into view
          startCountAnimation();
        } else {
          // Reset when scrolled out of view so it animates again when scrolling back
          if (animId) cancelAnimationFrame(animId);
          setStudentCount(1);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(node);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="app-showcase" className="relative min-h-[60vh] flex items-center justify-center px-3 sm:px-6 py-16 sm:py-20 md:py-24 overflow-hidden bg-[#090D16] border-t border-slate-800/80">
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="w-full relative z-10 text-center space-y-8">
        
        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Digital cognitive therapy, <br />
          <span className="text-blue-400">built for MMUST students.</span>
        </h2>

        {/* Descriptive Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
          A free, confidential CBT platform helping university students navigate academic pressure, stress, and anxiety with 24/7 guided thought restructuring and personalized wellness tools.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
          <a
            href="#download"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group text-center"
          >
            <Download className="w-4 h-4" />
            <span>Download Android APK</span>
          </a>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 active:bg-slate-900 border border-slate-700/80 text-slate-200 font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 text-center"
          >
            <span>How It Works</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Trust Subtext */}
        <p className="text-xs text-slate-400 font-medium flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1">
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Free for all students
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 100% confidential & anonymous
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Direct Android download
          </span>
        </p>

        {/* Stat Cards with Animated Counter */}
        <div 
          ref={counterRef}
          className="pt-8 border-t border-slate-800/80 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors shadow-sm">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tabular-nums">
              {studentCount}+
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Students supported</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors shadow-sm">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-400">24/7</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Always available</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors shadow-sm">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400">Zero</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Personal data tracked</p>
          </div>
        </div>

      </div>
    </section>
  );
}
