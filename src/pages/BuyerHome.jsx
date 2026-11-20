import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search, Store, ClipboardCheck, LayoutDashboard, Compass, ShoppingBag, ShoppingCart, ShieldCheck, User,
  Package, LogOut, ArrowRight, Sparkles,
} from "lucide-react";
import Logo from "../components/Logo";
import ListingCard from "../components/ListingCard";
import useListingActions from "../hooks/useListingActions";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { GROUPS } from "../utils/categoryGroups";
import { resolveImage } from "../utils/images";
import { BRAND } from "../brand";

const API = import.meta.env.VITE_API_URL;

const toCard = (l) => ({
  ...l,
  id: l.id || l._id,
  img: resolveImage(l.image || l.images?.[0]),
  note: l.description,
});

export default function BuyerHomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isFav, onToggleFav, onOpen, onAddToCart, inCart } = useListingActions();
  const { count } = useCart();

  const [groupId, setGroupId] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [showConfirm, setShowConfirm] = useState(false);

  const group = GROUPS.find((g) => g.id === groupId) || GROUPS[0];
  const firstName = (user?.name || "").split(" ")[0] || "there";
  const role = user?.role;

  // wait a moment after typing before searching
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const ctrl = new AbortController();
    const p = new URLSearchParams({ limit: "12", page: "1" });
    if (group.cats) p.set("category", group.cats.join(","));
    if (query) p.set("search", query);
    setState("loading");
    fetch(`${API}/api/public/listings?${p}`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setItems((d.items || []).map(toCard)); setState("ready"); })
      .catch((e) => { if (e.name !== "AbortError") setState("error"); });
    return () => ctrl.abort();
  }, [groupId, query]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  const navItem = ({ isActive }) =>
    `flex flex-col items-center gap-1 rounded-2xl px-5 py-2 text-xs font-semibold transition ${
      isActive ? "bg-brand-600 text-white" : "text-stone-500 hover:bg-stone-100"
    }`;

  // the main action in the banner depends on the account type
  const action =
    role === "admin" ? { to: "/admin/applications", label: "Review applications", Icon: ClipboardCheck }
    : role === "vendor" ? { to: "/vendor", label: "Vendor Dashboard", Icon: LayoutDashboard }
    : { to: "/sell/apply", label: "Become a vendor", Icon: Store };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 text-night">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link to="/" className="shrink-0 text-night"><Logo /></Link>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, food, fashion & more"
              className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/vendors" className="hidden px-2 text-sm font-semibold text-stone-700 hover:text-brand-700 sm:block">Vendors</Link>
            <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 text-stone-700 hover:bg-stone-100">
              <ShoppingCart size={22} />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">{count}</span>}
            </Link>
            <Link to={action.to} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">
              <action.Icon size={16} /> <span className="hidden sm:inline">{action.label}</span><span className="sm:hidden">{role === "vendor" ? "Dashboard" : role === "admin" ? "Review" : "Sell"}</span>
            </Link>

            <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold uppercase text-white">{firstName[0]}</span>
              )}
              <div className="hidden text-left md:block">
                <p className="text-sm font-bold leading-none">{firstName}</p>
                <p className="mt-0.5 text-xs capitalize text-stone-400">{role}</p>
              </div>
              <button onClick={() => setShowConfirm(true)} aria-label="Log out" className="rounded-full p-2 text-stone-500 hover:bg-red-50 hover:text-red-600">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 pt-6 md:px-8">
        {/* mobile search */}
        <div className="relative md:hidden">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-600"
          />
        </div>

        {/* welcome banner */}
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 p-6 text-white sm:p-8">
          <ShoppingBag className="pointer-events-none absolute -right-8 -top-4 h-56 w-56 text-white/10" strokeWidth={1.2} />
          <div className="relative">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome back, {firstName} 👋</h1>
            <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
              Browse what vendors are selling on {BRAND.name}. Save the items you like and come back to them.
            </p>
            <Link to="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-700 hover:bg-white/90">
              Shop all products <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* categories */}
        <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroupId(g.id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${groupId === g.id ? "border-brand-600 bg-brand-600 text-white" : "border-stone-200 bg-white text-night hover:border-brand-500"}`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* listings */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold md:text-xl">
              <Sparkles size={18} className="text-amber-500" />
              {query ? `Results for “${query}”` : `Latest on ${BRAND.name}`}
            </h2>
            <Link to={query ? `/products?q=${encodeURIComponent(query)}` : group.cats ? `/products?group=${group.id}` : "/products"} className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              See all <ArrowRight size={16} />
            </Link>
          </div>

          {state === "loading" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-[340px] animate-pulse rounded-2xl bg-stone-100" />)}
            </div>
          ) : state === "error" ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50 py-12 text-center">
              <p className="font-semibold text-rose-700">Could not load products.</p>
              <p className="mt-1 text-sm text-rose-600">Check that the API is running, then refresh.</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-white py-12 text-center">
              <Package className="mx-auto h-10 w-10 text-stone-400" />
              <p className="mt-3 font-semibold">No products match yet</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((l) => (
                <ListingCard key={l.id} listing={l} isFav={isFav(l.id)} onToggleFav={onToggleFav} onOpen={onOpen} onAddToCart={onAddToCart} inCart={inCart} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-stone-200 bg-white px-4 py-2">
        <div className="flex w-full max-w-md items-center justify-between">
          <NavLink to="/" end className={navItem}><Compass size={20} /><span>Home</span></NavLink>
          <NavLink to="/products" className={navItem}><ShoppingBag size={20} /><span>Shop</span></NavLink>
          <NavLink to="/orders" className={navItem}><ShieldCheck size={20} /><span>Escrow</span></NavLink>
          <NavLink to="/profile" className={navItem}><User size={20} /><span>Profile</span></NavLink>
        </div>
      </nav>

      {/* logout confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowConfirm(false)}>
          <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Log out?</h3>
            <p className="text-sm text-stone-500">Are you sure you want to log out of your {BRAND.name} account?</p>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setShowConfirm(false)} className="rounded-full border border-stone-300 px-5 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50">Cancel</button>
              <button onClick={handleLogout} className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700">Yes, log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}