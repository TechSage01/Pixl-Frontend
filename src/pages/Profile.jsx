import { Link } from "react-router-dom";
import { Mail, CalendarDays, Heart, Package, ShoppingCart, ShieldCheck, ShoppingBag, User, UserCircle, Settings, MapPin, ArrowUpRight, ChevronRight } from "lucide-react";
import AccountLayout from "../components/AccountLayout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import useFavorites from "../hooks/useFavorites";

const ROLE_LABEL = { buyer: "Buyer", vendor: "Vendor", admin: "Admin" };
const eyebrow = "text-xs font-bold uppercase tracking-[0.25em] text-brand-700";

const firstAddress = () => {
  try { return (JSON.parse(localStorage.getItem("kartly:addresses")) || [])[0] || null; } catch { return null; }
};

export default function Profile() {
  const { user } = useAuth();
  const { count } = useCart();
  const { ids } = useFavorites();
  const address = firstAddress();

  const name = user?.name || "there";
  const first = name.split(" ")[0];
  const sinceDate = user?.createdAt ? new Date(user.createdAt) : null;
  const sinceShort = sinceDate?.toLocaleDateString("en-NG", { month: "short", year: "numeric" });
  const sinceLong = sinceDate?.toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" });

  const stats = [
    ["Orders", 0, "Recent purchases", Package, "/orders"],
    ["Saved items", ids.length, "Products on your wishlist", Heart, "/profile/saved"],
    ["In your cart", count, "Items ready to buy", ShoppingCart, "/cart"],
  ];

  return (
    <AccountLayout>
      <p className={eyebrow}>My account</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome back, {first}</h1>
          <p className="mt-1.5 max-w-xl text-sm text-stone-600">Manage your account, track your purchases, and keep your Kartly shopping organized.</p>
        </div>
        <Link to="/products" className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          <ShoppingBag size={16} /> Continue shopping
        </Link>
      </div>

      {/* profile card + stats */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white">
        <div className="bg-gradient-to-br from-stone-950 to-brand-700/80 p-5 text-white sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {user?.avatar ? (
                <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600"><User size={30} /></span>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-extrabold sm:text-2xl">{name}</h2>
                  <span className="flex items-center gap-1.5 rounded-full border border-brand-500/60 bg-brand-600/30 px-2.5 py-0.5 text-xs font-bold text-brand-100">
                    <ShieldCheck size={13} /> {ROLE_LABEL[user?.role] || "Account"}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80 sm:text-sm">
                  <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email}</span>
                  {sinceShort && <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Member since {sinceShort}</span>}
                </div>
              </div>
            </div>
            <Link to="/profile/settings" className="flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-bold hover:bg-white/10">
              <Settings size={16} /> Settings
            </Link>
          </div>
        </div>

        <div className="grid divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map(([label, n, sub, Icon, to]) => (
            <Link key={label} to={to} className="group p-5 hover:bg-stone-50">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500"><Icon size={14} /> {label}</p>
              <p className="mt-1.5 text-2xl font-extrabold">{n}</p>
              <p className="mt-0.5 text-xs text-stone-500 group-hover:text-brand-700">{sub}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {/* recent orders */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={eyebrow}>Shopping activity</p>
                <h3 className="mt-1 text-xl font-extrabold">Recent orders</h3>
                <p className="mt-1 text-sm text-stone-500">Keep track of your latest purchases on Kartly.</p>
              </div>
              <Link to="/orders" className="flex shrink-0 items-center gap-1 text-sm font-bold text-brand-700 hover:underline">View all orders <ChevronRight size={16} /></Link>
            </div>
            <div className="mt-5 rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-4 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-stone-500 shadow-sm"><ShoppingBag size={22} /></span>
              <p className="mt-3 font-bold">No orders yet</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-stone-500">Your purchases will appear here once you place your first order.</p>
              <Link to="/products" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Start shopping <ArrowUpRight size={16} /></Link>
            </div>
          </section>

          {/* delivery */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={eyebrow}>Delivery</p>
                <h3 className="mt-1 text-xl font-extrabold">Default address</h3>
              </div>
              <MapPin size={20} className="text-brand-600" />
            </div>
            {address ? (
              <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                <p className="font-bold">{address.label}</p>
                <p className="mt-0.5 text-sm text-stone-600">{address.address}</p>
                {address.phone && <p className="mt-1 text-sm text-stone-500">{address.phone}</p>}
              </div>
            ) : (
              <p className="mt-3 text-sm text-stone-500">You have not saved an address yet.</p>
            )}
            <Link to="/profile/addresses" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:underline">
              {address ? "Manage addresses" : "Add an address"} <ChevronRight size={16} />
            </Link>
          </section>
        </div>

        <div className="space-y-5">
          {/* account details */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><UserCircle size={22} /></span>
              <div>
                <p className={eyebrow}>Account</p>
                <h3 className="text-lg font-extrabold">Account details</h3>
              </div>
            </div>
            <dl className="mt-5 divide-y divide-stone-100 text-sm">
              <div className="pb-3"><dt className="text-stone-500">Full name</dt><dd className="mt-0.5 font-bold">{name}</dd></div>
              <div className="py-3"><dt className="text-stone-500">Email address</dt><dd className="mt-0.5 break-all font-bold">{user?.email}</dd></div>
              {sinceLong && <div className="pt-3"><dt className="text-stone-500">Member since</dt><dd className="mt-0.5 font-bold">{sinceLong}</dd></div>}
            </dl>
            <Link to="/profile/settings" className="mt-5 flex items-center justify-center gap-2 rounded-full border border-stone-300 py-2.5 text-sm font-bold hover:bg-stone-50">
              <Settings size={16} /> Manage account
            </Link>
          </section>

          {/* wishlist */}
          <section className="rounded-3xl bg-gradient-to-br from-stone-950 to-stone-900 p-6 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400"><Heart size={22} /></span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-brand-400">Your wishlist</p>
            <p className="mt-1 text-3xl font-extrabold">{ids.length}</p>
            <p className="mt-1 text-sm text-white/70">{ids.length === 1 ? "saved item" : "saved items"} waiting for you.</p>
            <Link to="/profile/saved" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-400 hover:underline">View saved items <ChevronRight size={16} /></Link>
          </section>
        </div>
      </div>
    </AccountLayout>
  );
}