import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight, ShieldCheck, Lock, KeyRound, Eye, Store, Package } from "lucide-react";
import { BRAND } from "../brand";
import { useAuth } from "../context/AuthContext";
import useListings from "../hooks/useListings";
import useListingActions from "../hooks/useListingActions";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import { GROUPS } from "../utils/categoryGroups";
import heroBg from "../assets/kartly-hero.png";

const STEPS = [
  { n: "01", Icon: Lock, title: "Pay into escrow", text: "Your payment is held by Kartly, not handed to the vendor. The vendor is paid only after delivery." },
  { n: "02", Icon: Eye, title: "Check your item", text: "Inspect the item when it arrives. If something is wrong, open a dispute before you confirm." },
  { n: "03", Icon: KeyRound, title: "Share your code", text: "Happy with it? Give the vendor your delivery code and the funds are released to them." },
];

export default function Landing() {
  const { user } = useAuth();
  const { hash } = useLocation();
  const [params] = useSearchParams();
  const urlQ = params.get("q") || "";
  const [group, setGroup] = useState("all");
  const { isFav, onToggleFav, onOpen } = useListingActions();

  // "/#how" from the footer scrolls to that section
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 300);
    return () => clearTimeout(t);
  }, [hash]);

  // university is gone from Kartly; "" means no filter
  const { items, loading, error } = useListings({ category: "all", search: urlQ, university: "" });
  const active = GROUPS.find((g) => g.id === group) || GROUPS[0];
  const shown = active.cats ? items.filter((l) => active.cats.includes(l.cat)) : items;

  const isVendor = user?.role === "vendor";
  const sellLink = isVendor ? "/vendor" : "/sell/apply";

  return (
    <div className="min-h-screen bg-white text-night">
      <Header overlay />

      {/* HERO */}
      <section
        id="hero"
        className="relative flex min-h-[100svh] flex-col justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8,14,12,.92) 0%, rgba(8,14,12,.7) 45%, rgba(8,14,12,.3) 100%), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-28 sm:px-6">
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Shop with<br />confidence.<br />
            <span className="text-brand-500">Safely.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {BRAND.name} connects you with vendors approved by our team. Your money stays in escrow until you confirm your item.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/products" className="inline-flex items-center gap-2.5 rounded-lg bg-brand-600 px-7 py-3.5 text-base font-semibold shadow-lg shadow-brand-600/20 hover:bg-brand-700">
              Start Shopping <ArrowRight size={20} />
            </Link>
            <Link to={sellLink} className="rounded-lg border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold backdrop-blur hover:bg-white/20">
              {isVendor ? "Vendor Dashboard" : "Become a Vendor"}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/80">
            {["Admin-approved vendors", BRAND.paymentsLive ? "Escrow-protected payments" : "Escrow demo (Monnify sandbox)", "Delivery code release"].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-brand-500" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* MARKETPLACE PREVIEW */}
      <section id="listings" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold md:text-3xl">{BRAND.name} Marketplace</h2>
          <Link to="/products" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">See all products →</Link>
        </div>

        <div className="-mx-4 mt-6 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroup(g.id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${group === g.id ? "border-brand-600 bg-brand-600 text-white" : "border-stone-200 bg-white text-night hover:border-brand-500"}`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-[340px] animate-pulse rounded-2xl bg-stone-100" />)}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 py-14 text-center">
              <p className="font-semibold text-rose-700">{String(error)}</p>
              <p className="mt-1 text-sm text-rose-600">Check that the API is running, then refresh.</p>
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-14 text-center">
              <Package className="mx-auto h-10 w-10 text-stone-400" />
              <p className="mt-3 font-semibold">No listings here yet</p>
              <button onClick={() => setGroup("all")} className="mt-2 text-sm font-semibold text-brand-700 underline">Show all</button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {shown.slice(0, 8).map((l) => (
                  <ListingCard key={l.id} listing={l} isFav={isFav(l.id)} onToggleFav={onToggleFav} onOpen={onOpen} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link to="/products" className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-8 py-3 text-sm font-semibold hover:border-brand-500">
                  Browse all products <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* HOW IT PROTECTS */}
      <section id="how" className="scroll-mt-16 border-y border-stone-100 bg-stone-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
              <ShieldCheck size={15} /> Buyer protection
            </span>
            <h2 className="mt-4 text-2xl font-bold md:text-3xl">How {BRAND.name} protects your money</h2>
            <p className="mt-2 text-sm text-stone-500 md:text-base">Three steps from checkout to a happy handover.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ n, Icon, title, text }) => (
              <div key={n} className="rounded-2xl border border-stone-200 bg-white p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white"><Icon size={22} /></span>
                  <span className="text-4xl font-bold text-stone-200">{n}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENDOR CTA */}
      <section className="bg-night px-4 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-3xl border border-white/10 bg-night-soft p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-500">
              <Store size={15} /> For vendors
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-tight md:text-3xl">Turn what you sell into a storefront.</h2>
            <p className="mt-3 text-sm text-white/75 md:text-base">
              Apply in a couple of minutes. Once approved, list your products with photos and get paid through escrow after delivery.
            </p>
          </div>
          <Link to={sellLink} className="shrink-0 rounded-lg bg-brand-600 px-7 py-3.5 text-center text-base font-semibold hover:bg-brand-700">
            {isVendor ? "Vendor Dashboard" : "Open Your Store"}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}