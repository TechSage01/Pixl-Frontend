import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Menu, X, ShoppingCart, ChevronDown, User, Package, Heart, Store, LayoutDashboard, ClipboardCheck, LogOut } from "lucide-react";
import { BRAND } from "../brand";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { rememberIntent } from "../utils/postLogin";
import Logo from "./Logo";

// Shared header.
//  overlay = true  -> transparent and fixed on top of a hero image, turns white after you scroll past it
//  overlay = false -> always a white sticky bar
export default function Header({ overlay = false }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [scrolled, setScrolled] = useState(!overlay);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState(params.get("q") || "");
  const [acct, setAcct] = useState(false);
  const acctRef = useRef(null);

  // close the account menu when you click anywhere else
  useEffect(() => {
    const away = (e) => { if (acctRef.current && !acctRef.current.contains(e.target)) setAcct(false); };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);

  useEffect(() => {
    if (!overlay) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const { count } = useCart();
  const role = user?.role;
  const sellLink = role === "vendor" ? "/vendor" : role === "admin" ? "/admin/applications" : "/sell/apply";
  const sellLabel = role === "vendor" ? "Vendor Dashboard" : role === "admin" ? "Admin" : `Sell on ${BRAND.name}`;
  const badge = count > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">{count}</span>
  );

  const submitSearch = (e) => {
    e.preventDefault();
    setMenu(false);
    navigate(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
  };
  const openCart = () => {
    setMenu(false);
    if (!user) {
      rememberIntent({ next: "/cart" });
      return navigate("/login", { state: { message: "Sign up to start shopping with your cart." } });
    }
    navigate("/cart");
  };

  const solid = scrolled || menu;
  const bar = solid
    ? "bg-white/95 text-night shadow-[0_1px_0_rgba(0,0,0,.06)] backdrop-blur"
    : "bg-transparent text-white";
  const hover = solid ? "hover:text-brand-600" : "hover:text-brand-500";
  const field = solid
    ? "border-stone-200 bg-stone-50 text-night placeholder:text-stone-500"
    : "border-white/25 bg-white/10 text-white placeholder:text-white/70";

  return (
    <header className={`${overlay ? "fixed inset-x-0" : "sticky"} top-0 z-50 transition-colors duration-300 ${bar}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/" className="shrink-0"><Logo /></Link>

        {/* 550px when there is room; shrinks on smaller laptops instead of overflowing */}
        <form onSubmit={submitSearch} className="relative ml-2 hidden w-[550px] min-w-0 shrink lg:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, food, fashion & more"
            className={`w-full rounded-full border py-2.5 pl-11 pr-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${field}`}
          />
        </form>

        <nav className="ml-auto hidden shrink-0 items-center gap-6 text-[15px] font-semibold md:flex xl:gap-9">
          <Link to="/products" className={hover}>Shop</Link>
          <Link to="/vendors" className={hover}>Vendors</Link>
          <Link to={sellLink} className={`${solid ? "text-brand-600" : "text-brand-500"} hover:opacity-80`}>{sellLabel}</Link>
          <button onClick={openCart} aria-label="Cart" className={`relative ${hover}`}><ShoppingCart size={22} />{badge}</button>
          {loading ? null : user ? (
            <div ref={acctRef} className="relative">
              <button
                onClick={() => setAcct(!acct)}
                aria-expanded={acct}
                className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 ${solid ? "border-stone-200 bg-white" : "border-white/30 bg-white/10"}`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </span>
                )}
                <span className="max-w-[110px] truncate text-sm">{(user.name || "Account").split(" ")[0]}</span>
                <ChevronDown size={16} className={`transition ${acct ? "rotate-180" : ""}`} />
              </button>

              {acct && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-80 rounded-3xl border border-stone-200 bg-white p-2 text-night shadow-2xl">
                  <div className="flex items-center gap-3 p-4">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-700">
                        {(user.name || user.email || "U")[0].toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-bold">{user.name}</p>
                      <p className="truncate text-sm font-normal text-stone-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="mx-4 mb-3 inline-block rounded-full border border-stone-200 px-3 py-1 text-xs font-bold capitalize">{user.role}</span>
                  <div className="border-t border-stone-100 pt-2 text-[15px] font-medium">
                    {[
                      ["/profile", "My profile", User],
                      ["/profile/saved", "Saved items", Heart],
                      ["/orders", "My orders", Package],
                      ...(role === "vendor" ? [["/vendor", "Vendor Dashboard", LayoutDashboard]] : []),
                      ...(role === "admin" ? [["/admin/applications", "Vendor applications", ClipboardCheck]] : []),
                      ...(role === "buyer" ? [["/sell/apply", `Sell on ${BRAND.name}`, Store]] : []),
                    ].map(([to, text, Icon]) => (
                      <Link key={to} to={to} onClick={() => setAcct(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-stone-700 hover:bg-stone-50">
                        <Icon size={20} className="text-stone-500" /> {text}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-1 border-t border-stone-100 pt-2">
                    <button onClick={() => { setAcct(false); logout(); }} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-medium text-stone-700 hover:bg-stone-50">
                      <LogOut size={20} className="text-stone-500" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={hover}>Log in</Link>
              <Link to="/signup" className="rounded-full bg-brand-600 px-6 py-2.5 text-white hover:bg-brand-700">Sign up</Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <button onClick={openCart} aria-label="Cart" className="relative rounded-lg p-2"><ShoppingCart size={24} />{badge}</button>
          <button onClick={() => setMenu(!menu)} className="rounded-lg p-2" aria-label="Menu">
            {menu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {menu && (
        <div className="flex flex-col gap-1 border-t border-stone-200 px-6 pb-4 pt-3 text-base font-semibold md:hidden">
          <form onSubmit={submitSearch} className="relative mb-2">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm text-night focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </form>
          <Link to="/products" onClick={() => setMenu(false)} className="py-2.5">Shop</Link>
          <Link to="/vendors" onClick={() => setMenu(false)} className="py-2.5">Vendors</Link>
          <Link to={sellLink} onClick={() => setMenu(false)} className="py-2.5 text-brand-600">{sellLabel}</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenu(false)} className="py-2.5">My profile</Link>
              <Link to="/profile/saved" onClick={() => setMenu(false)} className="py-2.5">Saved items</Link>
              <Link to="/orders" onClick={() => setMenu(false)} className="py-2.5">My orders</Link>
              <button onClick={() => { setMenu(false); logout(); }} className="py-2.5 text-left">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenu(false)} className="py-2.5">Log in</Link>
              <Link to="/signup" onClick={() => setMenu(false)} className="mt-1 rounded-full bg-brand-600 py-3 text-center text-white">Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}