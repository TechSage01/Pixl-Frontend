import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home, Heart, Package, ShoppingCart, LayoutDashboard, Plus, Store, ClipboardCheck, UserCircle,
  Bell, MapPin, Settings, LogOut, Menu, X, ShoppingBag,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { BRAND } from "../brand";

const link = ({ isActive }) =>
  `flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
    isActive ? "bg-brand-50 text-brand-700" : "text-stone-600 hover:bg-stone-100"
  }`;

// Full-screen account area: fixed sidebar on the left, content scrolls on the right. No site header or footer.
export default function AccountLayout({ children }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const role = user?.role;
  const first = (user?.name || "Account").split(" ")[0];

  const buying = [
    ["/profile", "Overview", Home, true],
    ["/profile/saved", "Saved items", Heart],
    ["/orders", "Orders", Package],
    ["/cart", `Cart${count ? ` (${count})` : ""}`, ShoppingCart],
    ["/profile/notifications", "Notifications", Bell],
    ["/profile/addresses", "Addresses", MapPin],
    ["/profile/settings", "Settings", Settings],
  ];
  const selling = [
    ["/vendor", "Vendor Dashboard", LayoutDashboard, true],
    ["/sell/new", "Add listing", Plus],
  ];
  const admin = [["/admin/applications", "Vendor applications", ClipboardCheck]];

  const Item = ([to, label, Icon, end]) => (
    <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={link}>
      <Icon size={20} /> {label}
    </NavLink>
  );

  async function signOut() {
    try { await logout(); } finally { navigate("/"); }
  }

  const heading = "px-4 pb-1 pt-5 text-xs font-bold uppercase tracking-[0.2em] text-stone-400";

  const sidebar = (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-4 rounded-3xl bg-brand-50 p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white"><UserCircle size={26} /></span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">{BRAND.name}</p>
          <p className="truncate text-sm font-bold">{first}'s account</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {buying.map(Item)}
        {role === "vendor" && (<><p className={heading}>Selling</p>{selling.map(Item)}</>)}
        {role === "admin" && (<><p className={heading}>Admin</p>{admin.map(Item)}</>)}
      </nav>

      <div className="mt-auto rounded-3xl border border-stone-200 bg-stone-50 p-5">
        <p className="font-bold">Switch mode</p>
        {role === "vendor" ? (
          <>
            <p className="mt-1 text-sm text-stone-500">Manage your shop, or go back to shopping.</p>
            <Link to="/vendor" onClick={() => setOpen(false)} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-sm font-bold text-white hover:bg-black"><LayoutDashboard size={18} /> Vendor Dashboard</Link>
            <Link to="/products" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white py-3 text-sm font-bold hover:bg-stone-50"><ShoppingBag size={18} /> Shop products</Link>
          </>
        ) : role === "admin" ? (
          <>
            <p className="mt-1 text-sm text-stone-500">Review people who want to sell.</p>
            <Link to="/admin/applications" onClick={() => setOpen(false)} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-sm font-bold text-white hover:bg-black"><ClipboardCheck size={18} /> Applications</Link>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-stone-500">Create a vendor profile when you are ready to sell.</p>
            <Link to="/sell/apply" onClick={() => setOpen(false)} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-sm font-bold text-white hover:bg-black"><Store size={18} /> Open a shop</Link>
          </>
        )}
        <button onClick={signOut} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white py-3 text-sm font-bold hover:bg-stone-50">
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 text-night">
      {/* desktop sidebar */}
      <aside className="hidden w-[300px] shrink-0 border-r border-stone-200 bg-white lg:block">{sidebar}</aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
          <Link to="/"><Logo /></Link>
          <button onClick={() => setOpen(true)} aria-label="Menu" className="rounded-lg p-2"><Menu size={26} /></button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}