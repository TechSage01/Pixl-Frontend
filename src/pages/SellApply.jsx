import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, MapPin, Search, ShoppingBag, ShieldCheck, Wallet, LayoutDashboard, Clock, CheckCircle2, XCircle, Info, Check, Sparkles, ArrowRight, ListChecks } from "lucide-react";
import PageShell from "../components/PageShell";
import LocationPicker from "../components/LocationPicker";
import { useAuth } from "../context/AuthContext";
import { rememberIntent } from "../utils/postLogin";
import { BRAND } from "../brand";

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  ["tech", "Tech & laptops"],
  ["electronics", "Electronics"],
  ["phone-accessories", "Phone accessories"],
  ["fashion", "Fashion"],
  ["books", "Books"],
  ["home", "Home & kitchen"],
  ["hostel", "Hostel"],
  ["sports", "Sports"],
  ["food", "Food & groceries"],
  ["utensils", "Kitchen & utensils"],
  ["furniture", "Furniture"],
  ["other", "Others"],
];

const empty = {
  businessName: "",
  phone: "",
  businessAddress: "",
  category: "tech",
  whatYouSell: "",
  pickupSpot: "",
};

const input =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const label = "mb-1.5 block text-sm font-semibold text-gray-800";

function Pitch() {
  const items = [
    [ShieldCheck, "Secure payments through escrow", "Customer payments are held while an order is being fulfilled and released after delivery is confirmed."],
    [MapPin, "Sell where your customers are", "Choose your shop location so buyers nearby can find you."],
    [LayoutDashboard, "One place for your business", "Manage your listings and orders from your vendor account."],
  ];
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-brand-600 p-8 text-white sm:p-10 lg:sticky lg:top-24 lg:h-full">
      <ShoppingBag className="pointer-events-none absolute -right-10 top-10 h-72 w-72 text-white/10" strokeWidth={1.2} />
      <div className="relative flex h-full flex-col">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
          <Store size={26} />
        </span>
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.3em] text-white/80">For sellers</p>
        <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Your products. Your shop. One marketplace.
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/85">
          {BRAND.name} gives vendors a simple way to reach customers, receive orders, and manage their business from one platform.
        </p>
        <div className="mt-8 space-y-4">
          {items.map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <p className="text-base font-bold">{title}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 text-gray-900 lg:mt-auto">
          <p className="flex items-center gap-2 text-base font-bold"><ListChecks size={20} className="text-brand-600" /> Have these ready</p>
          <ul className="mt-4 space-y-3">
            {[
              "Your shop name",
              "A phone number buyers can reach",
              "Your shop location",
              "A short description of what you sell",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Check size={14} /></span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-500">It takes about two minutes. We review every application before you can list.</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ icon: Icon, tone, title, children }) {
  const tones = {
    green: "bg-brand-50 text-brand-700",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <span className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${tones[tone]}`}>
        <Icon size={24} />
      </span>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="mt-2 text-sm text-gray-600">{children}</div>
    </div>
  );
}

export default function SellApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [application, setApplication] = useState(null);
  const [checking, setChecking] = useState(true);
  const [reapplying, setReapplying] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }
    fetch(`${API}/api/vendors/application`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setApplication(d?.application ?? d ?? null))
      .catch(() => setApplication(null))
      .finally(() => setChecking(false));
  }, [user]);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function goLogin() {
    rememberIntent({ next: "/sell/apply" });
    navigate("/login", { state: { message: "Sign in to apply as a vendor." } });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!user) return goLogin();
    if (form.businessName.trim().length < 3) return setError("Business name must be at least 3 characters.");
    if (!form.phone.trim()) return setError("Enter your phone number.");
    if (form.businessAddress.trim().length < 5) return setError("Choose your shop location.");
    if (form.whatYouSell.trim().length < 10) return setError("Tell us what you sell (at least 10 characters).");

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/vendors/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit your application.");
      setApplication(data.application ?? { status: "pending", businessName: form.businessName });
      setReapplying(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  let right;
  if (checking) {
    right = <p className="p-6 text-sm text-gray-500">Loading...</p>;
  } else if (user?.role === "vendor") {
    right = (
      <Panel icon={CheckCircle2} tone="green" title="You're a Kartly vendor 🎉">
        <p>Your application was approved. You can start listing items.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/vendor" className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Go to Vendor Dashboard</Link>
          <Link to="/sell/new" className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50">Add a listing</Link>
        </div>
      </Panel>
    );
  } else if (application?.status === "pending") {
    right = (
      <Panel icon={Clock} tone="amber" title="Application under review">
        <p>
          We received your application{application.businessName ? ` for “${application.businessName}”` : ""}.
          You'll get an email when it's approved or if we need anything.
        </p>
        <Link to="/" className="mt-5 inline-block text-sm font-medium text-brand-700 hover:underline">← Back home</Link>
      </Panel>
    );
  } else if (application?.status === "rejected" && !reapplying) {
    right = (
      <Panel icon={XCircle} tone="red" title="Application not approved">
        {application.reviewNote && (
          <p className="mx-auto mb-3 max-w-sm rounded-lg bg-red-50 p-3 text-red-700">Reason: {application.reviewNote}</p>
        )}
        <button onClick={() => setReapplying(true)} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          Apply again
        </button>
      </Panel>
    );
  } else {
    right = (
      <form onSubmit={handleSubmit} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Store size={26} /></span>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Create your vendor profile</h2>
            <p className="mt-1 text-base text-gray-600">Set up the basics of your shop and start selling on {BRAND.name}.</p>
          </div>
        </div>
        {!user && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-base text-amber-900">
            <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-bold">Sign in required</p>
              <p>
                Please sign in before submitting your vendor profile.{" "}
                <button type="button" onClick={goLogin} className="font-semibold underline">Sign in</button>
              </p>
            </div>
          </div>
        )}

        <h3 className="mb-1 text-xl font-bold text-gray-900">Shop information</h3>
        <p className="mb-5 text-sm text-gray-500">Tell buyers about your business.</p>
        <div className="space-y-4">
          <div>
            <label className={label}>Business or shop name</label>
            <input name="businessName" value={form.businessName} onChange={set} maxLength={80} className={input} placeholder="Tech6 Gadgets" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Phone number</label>
              <input name="phone" type="tel" value={form.phone} onChange={set} className={input} placeholder="08012345678" />
            </div>
            <div>
              <label className={label}>Main category</label>
              <select name="category" value={form.category} onChange={set} className={input}>
                {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        <h3 className="mb-1 mt-10 text-xl font-bold text-gray-900">What you sell</h3>
        <p className="mb-5 text-sm text-gray-500">Help buyers know what to expect.</p>
        <div className="space-y-4">
          <div>
            <label className={label}>Describe your shop</label>
            <textarea name="whatYouSell" value={form.whatYouSell} onChange={set} rows={4} maxLength={500} className={input} placeholder="Your items, where you source them, and their usual condition" />
            <p className="mt-1 text-xs text-gray-400">This appears on your shop card. {form.whatYouSell.length}/500</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><MapPin size={22} /></span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Shop location</h3>
              <p className="text-sm text-gray-500">Tell buyers where to find you.</p>
            </div>
          </div>

          <button type="button" onClick={() => setPickerOpen(true)} className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-stone-50 p-4 text-left hover:border-brand-500">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm"><MapPin size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold text-gray-900">{form.businessAddress ? "Shop location" : "Find your shop location"}</span>
              <span className="block truncate text-sm text-gray-500">{form.businessAddress || "Search for your street, area, or campus"}</span>
            </span>
            <Search size={20} className="shrink-0 text-gray-500" />
          </button>
          <LocationPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(v) => setForm((f) => ({ ...f, businessAddress: v.slice(0, 200) }))} />

          <div className="mt-4">
            <label className={label}>Usual pickup spot (optional)</label>
            <input name="pickupSpot" value={form.pickupSpot} onChange={set} className={input} placeholder="e.g. Main gate" />
          </div>
          {BRAND.supportEmail && (
            <p className="mt-4 text-sm text-gray-500">
              Can't describe your location?{" "}
              <a href={`mailto:${BRAND.supportEmail}`} className="font-bold text-brand-700 underline">Contact {BRAND.name} Support</a>
            </p>
          )}
        </div>

        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" onClick={() => navigate("/")} className="rounded-full border border-gray-300 px-7 py-3 text-base font-bold text-gray-800 hover:bg-gray-50">Cancel</button>
          <button disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-base font-bold text-white hover:bg-brand-700 disabled:opacity-50 sm:flex-none">
            <Check size={18} /> {submitting ? "Submitting..." : "Create vendor profile"}
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-stone-50 p-6">
          <p className="flex items-center gap-2 text-base font-bold text-gray-900"><Sparkles size={18} className="text-brand-600" /> What happens next?</p>
          <ol className="mt-4 space-y-3">
            {["Create or use your existing Kartly account.", "Set up your shop and choose your location.", "We review your application, then you can list products."].map((t, i) => (
              <li key={t} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>{t}
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-start gap-3 border-t border-gray-200 pt-5 text-sm leading-relaxed text-gray-600">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand-600" />
            <p>Buyers shouldn't have to simply trust a seller with their money. Payment protection is built into the marketplace checkout.</p>
          </div>
          {!user && (
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
              <span className="text-sm text-gray-500">Already have a {BRAND.name} account?</span>
              <button type="button" onClick={goLogin} className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50">Log in <ArrowRight size={16} /></button>
            </div>
          )}
        </div>
      </form>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-700">{BRAND.name} for vendors</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Start selling on {BRAND.name}.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">
          Turn your products into a digital storefront buyers can discover, order, and receive.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Pitch />
          <div>{right}</div>
        </div>
      </div>
    </PageShell>
  );
}