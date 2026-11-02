import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { postRequest } from "../../utils/api";

export default function AnonymousModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const sampleAliases = [
    "ResilientScholar",
    "CalmMind",
    "BraveFalcon",
    "HopefulLearner",
    "SteadyHeart"
  ];

  const handleRandomAlias = () => {
    const random = sampleAliases[Math.floor(Math.random() * sampleAliases.length)] + "_" + Math.floor(100 + Math.random() * 900);
    setName(random);
  };

  const handleAnonymousJoin = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await postRequest("/auth/anonymous", { name });

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onClose();
        navigate("/onboarding");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to join anonymously. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 space-y-6 animate-in zoom-in-95 duration-200 text-left">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Join Anonymously</h3>
              <p className="text-xs text-blue-600 font-semibold">100% Confidential & Free</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Pick a nickname or pseudonym. We use this only to personalize your CBT conversations. 
            No student ID, email, or real identity is recorded.
          </p>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleAnonymousJoin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Choose an Alias / Nickname
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. BraveScholar or CalmFalcon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
                />
                
                <button
                  type="button"
                  onClick={handleRandomAlias}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-all border border-blue-200"
                >
                  Randomize 🎲
                </button>
              </div>
            </div>

            {/* Privacy Promise Badge */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Zero logs linked to university academic or registrar databases.</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-bold transition-all"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-[2] py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Start Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
