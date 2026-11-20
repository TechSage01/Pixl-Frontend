import { useMemo, useState, useEffect } from "react";
import { universities, LISTINGS } from "../data/LandingData";
import pixlLogo from "../assets/pixl-logo.png";
import heroImg from "../assets/campus.png";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  MapPin,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  XCircle,
  ChevronRight,
  Sparkles,
  UserCheck,
  Building2,
  Check,
  Star,
  Zap,
  AlertTriangle,
  X,
  Menu,
  TrendingUp,
  // SmartPhone,
  Laptop,
  ChevronDown,
  Package,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
const naira = (n) => "₦" + n.toLocaleString("en-NG");
const CATS = [
  "All",
  "Gadgets",
  "Textbooks",
  "Hostel",
  "Accessories",
  "Fashion",
];
const STEPS = [
  {
    num: "01",
    title: "LOCK FUNDS IN ESCROW",
    desc: "You pay into escrow at checkout. The seller sees the money is held, but cannot touch it until you inspect and confirm delivery.",
    icon: Lock
  },
  {
    num: "02",
    title: "DAYLIGHT INSPECTION",
    desc: "Meet at a designated public campus spot (e.g., Student Center, Library, Faculty Car Park), test the item, and verify condition.",
    icon: MapPin
  },
  {
    num: "03",
    title: "RELEASE WITH 1-CLICK OTP",
    desc: "Happy with the item? Enter the 6-digit confirmation code on your phone to instantly release funds directly to the seller's verified account.",
    icon: CheckCircle2
  }
];
const COMPARE = [
  [
    "Payment protection",
    "Escrow holds funds until you satisfaction",
    "Send money via direct bank transfer and hope for the best",
  ],
  [
    "Identity verification",
    "Verified vendors and student ID-backed profile",
    "Anonymous profiles",
  ],
  [
    "Pickup safety",
    "Public campus meet-up points",
    "Isolated or unfamiliar off-campus locations",
  ],
  [
    "Dispute handling",
    "Structured mediator-assisted resolution flow",
    "Seller blocks you and deletes their account",
  ],
];

const TESTIMONIALS = [
  {
    quote: "Getting a clean engineering laptop on campus used to be a gamble. With Pixl, I tested the Macbook at the Senate building before releasing a single Naira. Zero anxiety!",
    author: "Femi Adebayo",
    role: "Computer Eng., LAUTECH",
    stars: 5,
    tag: "Verified Buyer"
  },
  {
    quote: "As a student vendor selling tech gadgets, trust was always the hard part. Pixl escrow gives my buyers total confidence—my sales tripled in just one semester!",
    author: "Dami Ojo",
    role: "Campus Vendor, OAU",
    stars: 5,
    tag: "Verified Vendor"
  }
];


export default function Landing() {
  const [uni, setUni] = useState("lautech");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [activeModalListing, setActiveModalListing] = useState(null);
  const [escrowStep, setEscrowStep] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const current = universities.find((u) => u.id === uni);
  const uniListings = LISTINGS.filter((l) => l.uni === uni);
  const shown = useMemo(() => {
    return uniListings.filter((l) => {
      const matchesCat =
        cat.toLowerCase() === "all" ||
        (l.cat && l.cat.toLowerCase() === cat.toLowerCase());
      const matchesQuery =
        l.title.toLowerCase().includes(q.trim().toLowerCase()) ||
        (l.note && l.note.toLowerCase().includes(q.trim().toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [uniListings, cat, q]);

  const go = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const soon = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };
  return (
    <>
      <div className="min-h-screen bg-[#FBFDFC] font-sans text-slate-800 antialised selection:bg-emerald-100 selection:text-emerald-900">
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Logo & Badge */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => go("hero")}>
            <img src={pixlLogo} alt="Pixl Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Pixl</span>
            <span className="ml-1 rounded-full bg-[#E6F4EA] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#064E3B] uppercase">
              Verified
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-7 text-xs font-semibold text-slate-600 lg:flex">
            <button onClick={() => go("listings")} className="transition hover:text-[#064E3B] cursor-pointer">
              Marketplace
            </button>
            <button onClick={() => go("hubs")} className="transition hover:text-[#064E3B] cursor-pointer">
              Campus Hubs
            </button>
            <button onClick={() => go("how")} className="transition hover:text-[#064E3B] cursor-pointer">
              How Monnify Works?
            </button>
            <button onClick={() => go("why")} className="transition hover:text-[#064E3B] cursor-pointer">
              Safety
            </button>
            <button onClick={() => go("why")} className="transition hover:text-[#064E3B] cursor-pointer">
              Sell on Campus
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden items-center gap-4 sm:flex">
            <Link
              to="/login"
              className="text-xs cursor-pointer font-semibold text-slate-700 transition hover:text-[#064E3B]"
            >
              Log In
            </Link>
            <button
              onClick={() => go("listings")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064E3B] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-900 active:scale-95"
            >
              Start Trading Now <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-6 py-4 lg:hidden flex flex-col gap-3">
            <button onClick={() => go("listings")} className="text-left py-1 text-sm font-semibold text-slate-700">Marketplace</button>
            <button onClick={() => go("hubs")} className="text-left py-1 text-sm font-semibold text-slate-700">Campus Hubs</button>
            <button onClick={() => go("how")} className="text-left py-1 text-sm font-semibold text-slate-700">How Monnify Works?</button>
            <button onClick={() => go("why")} className="text-left py-1 text-sm font-semibold text-slate-700">Safety &amp; Comparison</button>
            <hr className="my-1 border-slate-100" />
            <button onClick={() => soon("Sign-in portal coming soon")} className="text-left py-1 text-sm font-semibold text-slate-700">Log In</button>
            <button onClick={() => go("listings")} className="rounded-lg bg-[#064E3B] py-2.5 text-center text-xs font-bold text-white">Start Trading Now</button>
          </div>
        )}
        </header>

         <section id="hero" className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column Text & Integrated Search */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.08]">
              Campus Commerce, <br />
              Sorted. <br />
              <span className="text-[#064E3B]">Zero Scams.</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
              The peer-to-peer student marketplace within your campus gates. Verified sellers, physical campus meetups, and guaranteed payouts powered by Monnify CBN-Licensed Escrow.
            </p>

            {/* Multi-field Integrated Search Bar */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all focus-within:border-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                
                {/* Search Query Input */}
                <div className="relative flex-1 flex items-center px-3 py-1">
                  <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Search gadgets, textbooks..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>

                <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />

                {/* Campus Hub Selector */}
                <div className="relative flex items-center px-3 py-1 min-w-[170px]">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
                  <select
                    value={uni}
                    onChange={(e) => setUni(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 focus:outline-none bg-transparent cursor-pointer appearance-none pr-4"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id} disabled={!u.active}>
                        {u.short} - {u.hub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 pointer-events-none" />
                </div>

                {/* Search Action Button */}
                <button
                  onClick={() => go("listings")}
                  className="rounded-xl bg-[#064E3B] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-900 active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Key Statistics Bar */}
            <div className="mt-10 grid grid-cols-4 gap-2 border-t border-slate-100 pt-6 text-slate-600">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campuses</dt>
                <dd className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                  {universities.filter((u) => u.active).length} Active
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Students</dt>
                <dd className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">5,000+</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Escrow Secured</dt>
                <dd className="text-base sm:text-lg font-extrabold text-[#064E3B] mt-0.5">100%</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scam Rate</dt>
                <dd className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">0%</dd>
              </div>
            </div>
          </div>

          {/* Right Column Image Showcase & Escrow Badge */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Campus Reference Photo Frame */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-xl">
                <img
                  src={heroImg}
                  alt="Verified Campus Marketplace Meetup"
                  className="h-[360px] sm:h-[440px] w-full object-cover object-center"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Floating Active Escrow Overlay Badge */}
              <div className="absolute -bottom-5 left-4 right-4 sm:left-6 sm:right-6 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Escrow Vault</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <p className="text-base sm:text-lg font-black text-slate-900">₦96,350 Held Safely</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {current.short} Hub
                    </span>
                    <p className="mt-1 text-[10px] text-slate-400">CBN-Protected</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      
      <section id="hubs" className="bg-slate-50/80 py-12 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#064E3B]">Designated Campus Corridors</p>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Verified Campus Trading Hubs</h2>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 md:mt-0 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              Verified physical meet-up locations for student trade
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
            {universities.map((u) => {
              const count = LISTINGS.filter((l) => l.uni === u.id).length;
              const isSelected = u.id === uni;
              return (
                <button
                  key={u.id}
                  disabled={!u.active}
                  onClick={() => setUni(u.id)}
                  className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? "border-[#064E3B] bg-white ring-2 ring-[#064E3B] shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{u.short}</span>
                    {u.active ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-[#064E3B]">
                        {count > 0 ? `${count} Deals` : "Active Hub"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-600 line-clamp-1">{u.name}</p>
                  <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-emerald-600 shrink-0" /> {u.hub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      
      <section id="listings" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold text-[#064E3B] uppercase tracking-wider">
            Campus Marketplace
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            Featured &amp; Trending Listings
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Student-to-student items available for physical daylight inspection on campus.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {CATS.map((c) => {
            const isActive = cat.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#064E3B] text-white shadow-md scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50">
              <Package className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">No matching campus listings</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try switching category or institution.
              </p>
              <button
                onClick={() => { setCat("All"); setQ(""); }}
                className="mt-4 text-xs font-bold text-[#064E3B] underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            shown.slice(0, 6).map((l) => (
              <article
                key={l.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200"
              >
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  {l.img ? (
                    <img
                      src={l.img}
                      alt={l.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-4xl font-extrabold text-[#064E3B]">
                      {l.title ? l.title[0] : "P"}
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-extrabold text-white backdrop-blur">
                      {l.tag || "Verified Vendor"}
                    </span>
                  </div>

                  <span className="absolute bottom-3 right-3 rounded-full bg-emerald-800/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    Escrow Ready
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-extrabold uppercase tracking-wider text-[#064E3B] text-[10px]">
                      {l.cat}
                    </span>
                    <span className="font-medium text-slate-400 text-[11px]">
                      {l.seller || "Student Seller"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#064E3B] transition">
                    {l.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {l.note || "Available for immediate campus pickup."}
                  </p>

                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Listed Price</span>
                      <span className="text-lg font-black text-slate-900">{naira(l.price)}</span>
                    </div>

                    <button
                      onClick={() => soon(`Initiating Monnify Escrow for ${l.title}...`)}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#064E3B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-950 active:scale-95"
                    >
                      Inspect &amp; Buy <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* View All Deals Dropdown Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => soon(`Showing all ${current?.short || "Campus"} listings`)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            <span>View 15,400+ {current?.short || "Campus"} Deals</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </section>
      <section id="how" className="py-16 bg-slate-50/60 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-[#064E3B] uppercase tracking-wider">
              Protected Workflow
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">How Monnify Escrow Protects You</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Never send "commitment fees" into the dark again. Neither student is vulnerable at any stage of the trade.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B] text-white font-black text-base shadow-sm">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-black text-slate-200">{step.num}</span>
                  </div>

                  <h3 className="mt-6 text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#064E3B]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Monnify CBN Escrow Guarantee</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="engine" className="bg-[#0B1528] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" /> CBN-Licensed Escrow Engine
              </span>

              <h2 className="text-3xl font-black text-white mt-4 sm:text-4xl leading-tight">
                Monnify CBN-Licensed Escrow Engine
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                We partner with Monnify (backed by Moniepoint) to provide dedicated sandbox and live virtual accounts for automated dedicated escrow transfers. No single party can touch buyer funds without dual OTP authorization.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 border border-slate-700">
                  <Check className="h-4 w-4 text-emerald-400" /> Dedicated Virtual Bank Accounts
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 border border-slate-700">
                  <Check className="h-4 w-4 text-emerald-400" /> Instant Disbursal via Interbank NIP
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 border border-slate-700">
                  <Check className="h-4 w-4 text-emerald-400" /> Automated Mediator Resolution Flow
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-slate-400">STATUS: ACTIVE</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span> Sandbox Live
                  </span>
                </div>

                <div className="mt-6 space-y-4 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>PAYMENT VAULT:</span>
                    <span className="text-white font-bold">₦2,850,000 SECURED</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>PARTNER BANK:</span>
                    <span className="text-white">Moniepoint Microfinance Bank</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>DISBURSAL SPEED:</span>
                    <span className="text-emerald-400 font-bold">&lt; 30 Seconds</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-slate-950 p-4 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                    <Lock className="h-3.5 w-3.5" /> Dual-Lock Authorization
                  </div>
                  Automated release triggers only when OTP is confirmed during campus daylight inspection.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section id="why" className="bg-slate-50/80 py-16 border-b border-slate-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-[#064E3B] uppercase tracking-wider">
              Safety Comparison
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Why Trade on Pixl Instead of Social Groups?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Fixing the endemic student fraud risks in WhatsApp and Telegram groups.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#064E3B] text-white font-bold">
                <tr>
                  <th className="p-4 sm:p-5">TRADING FEATURE</th>
                  <th className="p-4 sm:p-5 text-emerald-200">PIXL ESCROW MARKETPLACE</th>
                  <th className="p-4 sm:p-5 text-slate-300">WHATSAPP / TELEGRAM GROUPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARE.map(([feature, pixlAdv, waDisadv]) => (
                  <tr key={feature} className="hover:bg-slate-50/60">
                    <td className="p-4 sm:p-5 font-bold text-slate-900">{feature}</td>
                    <td className="p-4 sm:p-5 font-semibold text-[#064E3B] bg-emerald-50/30">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pixlAdv}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-rose-600">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{waDisadv}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-[#064E3B] uppercase tracking-wider">
            Student Reviews
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            What Nigerian Students Say About Pixl
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Real stories from student sellers and buyers across campus trade corridors.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(t.stars)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.author}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-[#064E3B]">
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#064E3B] via-emerald-900 to-slate-900 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
              Campus Vendor Portal
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mt-3">
              Turn hostel clutter into tuition money. Or find your next semester essentials.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join over 15,000 students trading securely across Nigerian university hubs with Monnify escrow protection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => go("listings")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-[#064E3B] shadow-md transition hover:bg-emerald-50 active:scale-95"
              >
                Start Trading Now <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => soon("Vendor onboarding portal opening soon.")}
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                Become a Student Vendor (Free)
              </button>
            </div>
          </div>
        </div>
      </section>


      <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-xs text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 pb-10 border-b border-slate-100">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <img src={pixlLogo} alt="Pixl Logo" className="h-7 w-auto" />
                <span className="text-lg font-black text-slate-900">Pixl</span>
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-sm">
                The peer-to-peer student commerce platform built for Nigerian universities. Verified vendor listings, physical campus meetups, and escrow protection powered by Monnify.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Campus Corridors</h4>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li><button onClick={() => { setUni("lautech"); go("listings"); }} className="hover:text-[#064E3B]">LAUTECH Hub</button></li>
                <li><button onClick={() => { setUni("oau"); go("listings"); }} className="hover:text-[#064E3B]">OAU Ife Hub</button></li>
                <li><button onClick={() => { setUni("unilag"); go("listings"); }} className="hover:text-[#064E3B]">UNILAG Akoka</button></li>
                <li><button onClick={() => { setUni("ui"); go("listings"); }} className="hover:text-[#064E3B]">UI Ibadan</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Safety &amp; Escrow</h4>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li><button onClick={() => go("how")} className="hover:text-[#064E3B]">How Escrow Works</button></li>
                <li><button onClick={() => go("engine")} className="hover:text-[#064E3B]">Monnify CBN Security</button></li>
                <li><button onClick={() => go("why")} className="hover:text-[#064E3B]">Daylight Meetup Spots</button></li>
                <li><button onClick={() => soon("Dispute flow: support@pixl.ng")} className="hover:text-[#064E3B]">Dispute Resolution</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Platform</h4>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li><button onClick={() => soon("Privacy policy coming soon.")} className="hover:text-[#064E3B]">Privacy Policy</button></li>
                <li><button onClick={() => soon("Terms of service coming soon.")} className="hover:text-[#064E3B]">Terms of Service</button></li>
                <li><button onClick={() => soon("Support: hello@pixl.ng")} className="hover:text-[#064E3B]">Contact Support</button></li>
              </ul>
            </div>

          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Pixl Commerce Ltd. All rights reserved.</p>
            <p>Payments processed securely via Monnify CBN-Licensed Escrow Infrastructure.</p>
          </div>
        </div>
      </footer>

    
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-2xl border border-slate-800 flex items-center gap-2 animate-bounce">
          <Zap className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
    </>
  );
}