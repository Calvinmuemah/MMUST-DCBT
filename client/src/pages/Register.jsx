import { useState } from "react";
import { postRequest } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);

      // API call
      const response = await postRequest("/auth/register", {
        name,
        email,
        password,
      });

      // optional: you can log response for debugging
      console.log("Registered user:", response);

      // redirect to login AFTER successful register
      navigate("/login");

    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-6">

      {/* BACKGROUND */}
      <div className="absolute w-72 h-72 bg-purple-200/30 rounded-full blur-3xl top-10 right-10"></div>
      <div className="absolute w-72 h-72 bg-teal-200/30 rounded-full blur-3xl bottom-10 left-10"></div>

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-[32px] p-8">

        {/* HEADER */}
        <div className="text-center">
          {/* <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
            🌿
          </div> */}

          <h1 className="text-3xl font-black text-slate-900 mt-4">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Start your private CBT wellness journey
          </p>
        </div>

        {/* FORM */}
        <div className="mt-8 space-y-4">

          <input
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-300 outline-none"
            placeholder="Nickname (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 font-semibold">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
}