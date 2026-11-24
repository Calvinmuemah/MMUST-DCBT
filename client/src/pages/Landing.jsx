import { useState } from "react";
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
import PolicyModal from "../components/landing/PolicyModal";

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState(null);

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* 1. TOP NAVIGATION BAR */}
      <Navbar onOpenModal={handleOpenModal} />

      {/* 2. PRIMARY HERO SECTION (African Student Depression Story & Cultural Empathy) */}
      <HeroSection onOpenModal={handleOpenModal} />

      {/* 3. SECOND SECTION ON SCROLL: DIGITAL CBT APP SHOWCASE & APK DOWNLOAD */}
      <AppShowcaseSection onOpenModal={handleOpenModal} />

      {/* 4. ABOUT & 4 CORE PILLARS SECTION */}
      <AboutSection onOpenModal={handleOpenModal} />

      {/* 5. HOW IT WORKS SECTION */}
      <HowItWorksSection onOpenModal={handleOpenModal} />

      {/* 6. CBT MODULES & CLINICAL SHOWCASE */}
      <ModulesSection onOpenModal={handleOpenModal} />

      {/* 7. CAMPUS IMPACT & CLINICAL RESEARCH STATS */}
      <ImpactStatsSection onOpenModal={handleOpenModal} />

      {/* 8. ANDROID APK DOWNLOAD & MOBILE APP SHOWCASE */}
      <EarlyAdopterSection onOpenModal={handleOpenModal} />

      {/* 9. UNIVERSITY PARTNERS & VOICES */}
      <PartnersSection onOpenModal={handleOpenModal} />

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection onOpenModal={handleOpenModal} />

      {/* 11. COMPANY FOOTER */}
      <Footer onOpenModal={handleOpenModal} />

      {/* 12. INTERACTIVE PRIVACY, ETHICS & SUPPORT MODAL */}
      <PolicyModal type={activeModal} onClose={handleCloseModal} />

    </div>
  );
}
