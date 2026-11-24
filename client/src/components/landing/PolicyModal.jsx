import { useEffect } from "react";
import { 
  X, 
  ShieldCheck, 
  Phone, 
  HeartPulse, 
  Users, 
  Hospital, 
  ExternalLink, 
  Lock, 
  FileText,
  AlertTriangle,
  Database,
  EyeOff,
  UserCheck
} from "lucide-react";

export default function PolicyModal({ type, onClose }) {
  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!type) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-1.5 sm:p-2.5 md:p-3 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================
            MODAL HEADER (Slim edge margins)
           ======================================================== */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/90 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
              {type === "support" && <HeartPulse className="w-5 h-5 text-blue-600" />}
              {type === "privacy" && <Lock className="w-5 h-5 text-blue-600" />}
              {type === "terms" && <FileText className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">
                {type === "support" && "MMUST Counseling & Crisis Support"}
                {type === "privacy" && "Student Privacy & Confidentiality Policy"}
                {type === "terms" && "Terms of Use & Ethical Guidelines"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {type === "support" && "Direct campus medical, guidance counseling & emergency helplines"}
                {type === "privacy" && "Zero academic surveillance • 100% anonymous & encrypted"}
                {type === "terms" && "Clinical boundaries & digital CBT safety standards"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer shadow-xs"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ========================================================
            MODAL BODY CONTENT (Full-width with minimal left/right margins)
           ======================================================== */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 md:px-6 py-4 sm:py-5 space-y-5 text-slate-700 leading-relaxed font-normal">
          <div className="w-full space-y-5">
            
            {/* ---------------- TYPE: SUPPORT & COUNSELING ---------------- */}
            {type === "support" && (
              <div className="space-y-4 sm:space-y-5">
                <div className="bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-transparent border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      Immediate Campus & Regional Assistance
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      If you or a colleague need urgent emotional support, guidance, or medical care, please reach out directly through the verified helplines below.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <a
                      href="tel:0110975071"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Hotline: 0110975071</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* 1. Health Clinic Emergency */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/90 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-blue-950 font-bold text-base">
                          <HeartPulse className="w-5 h-5 text-blue-600 shrink-0" />
                          <span>University Clinic</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">
                          24/7 Desk
                        </span>
                      </div>
                      <p className="text-xs text-blue-900/90">
                        On-campus emergency medical triage, acute emotional distress management, and immediate stabilization for MMUST students.
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong>Location:</strong> Behind Admin Block
                      </p>
                    </div>
                    <div className="pt-2">
                      <a
                        href="tel:0110975071"
                        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call 0110975071</span>
                      </a>
                    </div>
                  </div>

                  {/* 2. Dean of Students / Guidance */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                        <Users className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Dean of Students</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Professional guidance counseling, student welfare assistance, academic stress mediation, and peer mentor coordination.
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong>Hours:</strong> Mon – Fri, 8 AM – 5 PM
                      </p>
                    </div>
                    <div className="pt-2">
                      <a
                        href="tel:0110975071"
                        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contact Welfare</span>
                      </a>
                    </div>
                  </div>

                  {/* 3. Kakamega Referral Hospital */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                        <Hospital className="w-5 h-5 text-teal-600 shrink-0" />
                        <span>General Hospital</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        County level-5 hospital providing comprehensive 24/7 emergency medical, ambulance, psychiatric, and specialized clinical care.
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong>Location:</strong> Hospital Rd, Kakamega
                      </p>
                    </div>
                    <div className="pt-2">
                      <a
                        href="tel:0110975071"
                        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hospital Desk</span>
                      </a>
                    </div>
                  </div>

                  {/* 4. National 24/7 Crisis Hotline */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200/90 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-rose-950 font-bold text-base">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>National Hotline</span>
                      </div>
                      <p className="text-xs text-rose-900/90">
                        Anonymous, compassionate crisis intervention and emotional stabilization available anywhere in Kenya 24/7.
                      </p>
                      <p className="text-xs text-rose-800 font-medium">
                        Toll-Free: <strong>1199</strong> • Befrienders
                      </p>
                    </div>
                    <div className="pt-2">
                      <a 
                        href="tel:+254722178177" 
                        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call +254 722 178 177</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dedicated Crisis Page Link Banner */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-100/90 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Looking for detailed emergency coping strategies or grounding exercises?
                    </p>
                    <p className="text-xs text-slate-500">
                      Visit our full Crisis Intervention & Resources portal for step-by-step guidance.
                    </p>
                  </div>
                  <a
                    href="/crisis"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs shadow-xs transition-colors shrink-0"
                  >
                    <span>Open Crisis Center</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  </a>
                </div>
              </div>
            )}

            {/* ---------------- TYPE: PRIVACY POLICY ---------------- */}
            {type === "privacy" && (
              <div className="space-y-4 sm:space-y-5">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-emerald-950">
                      Built for Absolute Student Privacy
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-900/90 mt-1">
                      Masinde Muliro University DCBT is engineered strictly as an empowering self-help platform. We do not track, profile, grade, or share your psychological records with university administration.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                  {/* 1. Zero Tracking */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <EyeOff className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">1. Zero Student Tracking</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      MMUST DCBT does not mandate your student registration number, official legal name, or national identification. You are free to access cognitive reframing exercises and self-care tools anonymously or under an alias.
                    </p>
                  </div>

                  {/* 2. Academic Segregation */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">2. Academic Segregation</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      This platform operates completely detached from MMUST academic portals and ERP systems. Lecturers, department chairs, and faculty staff have zero visibility into your mood assessments, journal logs, or reflections.
                    </p>
                  </div>

                  {/* 3. Database Encryption */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">3. End-to-End Encryption</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      All thought records, emotional check-ins, and CBT logs are stored in secure PostgreSQL databases with encrypted transport layers (TLS 1.3). Credentials use salted cryptographic hashing (bcrypt) and are never stored in plain text.
                    </p>
                  </div>

                  {/* 4. Kenya Data Protection */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">4. Data Protection Act</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      We strictly follow the principles of the Kenya Data Protection Act (2019). We never sell, license, or monetize student health information with advertisers, third-party sponsors, or commercial marketing entities.
                    </p>
                  </div>

                  {/* 5. Right to Erasure */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">5. Right to Erasure & Export</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      You hold full ownership of your data. You can export your self-reflection history or permanently erase your journal entries and profile at any point with zero lingering copies.
                    </p>
                  </div>

                  {/* 6. Ethics Oversight */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">6. Clinical Ethics Oversight</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Our platform architecture conforms to guidelines set by university wellness committees and mental health professionals, ensuring ethical boundaries are maintained at every stage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- TYPE: TERMS & ETHICAL GUIDELINES ---------------- */}
            {type === "terms" && (
              <div className="space-y-4 sm:space-y-5">
                <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-amber-950">
                      Important Clinical & Self-Care Disclaimer
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-900/90 mt-1">
                      MMUST DCBT is an evidence-informed self-reflection and coping companion, not an emergency medical facility or psychiatric diagnosis service.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                  {/* 1. Purpose */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">1. Purpose & Scope</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      MMUST DCBT is designed to assist university students in identifying cognitive distortions, reframing stressful academic thoughts, practicing structured mindfulness exercises, and tracking daily emotional progress.
                    </p>
                  </div>

                  {/* 2. Emergency Limitations */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5">
                    <h4 className="text-sm sm:text-base font-bold text-rose-950">2. Emergency Limitations</h4>
                    <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                      This software cannot dispense medication, prescribe treatment, or handle acute psychiatric emergencies. If you are experiencing thoughts of severe self-harm or a medical crisis, please contact the campus clinic (0110975071) or 1199 immediately.
                    </p>
                  </div>

                  {/* 3. AI Safety Guardrails */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">3. AI Safety Guardrails</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      The integrated conversational assistant uses validated psychological prompting architectures. It is strictly programmed never to generate harmful recommendations, claim human consciousness, or substitute for a licensed psychotherapist.
                    </p>
                  </div>

                  {/* 4. Student User Responsibilities */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">4. Community Integrity</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Students agree to use the platform in good faith, safeguarding their credentials and respecting peer support spaces. Submitting abusive, malicious, or fraudulent distress signals is strictly prohibited.
                    </p>
                  </div>

                  {/* 5. Continuous Improvement */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">5. Platform Evolution</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      CBT modules and wellness guides are periodically reviewed and updated based on student feedback and psychotherapeutic research to ensure relevance and safety.
                    </p>
                  </div>

                  {/* 6. Consent & Voluntary Use */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">6. Voluntary Participation</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Participation in all digital CBT exercises and journaling routines is entirely voluntary. You may pause, resume, or discontinue using the platform at any time without any academic penalty.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ========================================================
            MODAL FOOTER (Slim edge margins)
           ======================================================== */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 shrink-0">
          <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 sm:gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Masinde Muliro University • Student Welfare & Well-being Ethics Oversight</span>
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}