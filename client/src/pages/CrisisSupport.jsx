import { useState } from "react";
import Footer from "../components/Footer";
import { Phone, Hospital, Users, Info, ShieldAlert, HeartPulse } from "lucide-react";

export default function Crisis() {
  const [activeContact, setActiveContact] = useState(null);

  const contacts = [
    {
      title: 'University Clinic',
      subtitle: 'Immediate medical & psychological aid',
      description: 'The university health clinic provides 24/7 emergency medical support and initial psychological stabilization for students in distress.',
      color: 'blue',
      icon: <HeartPulse className="text-blue-600" />,
      phone: '0110975071',
      details: [
        { label: 'Clinic support', value: 'Emergency & health desk' },
        { label: 'Support type', value: 'Medical & psychological stabilization' },
      ]
    },
    {
      title: 'Dean of Students',
      subtitle: 'Student welfare support office',
      description: 'The Dean of Students office handles welfare concerns, guidance, and support for students facing difficulties.',
      color: 'orange',
      icon: <Users className="text-orange-600" />,
      phone: '0110975071',
      details: [
        { label: 'Office support', value: 'Student welfare and guidance desk' },
        { label: 'Support type', value: 'Welfare, guidance, and follow-up' },
      ]
    },
    {
      title: 'Kakamega General Hospital',
      subtitle: 'County referral hospital and emergency services',
      description: 'Provides comprehensive medical care and emergency services for the Kakamega community.',
      color: 'teal',
      icon: <Hospital className="text-teal-600" />,
      phone: '0110975071',
      details: [
        { label: 'Hospital support', value: 'General medical and emergency support desk' },
        { label: 'Support type', value: 'Emergency, medical, and specialist care' },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      <div className="flex-1 px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
            <div className="inline-flex p-4 rounded-3xl bg-red-50 mb-6">
              <ShieldAlert size={40} className="text-red-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Crisis Support Center
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto">
              You're not alone. If you're feeling overwhelmed, please reach out to any of the verified support services below.
            </p>
          </div>

          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            {contacts.map((contact, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
              >
                <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className={`w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center shrink-0`}>
                    {contact.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">{contact.title}</h2>
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mt-1">{contact.subtitle}</p>
                      </div>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:bg-slate-800 transition-all"
                      >
                        <Phone size={18} />
                        {contact.phone}
                      </a>
                    </div>

                    <p className="text-slate-500 leading-relaxed font-medium mb-8">
                      {contact.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {contact.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="text-slate-400"><Info size={16} /></div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{detail.label}</p>
                            <p className="text-sm font-bold text-slate-700">{detail.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-black mb-4 italic">Need Immediate AI Support?</h2>
              <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto leading-relaxed">
                Start a private conversation with our CBT assistant for immediate grounding and emotional support.
              </p>
              <button className="px-10 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-all">
                Start Calm Mode
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}