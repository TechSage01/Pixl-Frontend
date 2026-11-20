import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Package, Plus, Tag, Trash2, Store } from "lucide-react";
import AccountLayout from "../components/AccountLayout";
import { useAuth } from "../context/AuthContext";
import { categoryLabel } from "../utils/categoryLabels";
import { resolveImage } from "../utils/images";

const API = import.meta.env.VITE_API_URL;
const naira = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");
const BADGE = {
  active: "bg-brand-50 text-brand-700",
  sold: "bg-stone-200 text-stone-700",
  hidden: "bg-amber-50 text-amber-700",
};

export default function VendorDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/vendor/listings`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items || []);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    setBusy(id); setError("");
    try {
      const res = await fetch(`${API}/api/vendor/listings/${id}/status`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not update");
      await load();
    } catch (e) { setError(e.message); }
    setBusy("");
  }

  async function remove(id) {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setBusy(id); setError("");
    try {
      const res = await fetch(`${API}/api/vendor/listings/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not delete");
      await load();
    } catch (e) { setError(e.message); }
    setBusy("");
  }

  const count = (s) => items.filter((i) => i.status === s).length;

  return (
    <AccountLayout>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">Vendor Dashboard</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Hi {(user?.name || "").split(" ")[0] || "there"}</h1>
            <p className="mt-1 text-stone-500">Manage the products in your shop.</p>
          </div>
          <div className="flex gap-3">
            {(user?.id || user?._id) && <Link to={`/vendors/${user.id || user._id}`} className="flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-bold hover:bg-stone-50"><Store size={16} /> View my shop</Link>}
            <Link to="/sell/new" className="flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700"><Plus size={18} /> Add listing</Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[["Live", count("active")], ["Hidden", count("hidden")], ["Sold", count("sold")]].map(([l, n]) => (
            <div key={l} className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm text-stone-500">{l}</p>
              <p className="mt-1 text-2xl font-extrabold">{n}</p>
            </div>
          ))}
        </div>

        {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <div className="mt-8">
          {state === "loading" ? (
            <p className="text-sm text-stone-500">Loading your listings...</p>
          ) : state === "error" ? (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">Could not load your listings. Check that the API is running and the vendor route is added.</p>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-14 text-center">
              <Package className="mx-auto h-10 w-10 text-stone-400" />
              <p className="mt-3 text-base font-bold">No listings yet</p>
              <p className="mt-1 text-sm text-stone-500">Add your first product so buyers can find it.</p>
              <Link to="/sell/new" className="mt-5 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700">Add your first listing</Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((l) => (
                <li key={l.id} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-3 sm:p-4">
                  <Link to={`/listing/${l.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {resolveImage(l.image) ? <img src={resolveImage(l.image)} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-2xl font-bold text-brand-700">{l.title?.[0]}</span>}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/listing/${l.id}`} className="line-clamp-1 font-semibold hover:text-brand-700">{l.title}</Link>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-500"><Tag size={13} /> {categoryLabel(l.category)}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="font-bold">{naira(l.price)}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${BADGE[l.status] || BADGE.active}`}>{l.status}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {busy === l.id ? <Loader2 size={18} className="animate-spin text-stone-400" /> : (
                      <>
                        {l.status !== "sold" && (
                          <button onClick={() => setStatus(l.id, l.status === "hidden" ? "active" : "hidden")} aria-label={l.status === "hidden" ? "Show listing" : "Hide listing"} title={l.status === "hidden" ? "Show" : "Hide"} className="rounded-full p-2 text-stone-500 hover:bg-stone-100">
                            {l.status === "hidden" ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        )}
                        <button onClick={() => setStatus(l.id, l.status === "sold" ? "active" : "sold")} className="rounded-full px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-100">
                          {l.status === "sold" ? "Relist" : "Mark sold"}
                        </button>
                        <button onClick={() => remove(l.id)} aria-label="Delete" className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}