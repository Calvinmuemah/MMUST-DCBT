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
  FileText 
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
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================
            MODAL HEADER
           ======================================================== */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              {type === "support" && <HeartPulse className="w-5 h-5 text-blue-600" />}
              {type === "privacy" && <Lock className="w-5 h-5 text-blue-600" />}
              {type === "terms" && <FileText className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                {type === "support" && "MMUST Counseling & Crisis Support"}
                {type === "privacy" && "Student Privacy & Confidentiality Policy"}
                {type === "terms" && "Terms of Use & Ethical Guidelines"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {type === "support" && "Direct campus medical, counseling & emergency helplines"}
                {type === "privacy" && "Zero academic surveillance • 100% anonymous & secure"}
                {type === "terms" && "Clinical boundaries & digital CBT safety standards"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200/70 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            MODAL BODY CONTENT
           ======================================================== */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed font-normal">
          
          {/* ---------------- TYPE: SUPPORT & COUNSELING ---------------- */}
          {type === "support" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
                    <HeartPulse className="w-5 h-5 text-blue-600" />
                    <span>University Health Clinic Emergency Desk</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    24/7 Available
                  </span>
                </div>
                <p className="text-xs text-blue-800">
                  Provides 24/7 emergency medical support, psychological stabilization, and immediate triage for students in distress.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="tel:0110975071"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call 0110975071 Now</span>
                  </a>
                </div>
              </div>

              {/* Dean of Students / Welfare Desk */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span>Dean of Students — Guidance & Welfare Office</span>
                </div>
                <p className="text-xs text-slate-600">
                  Assists with student welfare concerns, guidance counseling referrals, and accommodation assistance.
                </p>
                <p className="text-xs font-semibold text-slate-800">
                  Helpline: <a href="tel:0110975071" className="text-blue-600 hover:underline">0110975071</a> • Location: Student Affairs Complex
                </p>
              </div>

              {/* Kakamega Referral Hospital */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Hospital className="w-5 h-5 text-teal-600" />
                  <span>Kakamega General Referral Hospital (Emergency)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Comprehensive 24/7 emergency medical, ambulance, and specialized psychiatric care.
                </p>
                <p className="text-xs font-semibold text-slate-800">
                  Contact: <a href="tel:0110975071" className="text-blue-600 hover:underline">0110975071</a> • Hospital Road, Kakamega
                </p>
              </div>

              {/* National Suicide Prevention / Befrienders */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  National 24/7 Free Crisis Hotline (Befrienders Kenya)
                </p>
                <p className="text-xs text-rose-800">
                  Confidential crisis intervention & emotional support for anyone in distress across Kenya:
                </p>
                <a 
                  href="tel:+254722178177" 
                  className="inline-block text-sm font-extrabold text-rose-700 hover:underline"
                >
                  +254 722 178 177 / Toll-free: 1199 (Red Cross)
                </a>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="/crisis"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
                >
                  <span>Open Full Crisis Support Center Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* ---------------- TYPE: PRIVACY POLICY ---------------- */}
          {type === "privacy" && (
            <div className="space-y-4">
              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 1. Zero Student Tracking & Anonymity
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  MMUST DCBT does not require your student registration number, official legal name, national ID, or academic transcript details. You are free to access cognitive reframing exercises and self-care tools anonymously or via a private alias.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" /> 2. Complete Academic Segregation
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  This platform is strictly decoupled from Masinde Muliro University academic systems (ERP/Student Portal). Lecturers, course coordinators, and faculty administrators have zero access to your mood scores, chat logs, assessments, or journal entries.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">3. End-to-End Database Encryption</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  All journal thoughts, CBT exercises, and reflections are securely stored in isolated PostgreSQL tables with encrypted connections. Passwords utilize one-way salted hashing (bcrypt) and are never stored in plain text.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">4. Kenya Data Protection Act Compliance</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  We adhere to the principles of the Kenya Data Protection Act (2019). We never sell, share, or monetize student health information with advertisers or commercial third parties.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">5. Right to Erasure</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  You retain complete ownership of your entries. You may delete individual thoughts, journal reflections, or request full account wipe at any time from your settings.
                </p>
              </section>
            </div>
          )}

          {/* ---------------- TYPE: TERMS & ETHICAL GUIDELINES ---------------- */}
          {type === "terms" && (
            <div className="space-y-4">
              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">1. Purpose & Scope of Platform</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  MMUST DCBT is an evidence-informed digital Cognitive Behavioural Therapy self-management tool. It is engineered to help university students reframe unhelpful thinking styles, manage academic anxiety, build healthy coping routines, and monitor daily well-being.
                </p>
              </section>

              <section className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <h4 className="text-sm font-bold text-amber-900">2. Clinical Disclaimer (Not Emergency Medical Care)</h4>
                <p className="text-xs sm:text-sm text-amber-800">
                  MMUST DCBT is <strong>not</strong> an emergency psychiatric facility, acute trauma triage, or prescribing physician. If you are experiencing thoughts of self-harm, severe clinical depression, or acute psychosis, immediately contact the campus clinic (0110975071) or emergency services (1199).
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">3. Ethical AI Boundaries</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  The integrated AI support assistant operates under strict clinical safety guardrails. It never generates prescriptive medical advice, guarantees diagnosis, or encourages harmful conduct. It is tuned to promote structured grounding, self-reflection, and professional counselor escalation.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">4. Community Code of Conduct</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Users agree to engage with the platform in good faith and refrain from injecting malicious content or abusing campus counselor desks.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* ========================================================
            MODAL FOOTER
           ======================================================== */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> MMUST Well-being Ethics Board
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
