import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck, Store, ShoppingBag, Info } from "lucide-react";
import Logo from "../components/Logo";
import { BRAND } from "../brand";

const API = import.meta.env.VITE_API_URL;

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);
const GithubIcon = () => (
  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const COPY = {
  login: {
    title: "Welcome back",
    sub: "Log in to your Kartly account.",
    cta: "Continue with email",
  },
  signup: {
    title: "Create your account",
    sub: "Join Kartly to shop safely or open your own shop.",
    cta: "Sign up with email",
  },
};

export default function Login({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode === "signup" || location.pathname === "/signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const copy = COPY[mode];

  function goBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  }

  async function handleSendCode(e) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/otp/request`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || "Failed to send code. Please try again.");
        return;
      }
      navigate("/verify", { state: { email: clean } });
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const social =
    "flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-50";

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-6">
        {/* left pitch */}
        <div className="relative hidden overflow-hidden rounded-[28px] bg-brand-600 p-10 text-white lg:block">
          <ShoppingBag className="pointer-events-none absolute -right-12 top-16 h-80 w-80 text-white/10" strokeWidth={1.2} />
          <div className="relative">
            <Link to="/" className="inline-block text-white"><Logo /></Link>
            <h2 className="mt-16 text-4xl font-extrabold leading-tight tracking-tight">
              {BRAND.tagline}
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-white/85">
              One marketplace for buyers and vendors, built around protected payments.
            </p>
            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
                <p className="flex items-center gap-3 text-base font-bold"><ShieldCheck size={20} /> Shop with confidence</p>
                <p className="mt-2 text-sm text-white/85">Browse approved vendors and save the products you love.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
                <p className="flex items-center gap-3 text-base font-bold"><Store size={20} /> Sell on {BRAND.name}</p>
                <p className="mt-2 text-sm text-white/85">Sign up, then apply to open your shop.</p>
              </div>
            </div>
          </div>
        </div>

        {/* right card */}
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-4 inline-block text-gray-900 lg:hidden"><Logo /></Link>
          <button type="button" onClick={goBack} className="mb-4 flex items-center gap-2 rounded-full px-1 py-1 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} /> Back
          </button>

          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 grid grid-cols-2 rounded-full bg-stone-100 p-1 text-sm font-bold">
              {[["login", "Log in"], ["signup", "Sign up"]].map(([k, l]) => (
                <button key={k} type="button" onClick={() => { setMode(k); setError(""); }}
                  className={`rounded-full py-2.5 transition ${mode === k ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                  {l}
                </button>
              ))}
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">{copy.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{copy.sub}</p>

            {location.state?.message && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
                <p>{location.state.message}</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button type="button" className={social} onClick={() => (window.location.href = `${API}/api/auth/google`)}>
                <GoogleIcon /> Continue with Google
              </button>
              <button type="button" className={`${social} !border-gray-900 !bg-gray-900 !text-white hover:!bg-black`} onClick={() => (window.location.href = `${API}/api/auth/github`)}>
                <GithubIcon /> Continue with GitHub
              </button>
            </div>

            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-gray-200" />
              <span className="absolute bg-white px-3 text-xs font-bold uppercase tracking-wider text-gray-400">Or with email</span>
            </div>

            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-11 text-base outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                  <Mail size={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  We'll email you a 6-digit code. No password needed{mode === "signup" ? ", and your account is created when you verify" : ""}.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-base font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? (<><Loader2 size={18} className="animate-spin" /> Sending code...</>) : (<>{copy.cta} <ArrowRight size={18} /></>)}
              </button>

              {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {mode === "login" ? "New to Kartly?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="font-bold text-brand-700 hover:underline">
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">By continuing, you agree to use {BRAND.name} honestly and respectfully.</p>
        </div>
      </div>
    </div>
  );
}