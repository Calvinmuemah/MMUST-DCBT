import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../utils/api";
import { 
  ChevronRight, 
  CheckCircle2, 
  Brain, 
  Heart, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Lock,
  Moon,
  Sun
} from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState('welcome'); // welcome, questions, summary
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const options = [
    { label: "Not at all", emoji: "🌿", color: "from-emerald-400 to-teal-500", light: "bg-emerald-50" },
    { label: "Several days", emoji: "⛅", color: "from-blue-400 to-indigo-500", light: "bg-blue-50" },
    { label: "More than half the days", emoji: "🍂", color: "from-orange-400 to-amber-500", light: "bg-amber-50" },
    { label: "Nearly every day", emoji: "🌪️", color: "from-rose-400 to-red-500", light: "bg-red-50" }
  ];

  const questions = [
    "How often have you found yourself thinking that you might fail before even starting a task?",
    "How often have academic responsibilities felt overwhelming or difficult to manage?",
    "How often have negative thoughts affected your mood or motivation?",
    "How often have you avoided assignments, activities, or situations because they felt stressful?",
    "How often have you felt unable to control worrying thoughts?",
  ];

  const handleNext = () => {
    if (selected === -1) return;
    
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(-1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
    let level;
    let description;
    let icon;

    if (totalScore <= 4) {
      level = "Low";
      description = "Your mental garden is blooming. You have a strong foundation for managing academic life.";
      icon = <Heart className="text-emerald-500" />;
    } else if (totalScore <= 8) {
      level = "Mild";
      description = "A few clouds in the sky, but nothing you can't handle with the right tools.";
      icon = <Sparkles className="text-blue-500" />;
    } else if (totalScore <= 11) {
      level = "Moderate";
      description = "You're navigating a bit of a storm. Let's find some shelter and build your resilience.";
      icon = <Brain className="text-amber-500" />;
    } else {
      level = "High";
      description = "You're in the middle of a heavy rain. We're here to hold the umbrella and guide you to safety.";
      icon = <Zap className="text-rose-500" />;
    }

    setResult({ totalScore, level, description, icon, finalAnswers });
    setStep('summary');
  };

  const finish = async () => {
    try {
      setLoading(true);

      const payload = result.finalAnswers.map((val, i) => ({
        questionNumber: i + 1,
        question: questions[i],
        answer: options[val].label,
        score: val
      }));

      await postRequest("/auth/onboarding", {
        answers: payload,
        totalScore: result.totalScore,
        riskLevel: result.level,
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.onboardingCompleted = true;
      user.onboardingRiskLevel = result.level;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Failed to save assessment");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Background Mesh Gradient
  const Background = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-100/50 blur-[120px] rounded-full animate-pulse duration-[8000ms]" />
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-purple-100/30 blur-[100px] rounded-full" />
    </div>
  );

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans">
        <Background />
        <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white/70 backdrop-blur-2xl rounded-[48px] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] border border-white/50 animate-in fade-in zoom-in duration-1000">
          <div className="p-12 md:p-16 flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <Brain size={32} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">Your Mind,<br/>Well Cared For.</h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 font-medium">
                Personalize your journey with MMUSTCare. A small step today leads to a stronger tomorrow.
              </p>
              <div className="flex items-center gap-3 text-sm font-bold text-blue-100/80 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10">
                <Lock size={14} /> Encrypted & 100% Private
              </div>
            </div>
          </div>

          <div className="p-12 md:p-16 flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Ready to begin?</h2>
                <p className="text-slate-500 font-medium leading-relaxed">This brief assessment helps our AI tailor the CBT exercises to your specific academic and emotional needs.</p>
              </div>
              
              <div className="space-y-4">
                <WelcomeFeature icon={<Clock size={20} />} title="2 Minutes" desc="Short and focused questions." />
                <WelcomeFeature icon={<ShieldCheck size={20} />} title="Safe Space" desc="Non-judgmental assessment." />
              </div>

              <button
                onClick={() => setStep('questions')}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-[0_20px_40px_-8px_rgba(0,0,0,0.2)] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
              >
                Start My Journey
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'summary') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans">
        <Background />
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-3xl rounded-[56px] p-12 md:p-20 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] border border-white/60 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full" />
            <div className="relative w-28 h-28 bg-white rounded-[32px] flex items-center justify-center shadow-xl border border-slate-50">
              {React.cloneElement(result.icon, { size: 56, strokeWidth: 2.5 })}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Assessment Complete</p>
          <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
            Level: <span className={
              result.level === 'High' ? 'text-rose-600' : 
              result.level === 'Moderate' ? 'text-amber-600' : 
              'text-emerald-600'
            }>{result.level}</span>
          </h2>
          
          <div className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 mb-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm">Your Personal Insight</div>
            <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
              "{result.description}"
            </p>
          </div>

          <button
            onClick={finish}
            disabled={loading}
            className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-[0_20px_40px_-8px_rgba(0,0,0,0.3)] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg group"
          >
            {loading ? "Personalizing..." : "Enter My Dashboard"}
            {!loading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Background />
      
      {/* Immersive Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 pointer-events-none">
        <div className="max-w-xl mx-auto h-3 bg-white/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-3xl rounded-[56px] p-10 md:p-16 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] border border-white/60 animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-[100px] opacity-[0.03] select-none pointer-events-none font-black italic">
            Q{currentQuestion + 1}
          </div>
          
          <div className="mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100/50 mb-6">
              <Brain size={12} /> Step {currentQuestion + 1} of {questions.length}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {questions[currentQuestion]}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`group relative p-8 rounded-[36px] text-left transition-all duration-500 overflow-hidden border-2 ${
                  selected === i 
                  ? 'border-blue-600 bg-blue-600 text-white shadow-2xl shadow-blue-200 -translate-y-2' 
                  : 'bg-white/40 border-white text-slate-700 hover:border-blue-200 hover:bg-white/80'
                }`}
              >
                {selected === i && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                )}
                <div className="flex flex-col gap-3 relative z-10">
                  <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 inline-block w-fit">{opt.emoji}</span>
                  <span className={`font-black text-lg leading-snug ${selected === i ? 'text-white' : 'text-slate-900'}`}>
                    {opt.label}
                  </span>
                </div>
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === i ? 'border-white/50 bg-white/20' : 'border-slate-100 group-hover:border-blue-200'
                }`}>
                  {selected === i && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50/50 px-5 py-2.5 rounded-full border border-slate-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Honest Reflection
            </div>
            
            <button
              onClick={handleNext}
              disabled={selected === -1 || loading}
              className={`w-full sm:w-auto px-12 py-5 font-black rounded-3xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${
                selected === -1 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-200 active:scale-95'
              }`}
            >
              {currentQuestion === questions.length - 1 ? "Complete Journey" : "Continue"}
              <ChevronRight size={22} className={selected !== -1 ? "animate-bounce-x" : ""} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Styles for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}} />
    </div>
  );
}

const WelcomeFeature = ({ icon, title, desc }) => (
  <div className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <div>
      <div className="text-sm font-black text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 font-medium">{desc}</div>
    </div>
  </div>
);

const Clock = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);