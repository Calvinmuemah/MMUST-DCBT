import { useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "Is MMUST DCBT completely free for all students?",
      a: "Yes. The platform is 100% free for all registered and ongoing undergraduate, postgraduate, and diploma students across all campuses of Masinde Muliro University of Science and Technology. There are no subscriptions, in-app purchases, or fees."
    },
    {
      q: "Can my lecturers, department, or dean see that I am using the platform?",
      a: "No, absolutely never. Privacy is guaranteed. The platform is completely segregated from the academic registrar and student portal systems. Lecturers, academic advisors, and administrators cannot view your account, mood scores, chat transcripts, or journal entries."
    },
    {
      q: "Can I use the app completely anonymously without registering my real name?",
      a: "Yes. In the app, you can create or generate an anonymous alias. You do not need to provide your student registration number, personal email, or phone number to access full cognitive reframing modules and AI support."
    },
    {
      q: "What exercises and wellness tools are included in the mobile app?",
      a: "The MMUST DCBT Android app features evidence-based cognitive restructuring exercises, structured self-care journaling, daily habit planning, distortion pattern analyzers, mood trend analytics, and 24/7 AI-guided conversational support."
    },
    {
      q: "Is the AI assistant a replacement for a professional human therapist?",
      a: "No. MMUST DCBT is designed as a proactive digital self-management and cognitive training tool based on proven CBT techniques. While highly effective for managing everyday exam stress, anxiety, and negative thinking, it is not a substitute for formal psychiatric treatment. It serves as an early-intervention bridge to campus counselors."
    },
    {
      q: "How do I install MMUST DCBT on my smartphone?",
      a: "Simply tap any 'Download APK' button on this website to download the MMUST DCBT Android APK directly to your phone. Tap the downloaded file to install it in seconds."
    }
  ];

  return (
    <section id="faq" className="relative px-3 sm:px-6 py-24 md:py-32 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-5xl w-full mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Questions & Answers
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently asked questions.
          </h2>

          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Clear answers regarding student privacy, anonymity, academic segregation, and app capabilities.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-colors shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">Have a specific confidential question?</p>
              <p className="text-xs text-slate-500">Reach out directly to the MMUST Counseling & Wellness Unit.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            Contact Counseling Unit
          </a>
        </div>

      </div>
    </section>
  );
}
