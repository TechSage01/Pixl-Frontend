import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Package, Store, ArrowRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { useAuth } from "../context/AuthContext";
import { resolveImage } from "../utils/images";

const API = import.meta.env.VITE_API_URL;

export function VendorAvatar({ vendor, size = "h-14 w-14", text = "text-xl" }) {
  return vendor.avatar ? (
    <img src={vendor.avatar} alt="" referrerPolicy="no-referrer" className={`${size} rounded-full object-cover`} />
  ) : (
    <span className={`flex ${size} items-center justify-center rounded-full bg-brand-100 ${text} font-bold text-brand-700`}>
      {(vendor.name || "V")[0].toUpperCase()}
    </span>
  );
}

function VendorCard({ v }) {
  const owner = v.owner && v.owner !== v.name ? v.owner : null;
  const cover = resolveImage(v.cover);
  return (
    <Link
      to={`/vendors/${v.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white transition duration-300 hover:border-brand-500/40 hover:shadow-[0_12px_32px_-12px_rgba(5,150,105,.35)]"
    >
      {/* banner: the vendor's latest product photo, or a soft pattern if they have none */}
      <div className="relative h-40 shrink-0 overflow-hidden bg-brand-50 md:h-44">
        {cover ? (
          <>
            <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-transparent" />
          </>
        ) : (
          <>
            <span className="absolute -right-10 -top-12 h-40 w-40 rounded-full border-[18px] border-brand-100/70" />
            <span className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-brand-100/60" />
          </>
        )}
        <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm">
          <BadgeCheck size={16} /> Approved
        </span>
      </div>

      {/* every card has the same rows, so the button always lines up at the bottom */}
      <div className="flex flex-1 flex-col px-7 pb-7 pt-7">
        <h2 className="line-clamp-1 text-2xl font-bold tracking-tight transition-colors group-hover:text-brand-700">{v.name}</h2>
        <p className="mt-1.5 min-h-[1.5rem] truncate text-base text-stone-500">{owner ? `Owned by ${owner}` : ""}</p>

        <div className="my-5 border-t border-stone-100" />

        <p className="line-clamp-2 min-h-[3.25rem] text-base leading-relaxed text-stone-600">
          {v.description || (v.categories || []).slice(0, 3).join(" · ") || "Visit this shop to see what they sell."}
        </p>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-3 text-base text-stone-500">
            <Package size={20} className="text-brand-600" />
            <span><span className="font-bold text-night">{v.listingCount}</span> {v.listingCount === 1 ? "product" : "products"} listed</span>
          </div>

          <span className="mt-6 flex items-center justify-between rounded-2xl bg-stone-900 px-7 py-5 text-base font-bold text-white transition group-hover:bg-black">
            Explore shop <ArrowRight size={20} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Vendors() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [state, setState] = useState("loading");
  const isVendor = user?.role === "vendor";

  useEffect(() => {
    let alive = true;
    fetch(`${API}/api/public/vendors`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { if (!alive) return; setVendors(Array.isArray(d) ? d : d.vendors || []); setState("ready"); })
      .catch(() => alive && setState("error"));
    return () => { alive = false; };
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* sell banner */}
        <div className="flex flex-col gap-6 rounded-3xl bg-brand-700 p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <h1 className="text-2xl font-extrabold md:text-3xl">Want to sell on Kartly?</h1>
            <p className="mt-2 text-sm text-white/85 md:text-base">
              Turn what you sell into a storefront. Apply in a couple of minutes, and our team reviews every application.
            </p>
          </div>
          <Link
            to={isVendor ? "/sell/new" : "/sell/apply"}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-brand-700 hover:bg-brand-50"
          >
            <Store size={18} /> {isVendor ? "Add a Listing" : "Start Selling"}
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold md:text-3xl">Our vendors</h2>
          <p className="mt-1 text-sm text-stone-500 md:text-base">Every vendor here was approved by our team.</p>
        </div>

        <div className="mt-6">
          {state === "loading" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-stone-100" />)}
            </div>
          ) : state === "error" ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 py-14 text-center">
              <p className="font-semibold text-rose-700">Could not load vendors.</p>
              <p className="mt-1 text-sm text-rose-600">Check that the API is running, then refresh.</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-14 text-center">
              <Store className="mx-auto h-10 w-10 text-stone-400" />
              <p className="mt-3 font-semibold">No vendors yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((v) => <VendorCard key={v.id} v={v} />)}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}