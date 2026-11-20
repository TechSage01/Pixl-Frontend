import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Package, Search } from "lucide-react";
import PageShell from "../components/PageShell";
import ListingCard from "../components/ListingCard";
import useListingActions from "../hooks/useListingActions";
import { GROUPS } from "../utils/categoryGroups";
import { resolveImage } from "../utils/images";

const API = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 24;

const toCard = (l) => ({
  ...l,
  id: l.id || l._id,
  img: resolveImage(l.image || l.images?.[0]),
  note: l.description,
});

export default function Products() {
  const [params, setParams] = useSearchParams();
  const groupId = params.get("group") || "all";
  const q = params.get("q") || "";
  const group = GROUPS.find((g) => g.id === groupId) || GROUPS[0];

  const { isFav, onToggleFav, onOpen } = useListingActions();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [loadingMore, setLoadingMore] = useState(false);
  const [term, setTerm] = useState(q);

  // keep the small search box in sync when the header search changes the URL
  useEffect(() => { setTerm(q); }, [q]);

  // debounce typing in the on-page search box
  useEffect(() => {
    const t = setTimeout(() => {
      if (term.trim() !== q) {
        const next = new URLSearchParams(params);
        term.trim() ? next.set("q", term.trim()) : next.delete("q");
        setParams(next, { replace: true });
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const buildUrl = (p) => {
    const u = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(p) });
    if (group.cats) u.set("category", group.cats.join(","));
    if (q) u.set("search", q);
    return `${API}/api/public/listings?${u}`;
  };

  // first page whenever the filters change
  useEffect(() => {
    let alive = true;
    setState("loading");
    fetch(buildUrl(1))
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {
        if (!alive) return;
        setItems((d.items || []).map(toCard));
        setTotal(d.total || 0);
        setPage(1);
        setState("ready");
      })
      .catch(() => alive && setState("error"));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, q]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const r = await fetch(buildUrl(page + 1));
      const d = await r.json();
      setItems((prev) => [...prev, ...(d.items || []).map(toCard)]);
      setPage((p) => p + 1);
    } catch { /* keep what we have */ }
    setLoadingMore(false);
  };

  const pickGroup = (id) => {
    const next = new URLSearchParams(params);
    id === "all" ? next.delete("group") : next.set("group", id);
    setParams(next);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">All Products</h1>
        <p className="mt-1 text-sm text-stone-500 md:text-base">
          {state === "ready" ? `${total} ${total === 1 ? "product" : "products"}${q ? ` for “${q}”` : ""}` : "Everything available on Kartly."}
        </p>

        <div className="relative mt-5 max-w-md lg:hidden">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-full border border-stone-300 py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="-mx-4 mt-6 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => pickGroup(g.id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${groupId === g.id ? "border-brand-600 bg-brand-600 text-white" : "border-stone-200 bg-white text-night hover:border-brand-500"}`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {state === "loading" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} className="h-[340px] animate-pulse rounded-2xl bg-stone-100" />)}
            </div>
          ) : state === "error" ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 py-14 text-center">
              <p className="font-semibold text-rose-700">Could not load products.</p>
              <p className="mt-1 text-sm text-rose-600">Check that the API is running, then refresh.</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-14 text-center">
              <Package className="mx-auto h-10 w-10 text-stone-400" />
              <p className="mt-3 font-semibold">No products found</p>
              <button onClick={() => setParams({})} className="mt-2 text-sm font-semibold text-brand-700 underline">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((l) => (
                  <ListingCard key={l.id} listing={l} isFav={isFav(l.id)} onToggleFav={onToggleFav} onOpen={onOpen} />
                ))}
              </div>
              {items.length < total && (
                <div className="mt-10 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-lg border border-stone-300 px-8 py-3 text-sm font-semibold hover:border-brand-500 disabled:opacity-60"
                  >
                    {loadingMore ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}