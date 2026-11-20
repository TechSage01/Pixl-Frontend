import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ImagePlus, MapPin, Search, X, CheckCircle2, Camera, Tag, Wallet } from "lucide-react";
import PageShell from "../components/PageShell";
import LocationPicker from "../components/LocationPicker";
import { CATEGORY_LABELS } from "../utils/categoryLabels";
import { BRAND } from "../brand";

const API = import.meta.env.VITE_API_URL;
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const input =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const label = "mb-1.5 block text-sm font-semibold text-gray-800";

export default function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "tech", pickupSpot: "" });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function addFiles(list) {
    setError("");
    const picked = Array.from(list);
    for (const f of picked) {
      if (!ALLOWED.includes(f.type)) return setError("Only JPG, PNG or WEBP images are allowed");
      if (f.size > MAX_SIZE) return setError("Each image must be 5MB or less");
    }
    const next = [...files, ...picked];
    if (next.length > MAX_FILES) return setError(`You can upload up to ${MAX_FILES} photos`);
    setFiles(next);
  }

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i));

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.title.trim().length < 3) return setError("Title must be at least 3 characters");
    if (form.description.trim().length < 10) return setError("Tell us more about your item (at least 10 characters)");
    const price = Number(form.price);
    if (!Number.isInteger(price) || price < 100) return setError("Enter a price of at least ₦100 (whole numbers only)");
    if (files.length === 0) return setError("Add at least one photo");

    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v));
    files.forEach((f) => body.append("images", f));

    setSubmitting(true);
    try {
      // no Content-Type header: the browser adds the multipart boundary itself
      const res = await fetch(`${API}/api/listings`, { method: "POST", credentials: "include", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create listing");
      setDone(data.listing || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function another() {
    setForm({ title: "", description: "", price: "", category: "tech", pickupSpot: "" });
    setFiles([]);
    setDone(null);
  }

  if (done) {
    const id = done.id || done._id;
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700"><CheckCircle2 size={34} /></span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Listing published</h1>
          <p className="mt-2 text-gray-600">Buyers can now find it on {BRAND.name}.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {id && <Link to={`/listing/${id}`} className="rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700">View listing</Link>}
            <button onClick={another} className="rounded-full border border-gray-300 px-7 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">Add another</button>
            <Link to="/vendor" className="rounded-full border border-gray-300 px-7 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">Dashboard</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const tips = [
    [Camera, "Clear photos sell faster", "Use good light and show the item from a few angles."],
    [Tag, "Price it honestly", "Whole naira amounts only, minimum ₦100."],
    [Wallet, "Be upfront about condition", "Say what is included and any flaws. It avoids disputes later."],
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-700">Vendor Dashboard</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Add a listing</h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">Buyers on {BRAND.name} will see this on the marketplace.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div className="rounded-[28px] bg-brand-600 p-8 text-white lg:sticky lg:top-24 lg:h-fit">
            <h2 className="text-2xl font-extrabold">Tips for a good listing</h2>
            <div className="mt-6 space-y-4">
              {tips.map(([Icon, t, d]) => (
                <div key={t} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                  <p className="flex items-center gap-3 font-bold"><Icon size={20} /> {t}</p>
                  <p className="mt-2 text-sm text-white/85">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <h3 className="text-xl font-bold text-gray-900">Item details</h3>
            <p className="mb-5 text-sm text-gray-500">What are you selling?</p>
            <div className="space-y-4">
              <div>
                <label className={label}>Title</label>
                <input name="title" value={form.title} onChange={set} maxLength={120} className={input} placeholder="iPhone 11 128GB" />
              </div>
              <div>
                <label className={label}>Description</label>
                <textarea name="description" value={form.description} onChange={set} rows={5} maxLength={2000} className={input} placeholder="Condition, what's included, anything buyers should know" />
                <p className="mt-1 text-xs text-gray-400">{form.description.length}/2000</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Price (₦)</label>
                  <input name="price" type="number" min="100" step="1" value={form.price} onChange={set} className={input} placeholder="185000" />
                </div>
                <div>
                  <label className={label}>Category</label>
                  <select name="category" value={form.category} onChange={set} className={input}>
                    {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <h3 className="mb-1 mt-10 text-xl font-bold text-gray-900">Photos <span className="text-sm font-medium text-gray-400">({files.length}/{MAX_FILES})</span></h3>
            <p className="mb-5 text-sm text-gray-500">JPG, PNG or WEBP, up to 5MB each.</p>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${dragging ? "border-brand-600 bg-brand-50" : "border-gray-300 bg-stone-50 hover:border-brand-500"} ${files.length >= MAX_FILES ? "pointer-events-none opacity-50" : ""}`}
            >
              <ImagePlus size={30} className="text-brand-600" />
              <span className="text-base font-bold text-gray-900">Drop photos here or click to browse</span>
              <span className="text-sm text-gray-500">The first photo is your cover image</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" disabled={files.length >= MAX_FILES}
                onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            </label>
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div key={src} className="relative">
                    <img src={src} alt="" className="aspect-square w-full rounded-xl object-cover" />
                    {i === 0 && <span className="absolute bottom-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">Cover</span>}
                    <button type="button" onClick={() => removeFile(i)} aria-label="Remove photo" className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 rounded-3xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><MapPin size={22} /></span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Pickup spot</h3>
                  <p className="text-sm text-gray-500">Where can buyers collect this item? (optional)</p>
                </div>
              </div>
              <button type="button" onClick={() => setPickerOpen(true)} className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-stone-50 p-4 text-left hover:border-brand-500">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm"><MapPin size={20} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-gray-900">{form.pickupSpot ? "Pickup spot" : "Find a pickup spot"}</span>
                  <span className="block truncate text-sm text-gray-500">{form.pickupSpot || "Search for a street, area, or landmark"}</span>
                </span>
                <Search size={20} className="shrink-0 text-gray-500" />
              </button>
              {form.pickupSpot && (
                <button type="button" onClick={() => setForm({ ...form, pickupSpot: "" })} className="mt-2 text-sm font-semibold text-gray-500 hover:text-red-600">Clear</button>
              )}
              <LocationPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(v) => setForm((f) => ({ ...f, pickupSpot: v.slice(0, 100) }))} />
            </div>

            {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => navigate("/vendor")} className="rounded-full border border-gray-300 px-7 py-3 text-base font-bold text-gray-800 hover:bg-gray-50">Cancel</button>
              <button disabled={submitting} className="flex flex-1 items-center justify-center rounded-full bg-brand-600 px-7 py-3 text-base font-bold text-white hover:bg-brand-700 disabled:opacity-50 sm:flex-none sm:px-12">
                {submitting ? "Uploading..." : "Publish listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}