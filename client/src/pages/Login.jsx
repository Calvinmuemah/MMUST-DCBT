import { useState } from "react";
import { postRequest } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await postRequest("/auth/login", {
        email,
        password,
      });

      // save auth state
      login(data.user, data.token);

      // 🔥 redirect to onboarding after login
      navigate("/onboarding");

    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6">

      {/* BACKDROP BLURS */}
      <div className="absolute w-72 h-72 bg-blue-200/30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-teal-200/30 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-[32px] p-8">

        {/* HEADER */}
        <div className="text-center">
          {/* <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white text-2xl shadow-lg">
            🧠
          </div> */}

          <h1 className="text-3xl font-black text-slate-900 mt-4">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Continue your mental wellness journey
          </p>
        </div>

        {/* FORM */}
        <div className="mt-8 space-y-4">

          <input
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-300 outline-none"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-300 outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        {/* FOOTER TEXT */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Create one
          </a>
        </p>

      </div>
    </div>
  );
}