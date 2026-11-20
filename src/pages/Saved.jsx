import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import AccountLayout from "../components/AccountLayout";
import ListingCard from "../components/ListingCard";
import useFavorites from "../hooks/useFavorites";
import useListingActions from "../hooks/useListingActions";
import { resolveImage } from "../utils/images";

const API = import.meta.env.VITE_API_URL;

const toCard = (l) => ({
  ...l,
  id: l.id || l._id,
  img: resolveImage(l.image || l.images?.[0]),
  seller: typeof l.seller === "string" ? l.seller : l.seller?.name,
  note: l.description,
});

// Everything the user hearted. Items removed by the vendor are skipped.
export default function Saved() {
  const { ids, toggle } = useFavorites();
  const { onAddToCart, inCart } = useListingActions();
  const [byId, setById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const missing = ids.filter((id) => !byId[id]);
    if (missing.length === 0) { setLoading(false); return; }
    setLoading(true);
    Promise.all(
      missing.map((id) =>
        fetch(`${API}/api/public/listings/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((rows) => {
      if (!alive) return;
      const next = {};
      rows.forEach((r, i) => { next[missing[i]] = r ? toCard({ ...r, id: missing[i] }) : false; });
      setById((prev) => ({ ...prev, ...next }));
      setLoading(false);
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  // the heart on this page removes the item from the wishlist
  const items = ids.map((id) => byId[id]).filter(Boolean);

  return (
    <AccountLayout>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">Wishlist</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Saved items</h1>
      <p className="mt-1.5 text-sm text-stone-600">Products you tapped the heart on. {items.length > 0 && `${items.length} saved.`}</p>

      <div className="mt-8">
        {loading && items.length === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-[340px] animate-pulse rounded-2xl bg-stone-100" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-stone-400" />
            <p className="mt-3 text-base font-bold">Nothing saved yet</p>
            <p className="mt-1 text-sm text-stone-500">Tap the heart on any product and it will show up here.</p>
            <Link to="/products" className="mt-6 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700">Browse products</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((l) => (
              <ListingCard key={l.id} listing={l} isFav onToggleFav={() => toggle(l.id)} onAddToCart={onAddToCart} inCart={inCart} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}