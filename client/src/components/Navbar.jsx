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
      <div className="w-full px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* LOGO - Just MMUSTDCBT */}
        <a href="#" className="flex items-center group">
          <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            MMUST<span className="text-blue-600">DCBT</span>
          </span>
        </a>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-600">
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
        <div className="hidden sm:flex items-center gap-3">
          {/* Download APK Button */}
          <a
            href="#download"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span>Download APK</span>
          </a>
        </div>

        {/* MOBILE MENU TOGGLE & QUICK APK FOR SMALL SCREENS */}
        <div className="lg:hidden flex items-center gap-2">
          <a
            href="#download"
            className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>APK</span>
          </a>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-5 bg-white border-b border-slate-200 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href="/app-release.apk"
              download="MMUSTDCBT.apk"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Android APK (v1.0)</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}