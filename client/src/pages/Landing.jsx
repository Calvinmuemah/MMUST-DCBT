import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/landing/HeroSection";
import AppShowcaseSection from "../components/landing/AppShowcaseSection";
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

      {/* 2. PRIMARY HERO SECTION (African Student Depression Story & Cultural Empathy) */}
      <HeroSection />

      {/* 3. SECOND SECTION ON SCROLL: DIGITAL CBT APP SHOWCASE & APK DOWNLOAD */}
      <AppShowcaseSection />

      {/* 4. ABOUT & 4 CORE PILLARS SECTION */}
      <AboutSection />

      {/* 5. HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* 6. CBT MODULES & CLINICAL SHOWCASE */}
      <ModulesSection />

      {/* 7. CAMPUS IMPACT & CLINICAL RESEARCH STATS */}
      <ImpactStatsSection />

      {/* 8. ANDROID APK DOWNLOAD & MOBILE APP SHOWCASE */}
      <EarlyAdopterSection />

      {/* 9. UNIVERSITY PARTNERS & VOICES */}
      <PartnersSection />

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection />

      {/* 11. COMPANY FOOTER */}
      <Footer />

    </div>
  );
}
