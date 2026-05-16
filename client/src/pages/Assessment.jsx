import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../utils/api";

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const [stress, setStress] = useState("");
  const [challenge, setChallenge] = useState("");
  const [mood, setMood] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const finish = async () => {
    try {
      setLoading(true);

      await postRequest("/auth/onboarding", {
        stress,
        challenge,
        mood,
      });

      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Failed to save onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6">

      {/* BACKDROP */}
      <div className="absolute w-72 h-72 bg-blue-200/30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-teal-200/30 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-[32px] p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-900">
            Personal Assessment
          </h1>
          <p className="text-slate-500 mt-2">
            Help us understand your mental wellbeing
          </p>

          <div className="w-full h-2 bg-slate-100 rounded-full mt-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="mt-8 space-y-6">

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-slate-800">
                How would you rate your stress level?
              </h2>

              <div className="grid gap-3">
                {["Low", "Moderate", "High", "Very High"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setStress(lvl)}
                    className={`p-3 rounded-xl border text-left transition ${
                      stress === lvl
                        ? "bg-blue-100 border-blue-400"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-slate-800">
                What is your main challenge?
              </h2>

              <div className="grid gap-3">
                {[
                  "Academics",
                  "Finances",
                  "Relationships",
                  "Anxiety",
                  "Depression",
                  "Substance Use",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setChallenge(c)}
                    className={`p-3 rounded-xl border text-left transition ${
                      challenge === c
                        ? "bg-teal-100 border-teal-400"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-slate-800">
                How often do you feel overwhelmed?
              </h2>

              <div className="grid gap-3">
                {["Rarely", "Sometimes", "Often", "Almost Always"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`p-3 rounded-xl border text-left transition ${
                      mood === m
                        ? "bg-purple-100 border-purple-400"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 - SUMMARY */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Your Profile Summary
              </h2>

              <div className="bg-blue-50 rounded-xl p-5 text-left space-y-2">
                <p><b>Stress Level:</b> {stress}</p>
                <p><b>Challenge:</b> {challenge}</p>
                <p><b>Overwhelm Frequency:</b> {mood}</p>
              </div>

              <p className="text-slate-500 text-sm">
                This will help personalize your CBT experience.
              </p>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={back} className="px-5 py-2 rounded-xl border">
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={next}
              disabled={
                (step === 1 && !stress) ||
                (step === 2 && !challenge) ||
                (step === 3 && !mood)
              }
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold"
            >
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}