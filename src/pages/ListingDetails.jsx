import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, ShieldCheck, Store } from "lucide-react";
import PageShell from "../components/PageShell";
import { BRAND } from "../brand";
import { useAuth } from "../context/AuthContext";
import useFavorites from "../hooks/useFavorites";
import { rememberIntent } from "../utils/PostLogin";
import { resolveImage, naira } from "../utils/images";
import { categoryLabel } from "../utils/categoryLabels";

const API = import.meta.env.VITE_API_URL;

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFav, toggle } = useFavorites();
  const [item, setItem] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | missing | error
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    setState("loading");
    setActive(0);
    fetch(`${API}/api/public/listings/${id}`)
      .then(async (r) => {
        if (r.status === 404) return alive && setState("missing");
        if (!r.ok) throw new Error("bad status");
        const data = await r.json();
        if (!alive) return;
        setItem(data);
        setState("ready");
      })
      .catch(() => alive && setState("error"));
    return () => { alive = false; };
  }, [id]);

  const needLogin = (message, next) => {
    rememberIntent({ next });
    navigate("/login", { state: { message } });
  };

  if (state === "loading") {
    return (
      <PageShell>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-stone-100" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-stone-100" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-stone-100" />
            <div className="h-32 animate-pulse rounded bg-stone-100" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (state !== "ready") {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">{state === "missing" ? "Listing not found" : "Something went wrong"}</h1>
          <p className="mt-2 text-stone-500">
            {state === "missing" ? "It may have been removed by the vendor." : "Check that the API is running, then refresh."}
          </p>
          <Link to="/" className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Back to marketplace</Link>
        </div>
      </PageShell>
    );
  }

  const images = (item.images || []).map(resolveImage).filter(Boolean);
  const saved = isFav(item.id);
  const here = `/listing/${item.id}`;

  const onHeart = () => {
    if (!user) return needLogin("Sign up to save the items you love.", here);
    toggle(item.id);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-brand-700">
          <ArrowLeft size={16} /> Back to marketplace
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {/* gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
              {images[active] ? (
                <img src={images[active]} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-bold text-brand-700">{item.title?.[0]}</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActive(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${i === active ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">{categoryLabel(item.category)}</span>
                <h1 className="mt-1 text-2xl font-bold leading-snug md:text-3xl">{item.title}</h1>
              </div>
              <button
                onClick={onHeart}
                aria-label={saved ? "Remove from saved" : "Save item"}
                aria-pressed={saved}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-50"
              >
                <Heart size={22} className={saved ? "fill-rose-500 text-rose-500" : "text-stone-700"} />
              </button>
            </div>

            <p className="mt-4 text-3xl font-extrabold">{naira(item.price)}</p>
            {item.isDemo && (
              <p className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Demo listing</p>
            )}

            {item.seller && (
              <Link
                to={`/vendors/${item.seller.id}`}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-stone-200 p-4 transition hover:border-brand-500"
              >
                {item.seller.avatar ? (
                  <img src={item.seller.avatar} alt="" referrerPolicy="no-referrer" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                    {(item.seller.name || "V")[0].toUpperCase()}
                  </span>
                )}
                <span className="flex-1">
                  <span className="block text-xs text-stone-500">Sold by</span>
                  <span className="block font-semibold">{item.seller.name}</span>
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-brand-700"><Store size={16} /> Visit store</span>
              </Link>
            )}

            {item.pickupSpot && (
              <p className="mt-5 flex items-center gap-2 text-sm text-stone-600"><MapPin size={16} /> Pickup / delivery area: {item.pickupSpot}</p>
            )}

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Description</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-stone-700">{item.description}</p>
            </div>

            {/* buy */}
            <div className="mt-8 space-y-3">
              {user ? (
                <button disabled className="w-full cursor-not-allowed rounded-lg bg-stone-200 py-3.5 font-semibold text-stone-500">
                  Buy with escrow (coming soon)
                </button>
              ) : (
                <button
                  onClick={() => needLogin("Sign up to buy this item.", here)}
                  className="w-full rounded-lg bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700"
                >
                  Sign up to buy
                </button>
              )}
              <p className="flex items-start gap-2 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
                <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                When checkout opens, your payment will be held in escrow and released to the vendor only after you confirm delivery.{!BRAND.paymentsLive && " Payments run in sandbox mode."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}