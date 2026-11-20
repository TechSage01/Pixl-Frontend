import { useState } from "react";
import { MapPin, Plus, Trash2, Search } from "lucide-react";
import AccountLayout from "../components/AccountLayout";
import LocationPicker from "../components/LocationPicker";

const KEY = "kartly:addresses";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const input = "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

// Saved delivery addresses. For now they are kept in this browser only.
export default function Addresses() {
  const [list, setList] = useState(read);
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState(false);
  const [form, setForm] = useState({ label: "", address: "", phone: "" });
  const [error, setError] = useState("");

  const save = (next) => {
    setList(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  function add(e) {
    e.preventDefault();
    if (!form.label.trim() || form.address.trim().length < 5) return setError("Add a label and choose an address.");
    save([...list, { id: Date.now().toString(36), ...form }]);
    setForm({ label: "", address: "", phone: "" });
    setError("");
    setAdding(false);
  }

  return (
    <AccountLayout>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">Delivery</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Addresses</h1>
          <p className="mt-1.5 text-sm text-stone-600">Places where you want orders delivered or collected.</p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"><Plus size={18} /> Add address</button>
        )}
      </div>

      {adding && (
        <form onSubmit={add} className="mt-8 space-y-4 rounded-3xl border border-stone-200 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Label</label>
              <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} maxLength={30} placeholder="Home, Hostel, Office" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Phone (optional)</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="08012345678" className={input} />
            </div>
          </div>
          <button type="button" onClick={() => setPick(true)} className="flex w-full items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left hover:border-brand-500">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm"><MapPin size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{form.address ? "Address" : "Find your address"}</span>
              <span className="block truncate text-sm text-stone-500">{form.address || "Search for your street, area, or landmark"}</span>
            </span>
            <Search size={20} className="text-stone-500" />
          </button>
          <LocationPicker open={pick} onClose={() => setPick(false)} onSelect={(v) => setForm((f) => ({ ...f, address: v.slice(0, 200) }))} />
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => { setAdding(false); setError(""); }} className="rounded-full border border-stone-300 px-6 py-3 text-sm font-bold hover:bg-stone-50">Cancel</button>
            <button className="rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white hover:bg-brand-700">Save address</button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {list.length === 0 && !adding && (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <MapPin className="mx-auto h-10 w-10 text-stone-400" />
            <p className="mt-3 text-base font-bold">No saved addresses</p>
            <p className="mt-1 text-sm text-stone-500">Add one to speed up checkout later.</p>
          </div>
        )}
        {list.map((a) => (
          <div key={a.id} className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><MapPin size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{a.label}</p>
              <p className="text-sm text-stone-600">{a.address}</p>
              {a.phone && <p className="mt-1 text-sm text-stone-500">{a.phone}</p>}
            </div>
            <button onClick={() => save(list.filter((x) => x.id !== a.id))} aria-label="Delete address" className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </AccountLayout>
  );
}