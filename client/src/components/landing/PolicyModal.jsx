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
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-[96vw] max-w-6xl h-[92vh] sm:h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================
            MODAL HEADER
           ======================================================== */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/90 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
              {type === "support" && <HeartPulse className="w-6 h-6 text-blue-600" />}
              {type === "privacy" && <Lock className="w-6 h-6 text-blue-600" />}
              {type === "terms" && <FileText className="w-6 h-6 text-blue-600" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {type === "support" && "MMUST Counseling & Crisis Support"}
                {type === "privacy" && "Student Privacy & Confidentiality Policy"}
                {type === "terms" && "Terms of Use & Ethical Guidelines"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {type === "support" && "Direct campus medical, guidance counseling & emergency helplines"}
                {type === "privacy" && "Zero academic surveillance • 100% anonymous & encrypted"}
                {type === "terms" && "Clinical boundaries & digital CBT safety standards"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer shadow-xs"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================
            MODAL BODY CONTENT (Expanded 2-column responsive layout)
           ======================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-6 text-slate-700 leading-relaxed font-normal">
          
          {/* ---------------- TYPE: SUPPORT & COUNSELING ---------------- */}
          {type === "support" && (
            <div className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Health Clinic Emergency */}
                <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/70 border border-blue-200/90 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 text-blue-950 font-bold text-base sm:text-lg">
                        <HeartPulse className="w-5 h-5 text-blue-600 shrink-0" />
                        <span>University Health Clinic</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-600 text-white shrink-0">
                        24/7 Emergency
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-900/90">
                      On-campus emergency medical triage, acute emotional distress management, and immediate stabilization for MMUST students.
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>Location:</strong> Behind Administration Block, Main Campus
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="tel:0110975071"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Clinic (0110975071)</span>
                    </a>
                  </div>
                </div>

                {/* 2. Dean of Students / Guidance */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                      <Users className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>Dean of Students Guidance Desk</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Professional guidance counseling, student welfare assistance, academic stress mediation, and peer mentor coordination.
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>Office Hours:</strong> Monday – Friday, 8:00 AM – 5:00 PM
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="tel:0110975071"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact Welfare Desk (0110975071)</span>
                    </a>
                  </div>
                </div>

                {/* 3. Kakamega Referral Hospital */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                      <Hospital className="w-5 h-5 text-teal-600 shrink-0" />
                      <span>Kakamega General Referral Hospital</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">
                      County level-5 hospital providing comprehensive 24/7 emergency medical, ambulance, psychiatric, and specialized clinical care.
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>Location:</strong> Hospital Road, Kakamega (10 mins from Main Campus)
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="tel:0110975071"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hospital Line (0110975071)</span>
                    </a>
                  </div>
                </div>

                {/* 4. National 24/7 Crisis Hotline */}
                <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/70 border border-rose-200/90 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-rose-950 font-bold text-base sm:text-lg">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>National Free Crisis Lines (Befrienders)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-rose-900/90">
                      Anonymous, compassionate crisis intervention and emotional stabilization available anywhere in Kenya 24 hours a day, 7 days a week.
                    </p>
                    <p className="text-xs text-rose-800 font-medium">
                      Toll-Free Red Cross: <strong>1199</strong> • Befrienders: <strong>+254 722 178 177</strong>
                    </p>
                  </div>
                  <div className="pt-2">
                    <a 
                      href="tel:+254722178177" 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Hotline (+254 722 178 177)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Dedicated Crisis Page Link Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/90 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Looking for detailed emergency coping strategies or grounding exercises?
                  </p>
                  <p className="text-xs text-slate-500">
                    Visit our full Crisis Intervention & Resources portal for step-by-step guidance.
                  </p>
                </div>
                <a
                  href="/crisis"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs shadow-xs transition-colors shrink-0"
                >
                  <span>Open Crisis Center</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                </a>
              </div>
            </div>
          )}

          {/* ---------------- TYPE: PRIVACY POLICY ---------------- */}
          {type === "privacy" && (
            <div className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Zero Tracking */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">1. Zero Student Tracking & Anonymity</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    MMUST DCBT does not mandate your student registration number, official legal name, or national identification. You are free to access cognitive reframing exercises and self-care tools anonymously or under an alias.
                  </p>
                </div>

                {/* 2. Academic Segregation */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">2. Complete Academic Segregation</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    This platform operates completely detached from MMUST academic portals and ERP systems. Lecturers, department chairs, and faculty staff have zero visibility into your mood assessments, journal logs, or reflections.
                  </p>
                </div>

                {/* 3. Database Encryption */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">3. End-to-End Database Encryption</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    All thought records, emotional check-ins, and CBT logs are stored in secure PostgreSQL databases with encrypted transport layers (TLS 1.3). Credentials use salted cryptographic hashing (bcrypt) and are never stored in plain text.
                  </p>
                </div>

                {/* 4. Kenya Data Protection */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">4. Kenya Data Protection Act Compliance</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We strictly follow the principles of the Kenya Data Protection Act (2019). We never sell, license, or monetize student health information with advertisers, third-party sponsors, or commercial marketing entities.
                  </p>
                </div>

                {/* 5. Right to Erasure */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">5. Right to Erasure & Export</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    You hold full ownership of your data. You can export your self-reflection history or permanently erase your journal entries and profile at any point with zero lingering copies.
                  </p>
                </div>

                {/* 6. Ethics Oversight */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">6. Clinical Ethics Oversight</h4>
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
            <div className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Purpose */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-base font-bold text-slate-900">1. Purpose & Scope of the Application</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    MMUST DCBT is designed to assist university students in identifying cognitive distortions, reframing stressful academic thoughts, practicing structured mindfulness exercises, and tracking daily emotional progress.
                  </p>
                </div>

                {/* 2. Emergency Limitations */}
                <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <h4 className="text-base font-bold text-rose-950">2. Emergency & Crisis Limitations</h4>
                  <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                    This software cannot dispense medication, prescribe treatment, or handle acute psychiatric emergencies. If you are experiencing thoughts of severe self-harm or a medical crisis, please contact the campus clinic (0110975071) or 1199 immediately.
                  </p>
                </div>

                {/* 3. AI Safety Guardrails */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-base font-bold text-slate-900">3. Ethical AI & Prompt Guardrails</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    The integrated conversational assistant uses validated psychological prompting architectures. It is strictly programmed never to generate harmful recommendations, claim human consciousness, or substitute for a licensed psychotherapist.
                  </p>
                </div>

                {/* 4. Student User Responsibilities */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-base font-bold text-slate-900">4. Community Integrity & Code of Conduct</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Students agree to use the platform in good faith, safeguarding their credentials and respecting peer support spaces. Submitting abusive, malicious, or fraudulent distress signals is strictly prohibited.
                  </p>
                </div>

                {/* 5. Continuous Improvement */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-base font-bold text-slate-900">5. Platform Evolution & Content Updates</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    CBT modules and wellness guides are periodically reviewed and updated based on student feedback and psychotherapeutic research to ensure relevance and safety.
                  </p>
                </div>

                {/* 6. Consent & Voluntary Use */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-base font-bold text-slate-900">6. Voluntary Participation</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Participation in all digital CBT exercises and journaling routines is entirely voluntary. You may pause, resume, or discontinue using the platform at any time without any academic penalty.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================
            MODAL FOOTER
           ======================================================== */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Masinde Muliro University • Student Welfare & Well-being Ethics Oversight</span>
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}