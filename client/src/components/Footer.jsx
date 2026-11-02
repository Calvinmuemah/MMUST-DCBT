import { useState } from "react";
import { 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Download
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative bg-[#F8FAFC] border-t border-slate-200 text-slate-600 pt-16 sm:pt-20 pb-12 overflow-hidden">
      <div className="w-full px-3 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* COLUMN 1: BRAND INFO, APK DOWNLOAD & SOCIALS (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                MMUST <span className="text-blue-600">DCBT</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Digital Cognitive Behavioural Therapy Platform
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              An evidence-based mental health platform empowering university students at 
              Masinde Muliro University of Science & Technology with 24/7 confidential CBT exercises, 
              AI thought reframing, and personalized mental wellness guidance.
            </p>

            {/* DOWNLOAD APK ACTION IN FOOTER (Requested by User) */}
            <div className="pt-1">
              <a
                href="/app-release.apk"
                download="MMUSTDCBT.apk"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK (v1.0)</span>
              </a>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                Free download • Android 7.0+ • Size: ~28MB
              </p>
            </div>

            {/* SOCIAL ICONS (Only GitHub) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Calvinmuemah/MMUST-DCBT"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-all duration-300 shadow-sm group"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: COMPANY / PLATFORM (2 cols - Screenshot 4 style) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#about" className="hover:text-blue-600 transition-colors">
                  About DCBT
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-blue-600 transition-colors">
                  CBT Modules
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-blue-600 transition-colors">
                  Campus Impact
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-blue-600 transition-colors">
                  Download APK
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HELP & RESOURCES (2 cols - Screenshot 4 style) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#about" className="hover:text-blue-600 transition-colors">
                  Counseling Support
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-600 transition-colors">
                  Privacy & Ethics
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-600 transition-colors">
                  Clinical Protocols
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-blue-600 transition-colors">
                  Campus Impact
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-blue-600 transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER / UPDATES (4 cols - Screenshot 4 style) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
              Subscribe to Newsletter
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stay informed on campus mental wellness research, upcoming workshops, and new CBT feature releases.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium shadow-sm"
                />
              </div>

              {/* Blue Subscribe button (Screenshot 4) */}
              <button
                type="submit"
                disabled={subscribed}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 inline" />
              100% confidential. No spam, unsubscribe anytime.
            </p>
          </div>

        </div>

        {/* BOTTOM DIVIDER & COPYRIGHT (Screenshot 4 style) */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} MMUST DCBT Initiative. Masinde Muliro University of Science and Technology. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 font-medium">
            <a href="#faq" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">Terms & Ethical Guidelines</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}