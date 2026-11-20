import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import PageShell from "../components/PageShell";
import ListingCard from "../components/ListingCard";
import { VendorAvatar } from "./Vendors";
import { useAuth } from "../context/AuthContext";
import useFavorites from "../hooks/useFavorites";
import { rememberIntent } from "../utils/PostLogin";
import { resolveImage } from "../utils/images";

const API = import.meta.env.VITE_API_URL;

export default function VendorStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFav, toggle } = useFavorites();
  const [vendor, setVendor] = useState(null);
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | missing | error

  useEffect(() => {
    let alive = true;
    setState("loading");
    (async () => {
      try {
        const vr = await fetch(`${API}/api/public/vendors/${id}`);
        if (vr.status === 404) return alive && setState("missing");
        if (!vr.ok) throw new Error();
        const v = await vr.json();

        const lr = await fetch(`${API}/api/public/listings?seller=${id}&limit=48`);
        const ld = lr.ok ? await lr.json() : [];
        const raw = Array.isArray(ld) ? ld : ld.items || ld.listings || [];

        if (!alive) return;
        setVendor(v);
        setItems(raw.map((l) => ({
          ...l,
          id: l.id || l._id,
          img: resolveImage(l.images?.[0] || l.image || l.img),
          seller: v.name,
          note: l.description,
        })));
        setState("ready");
      } catch {
        if (alive) setState("error");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const needLogin = (message, next) => {
    rememberIntent(next);
    navigate("/login", { state: { message } });
  };
  const handleFav = (itemId) => {
    if (!user) return needLogin("Sign up to save the items you love.", { fav: itemId, next: `/vendors/${id}` });
    toggle(itemId);
  };
  const handleOpen = user ? undefined : (l) => needLogin("Sign up to view this item.", { next: `/listing/${l.id}` });

  if (state !== "ready") {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          {state === "loading" ? (
            <div className="mx-auto h-8 w-40 animate-pulse rounded bg-stone-100" />
          ) : (
            <>
              <h1 className="text-2xl font-bold">{state === "missing" ? "Store not found" : "Something went wrong"}</h1>
              <p className="mt-2 text-stone-500">{state === "missing" ? "This vendor may no longer be active." : "Check that the API is running, then refresh."}</p>
              <Link to="/vendors" className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">All vendors</Link>
            </>
          )}
        </div>
      </PageShell>
    );
  }

  const joined = vendor.joinedAt ? new Date(vendor.joinedAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" }) : null;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link to="/vendors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-brand-700">
          <ArrowLeft size={16} /> All vendors
        </Link>

        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:flex-row sm:items-center">
          <VendorAvatar vendor={vendor} size="h-20 w-20" text="text-3xl" />
          <div>
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            <p className="mt-1 text-sm text-stone-500">
              {vendor.listingCount} {vendor.listingCount === 1 ? "listing" : "listings"}
              {joined && <> · Joined {joined}</>}
              {" · Approved by our team"}
            </p>
            {vendor.description && <p className="mt-3 max-w-2xl text-stone-700">{vendor.description}</p>}
          </div>
        </div>

        <h2 className="mt-10 text-xl font-bold">Listings</h2>
        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-14 text-center">
            <Package className="mx-auto h-10 w-10 text-stone-400" />
            <p className="mt-3 font-semibold">No listings yet</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((l) => (
              <ListingCard key={l.id} listing={l} isFav={isFav(l.id)} onToggleFav={handleFav} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}