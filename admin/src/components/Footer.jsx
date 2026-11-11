import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-5 px-6 md:px-8 mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">MMUSTCare</span>
          <span>•</span>
          <span>Masinde Muliro University of Science & Technology</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> System Operational
          </span>
          <span>© {new Date().getFullYear()} MMUST DCBT</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
