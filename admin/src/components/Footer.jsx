import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col md:row items-center justify-between gap-4">
        <div className="text-sm text-text-light font-medium">
          © {new Date().getFullYear()} MMUSTCare. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <FooterLink label="Privacy Policy" />
          <FooterLink label="Terms of Service" />
          <FooterLink label="Contact Support" />
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ label }) => (
  <a href="#" className="text-xs font-bold text-text-light hover:text-primary transition-colors uppercase tracking-widest">
    {label}
  </a>
);

export default Footer;
