import React, { useState } from "react";
import pixlLogo from "../assets/pixl-logo.png";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import OtpVerificationScreen from "./AuthVerify";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginScreen({ onSendCode }) {
  const URL_ERRORS = {
    google: "Google sign-in failed. Try again.",
    github: "GitHub sign-in failed. Try again.",
    auth_failed: "We couldn't sign you in. Try again.",
  }
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [params] =  useSearchParams();
  const urlError = URL_ERRORS[params.get("error")]
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;
    const clean = email.trim().toLowerCase()
    if(!clean) return;
    setError("");
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/otp/request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Failed to send code. Please try again.");
        setLoading(false);
        return;
      }
      navigate("/verify", { state: { email: clean } });
      if (onSendCode) onSendCode(clean);
    } catch (err) {
      setError("Failed to send code. Please try again.")|| setError(err.message);
    } finally {
      setLoading(false);
    }
    // Trigger OTP sending API / Supabase integration here
    setTimeout(() => {
      setLoading(false);
      if (onSendCode) onSendCode(email);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        {/* BRAND HEADER */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#0A1628] rounded-2xl flex items-center justify-center p-2.5 mx-auto shadow-xs">
            {pixlLogo ? (
              <img
                src={pixlLogo}
                alt="Pixl"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-emerald-400 font-black text-xl">P.</span>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Sign in to Pixl
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Campus commerce for university students
            </p>
          </div>
        </div>

        {/* SOCIAL AUTH BUTTONS */}
        <div className="space-y-2">
          <button
          onClick={() => (window.location.href = `${API}/api/auth/google`)}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50/80 py-2.5 rounded-xl font-semibold text-slate-700 text-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = `${API}/api/auth/github`)}
            className="w-full flex items-center justify-center gap-2.5 bg-[#182230] hover:bg-[#0f172a] text-white py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 bg-black hover:bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Continue with X
          </button>
        </div>

        {/* DIVIDER */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200"></div>
          <span className="absolute bg-white px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Or with email
          </span>
        </div>

        {/* EMAIL INPUT FORM */}
        <form onSubmit={handleSendCode} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                placeholder="name@student.edu.ng"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#054D3B] focus:ring-1 focus:ring-[#054D3B] transition"
              />
              <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-[#054D3B] hover:bg-[#03362A] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Continue with Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
          {error || urlError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error || urlError}
            </p>
          )}
        </form>

        {/* FOOTER */}
        <p className="text-[11px] text-center text-slate-400 leading-relaxed">
          By continuing, you agree to Pixl's{" "}
          <a href="#" className="underline hover:text-slate-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-slate-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
