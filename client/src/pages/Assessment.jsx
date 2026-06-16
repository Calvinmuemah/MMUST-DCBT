import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../utils/api";

export default function Onboarding() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day"
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
      finish(newAnswers);
    }
  };

  const finish = async (finalAnswers) => {
    try {
      setLoading(true);

      const payload = finalAnswers.map((val, i) => ({
        questionNumber: i + 1,
        question: questions[i],
        answer: options[val],
        score: val
      }));

      const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
      
      let level;
      if (totalScore <= 4) level = "Low";
      else if (totalScore <= 8) level = "Mild";
      else if (totalScore <= 11) level = "Moderate";
      else level = "High";

      await postRequest("/auth/onboarding", {
        answers: payload,
        totalScore,
        riskLevel: level,
      });

      // Update local user object
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.onboardingCompleted = true;
      user.onboardingRiskLevel = level;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Failed to save assessment");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
        <div 
          className="h-full bg-blue-600 transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative w-full max-w-2xl bg-white rounded-[40px] p-10 md:p-16 shadow-2xl shadow-slate-200 border border-slate-100 animate-in fade-in zoom-in duration-500">
        
        <div className="mb-12">
          <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4">
            Assessment {currentQuestion + 1} of {questions.length}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {questions[currentQuestion]}
          </h1>
        </div>

        <div className="space-y-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full p-6 rounded-[24px] text-left transition-all duration-300 flex items-center justify-between group ${
                selected === i 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 -translate-y-1' 
                : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100'
              }`}
            >
              <span className={`font-bold text-lg ${selected === i ? 'text-white' : 'text-slate-700'}`}>
                {opt}
              </span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === i ? 'border-white bg-white' : 'border-slate-300 group-hover:border-blue-400'
              }`}>
                {selected === i && <div className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between">
          <p className="text-slate-400 font-medium italic text-sm">
            Choose the option that best describes you.
          </p>
          
          <button
            onClick={handleNext}
            disabled={selected === -1 || loading}
            className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all disabled:opacity-30 flex items-center gap-2"
          >
            {loading ? "Saving..." : currentQuestion === questions.length - 1 ? "Finish" : "Next Question"}
          </button>
        </div>

      </div>
    </div>
  );
}