import { useState } from "react";
import { Menu, X, Download } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "CBT Modules", href: "#modules" },
    { label: "Campus Impact", href: "#impact" },
    { label: "Download App", href: "#download" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200/80 transition-all duration-300">
      <div className="w-full px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        
        {/* LOGO - Just MMUSTDCBT */}
        <a href="#" className="flex items-center group">
          <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            MMUST<span className="text-blue-600">DCBT</span>
          </span>
        </a>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Download APK Button */}
          <a
            href="#download"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/25 hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK</span>
          </a>
        </div>

        {/* MOBILE MENU TOGGLE & QUICK APK FOR SMALL SCREENS */}
        <div className="lg:hidden flex items-center gap-1.5">
          <a
            href="#download"
            className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-md bg-blue-600 text-white font-bold shadow-sm"
          >
            <Download className="w-3 h-3" />
            <span>APK</span>
          </a>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-3 py-3 bg-white border-b border-slate-200 space-y-2.5 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="flex flex-col space-y-1 text-xs font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="/app-release.apk"
              download="MMUSTDCBT.apk"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Android APK (v1.0)</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}