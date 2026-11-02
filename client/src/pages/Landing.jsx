import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/landing/HeroSection";
import AboutSection from "../components/landing/AboutSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ModulesSection from "../components/landing/ModulesSection";
import ImpactStatsSection from "../components/landing/ImpactStatsSection";
import EarlyAdopterSection from "../components/landing/EarlyAdopterSection";
import PartnersSection from "../components/landing/PartnersSection";
import FaqSection from "../components/landing/FaqSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* 1. TOP NAVIGATION BAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <HeroSection />

      {/* 3. ABOUT & 4 CORE PILLARS SECTION */}
      <AboutSection />

      {/* 4. HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* 5. CBT MODULES & CLINICAL SHOWCASE */}
      <ModulesSection />

      {/* 6. CAMPUS IMPACT & CLINICAL RESEARCH STATS */}
      <ImpactStatsSection />

      {/* 7. ANDROID APK DOWNLOAD & MOBILE APP SHOWCASE */}
      <EarlyAdopterSection />

      {/* 8. UNIVERSITY PARTNERS & VOICES */}
      <PartnersSection />

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection />

      {/* 10. COMPANY FOOTER (With Download APK button) */}
      <Footer />

    </div>
  );
}