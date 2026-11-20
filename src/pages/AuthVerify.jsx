import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import pixlLogo from "../assets/pixl-logo.png";
import {
  ArrowLeft,
  Pencil,
  ShieldCheck,
  Hourglass,
  Lock,
  Loader2
} from "lucide-react";

export default function OtpVerificationScreen({ onVerifySuccess }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email passed via router state
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  // Handle back to login navigation with feedback
  const handleNavigateToLogin = () => {
    if (navigating) return;
    setNavigating(true);
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  // Countdown timer effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });
    setOtp(newOtp);

    const nextIndex = digits.length < 6 ? digits.length : 5;
    inputRefs.current[nextIndex]?.focus();
  };

  // Submit Verification Code
  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/otp/verify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || data?.message || "Invalid or expired verification code.");
        setLoading(false);
        return;
      }

      if (onVerifySuccess) onVerifySuccess(data);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendCode = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/otp/request`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Failed to resend code.");
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        
        {/* HEADER TOP BAR */}
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <button
            type="button"
            disabled={navigating}
            onClick={handleNavigateToLogin}
            className="flex items-center gap-1.5 hover:text-slate-900 transition cursor-pointer disabled:opacity-60"
          >
            {navigating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
            ) : (
              <ArrowLeft className="w-3.5 h-3.5" />
            )}
            <span>Back to Sign In</span>
          </button>

          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <div className="w-5 h-5 bg-[#0A1628] rounded-md flex items-center justify-center p-1">
              {pixlLogo ? (
                <img src={pixlLogo} alt="Pixl" className="w-full h-full object-contain" />
              ) : (
                <span className="text-emerald-400 font-black text-[10px]">P.</span>
              )}
            </div>
            <span>Pixl</span>
          </div>
        </div>

        {/* HERO ICON */}
        <div className="pt-2 flex justify-center">
          <div className="relative w-16 h-16 bg-blue-50/80 rounded-full flex items-center justify-center border border-blue-100">
            <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-blue-100 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute top-1 right-1 bg-amber-500 text-white p-0.5 rounded-full ring-2 ring-white">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* TITLE & EMAIL DISPLAY */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Enter Verification Code
          </h1>
          <p className="text-xs text-slate-500">
            We sent a 6-digit secure login code to:
          </p>

          <div className="pt-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
              <span className="text-slate-400">@</span>
              <span className="truncate max-w-[200px]">{email || "student@university.edu.ng"}</span>
              <button
                type="button"
                disabled={navigating}
                onClick={handleNavigateToLogin}
                className="text-slate-400 hover:text-slate-700 transition ml-0.5 cursor-pointer disabled:opacity-60"
              >
                {navigating ? (
                  <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                ) : (
                  <Pencil className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleVerify} className="space-y-4 pt-1">
          {/* OTP INPUT PIN GRID */}
          <div className="flex justify-between gap-1.5" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-lg font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#054D3B] focus:ring-1 focus:ring-[#054D3B] transition shadow-2xs"
              />
            ))}
          </div>

          {/* EXPIRATION TIMER & RESEND LINK */}
          <div className="flex items-center justify-between text-xs px-0.5">
            <div className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
              <Hourglass className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {timer > 0 ? (
                  <>Code expires in <span className="font-semibold text-slate-700">{timer}s</span></>
                ) : (
                  "Code expired"
                )}
              </span>
            </div>

            <button
              type="button"
              disabled={timer > 0 || resending}
              onClick={handleResendCode}
              className="text-[#054D3B] font-semibold hover:underline disabled:opacity-40 disabled:no-underline text-xs cursor-pointer flex items-center gap-1"
            >
              {resending && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{resending ? "Resending..." : "Resend Code"}</span>
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full bg-[#054D3B] hover:bg-[#03362A] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Verify Code</span>
              </>
            )}
          </button>

          {/* ERROR DISPLAY */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
              {error}
            </p>
          )}
        </form>

        {/* FOOTER */}
        <p className="text-[11px] text-slate-400 text-center pt-1">
          Didn't receive email? <span className="text-slate-600 font-medium">Check spam</span> ·{" "}
          <button
            type="button"
            disabled={navigating}
            onClick={handleNavigateToLogin}
            className="text-slate-600 font-medium hover:underline cursor-pointer inline-flex items-center gap-1 disabled:opacity-60"
          >
            {navigating && <Loader2 className="w-3 h-3 animate-spin text-slate-500" />}
            <span>Try another method</span>
          </button>
        </p>

      </div>
    </div>
  );
}