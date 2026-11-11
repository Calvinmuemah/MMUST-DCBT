import { useState } from "react";
import { postRequest } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from "lucide-react";
import mentalHealthHero from "../assets/mental-health-student.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const data = await postRequest("/auth/login", {
        email,
        password,
      });

      // Save auth state
      login(data.user, data.token);

      // Redirect to onboarding or dashboard
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Invalid login credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;

  return (
    <div className="min-h-screen w-full m-0 p-0 overflow-x-hidden flex flex-col md:flex-row bg-[#08070d] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* ========================================================
          LEFT COLUMN: Edge-to-Edge Hero Image
         ======================================================== */}
      <div className="w-full md:w-1/2 min-h-[460px] md:min-h-screen relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-12">
        {/* Full Edge-to-Edge Photograph */}
        <img 
          src={mentalHealthHero} 
          alt="African student finding calm and wellness" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Multi-layered Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-[#08070d]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#08070d]/90 hidden md:block" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Top-Left Brand Logo (Voltrex style glowing amber ring) */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full border-[3px] border-[#f59e0b] flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
          </div>
          <span className="text-white font-extrabold tracking-tight text-xl drop-shadow-md">
            MMUSTCare
          </span>
        </div>

        {/* Clean bottom area */}
        <div className="relative z-10" />
      </div>

      {/* ========================================================
          RIGHT COLUMN: Clean Modern Dark Form Canvas
         ======================================================== */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center p-6 sm:p-10 lg:p-14 bg-[#090812] relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-teal-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Centered Form Wrapper */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto py-8">
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-8">
            Welcome to MMUSTCare!
          </h1>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Field 1: Email (Login) */}
            <div className={`relative border rounded-xl px-4 pt-3 pb-2.5 bg-[#0e0c18] transition-colors ${
              error ? "border-rose-500/80 focus-within:border-rose-400" : "border-[#262038] focus-within:border-emerald-500"
            }`}>
              <label className="absolute -top-2 left-3 px-1.5 bg-[#090812] text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Email (Login)
              </label>
              <div className="flex items-center justify-between">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="student@mmust.ac.ke"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none font-medium"
                />
                {isEmailValid && (
                  <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 ml-2">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
                {error && !isEmailValid && (
                  <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 ml-2">
                    <X size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>

            {/* Field 2: Password (8+ characters) */}
            <div className="relative border border-[#262038] focus-within:border-emerald-500 rounded-xl px-4 pt-3 pb-2.5 bg-[#0e0c18] transition-colors">
              <label className="absolute -top-2 left-3 px-1.5 bg-[#090812] text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Password must contain 8 characters or more
              </label>
              <div className="flex items-center justify-between">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none font-medium tracking-wider"
                />
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  {isPasswordValid && (
                    <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)} 
                  className="hidden" 
                />
                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                  agreeTerms ? "bg-[#00d084] text-slate-950 font-black" : "border border-slate-600 bg-transparent"
                }`}>
                  {agreeTerms && <Check size={12} strokeWidth={3.5} />}
                </div>
                <span>
                  I have read and agree to <span className="underline decoration-slate-500 hover:text-white cursor-pointer">Terms and Confidentiality guidelines</span>
                </span>
              </label>
            </div>

            {/* Vibrant Solid Emerald Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#00d084] hover:bg-[#00ba76] active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation Link */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4">
              Create one now
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
