import { useEffect, useRef, useState } from "react";
import { MapPin, Search, X, ArrowRight, Loader2 } from "lucide-react";

// Places that show up instantly while typing. Add your own spots here.
const LOCAL_PLACES = [
  // Areas & Landmarks
  { title: "Under G", kind: "Area", full: "Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "LAUTECH", kind: "Campus", full: "LAUTECH, Ogbomoso, Oyo, Nigeria" },
  { title: "Takie", kind: "Area", full: "Takie, Ogbomoso, Oyo, Nigeria" },
  { title: "Orita Naira", kind: "Area", full: "Orita Naira, Ogbomoso, Oyo, Nigeria" },
  { title: "Adenike", kind: "Area", full: "Adenike, Ogbomoso, Oyo, Nigeria" },
  { title: "Soun Palace", kind: "Landmark", full: "Soun's Palace, Ogbomoso, Oyo, Nigeria" },
  { title: "Ogbomoso City Park", kind: "Park", full: "Ogbomoso City Park, Ogbomoso, Oyo, Nigeria" },
  { title: "Apake", kind: "Area", full: "Apake, Ogbomoso, Oyo, Nigeria" },
  { title: "Ijeru", kind: "Area", full: "Ijeru, Ogbomoso, Oyo, Nigeria" },
  { title: "General Area", kind: "Area", full: "General Area, Ogbomoso, Oyo, Nigeria" },

  // Popular Student Hostels around LAUTECH & Under G
  { title: "Excel Hostel", kind: "Hostel", full: "Excel Hostel, Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "Bam Okunlola Hostel", kind: "Hostel", full: "Bam Okunlola Hostel, Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "Esmeralda Hostel", kind: "Hostel", full: "Esmeralda Hostel, Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "BB Hostel", kind: "Hostel", full: "BB Hostel, Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "Ajarat Hostel", kind: "Hostel", full: "Ajarat Hostel, Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "Great Sharon Hostel", kind: "Hostel", full: "Great Sharon Hostel, Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "Success Camp Hostel", kind: "Hostel", full: "Success Camp Hostel, LAUTECH, Ogbomoso, Oyo, Nigeria" },
  { title: "Highlander Hostel", kind: "Hostel", full: "Highlander Hostel, Adenike, Ogbomoso, Oyo, Nigeria" },
  { title: "Savoy Hostel", kind: "Hostel", full: "Savoy Hostel, Under G, Ogbomoso, Oyo, Nigeria" },
  { title: "De Niche Resort Centre", kind: "Hostel", full: "De Niche Resort, Oke Afin GRA, Ogbomoso, Oyo, Nigeria" },

  // Hotels & Suites
  { title: "Bon Hotel Nest", kind: "Hotel", full: "Bon Hotel Nest, Ogbomoso, Oyo, Nigeria" },
  { title: "The Willows Nest Hotel", kind: "Hotel", full: "The Willows Nest Hotel, Ogbomoso, Oyo, Nigeria" },
  { title: "JF Royal Hotel & Suites", kind: "Hotel", full: "JF Royal Hotel & Suites, Ogbomoso, Oyo, Nigeria" },
  { title: "Ragaray Executive Suites", kind: "Hotel", full: "Ragaray Executive Suites, Ogbomoso, Oyo, Nigeria" },
  { title: "Pectoria Guesthouse", kind: "Hotel", full: "Pectoria Guesthouse, Abogunde Road, Ogbomoso, Oyo, Nigeria" },
  { title: "AA Luxury Suites", kind: "Hotel", full: "AA Luxury Suites, Ogbomoso, Oyo, Nigeria" },
  { title: "Imperial Heritage Hotel", kind: "Hotel", full: "Imperial Heritage Hotel, Ogbomoso, Oyo, Nigeria" },
  { title: "Gbemiro Ambassador Hotel", kind: "Hotel", full: "Gbemiro Ambassador Hotel and Suites, Ogbomoso, Oyo, Nigeria" },
  { title: "Tm Arena Hotel and Suites", kind: "Hotel", full: "Tm Arena Hotel and Suites, Ogbomoso, Oyo, Nigeria" }
];
export default function LocationPicker({ open, onClose, onSelect }) {
  const [q, setQ] = useState("");
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setRemote([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // live search on OpenStreetMap (free, no key). Debounced to be polite.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 3) {
      setRemote([]);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=ng&limit=6&q=${encodeURIComponent(term)}`;
        const res = await fetch(url, { signal: ctrl.signal });
        const data = await res.json();
        setRemote(
          data.map((p) => ({
            title: p.name || p.display_name.split(",")[0],
            full: p.display_name,
          }))
        );
      } catch (e) {
        if (e.name !== "AbortError") setRemote([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  if (!open) return null;

  const term = q.trim().toLowerCase();
  const local = term
    ? LOCAL_PLACES.filter((p) => p.title.toLowerCase().includes(term) || p.full.toLowerCase().includes(term))
    : [];
  const seen = new Set(local.map((p) => p.full));
  const results = [...local, ...remote.filter((p) => !seen.has(p.full))];

  const pick = (full) => {
    onSelect(full);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4 border-b border-gray-200 p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><MapPin size={22} /></span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Find your shop location</h2>
            <p className="text-sm text-gray-500">Search by street, area, or campus.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-900"><X size={22} /></button>
        </div>

        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-brand-500 px-4 py-3 ring-2 ring-brand-100">
            <Search size={20} className="text-gray-400" />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your street, area, or campus" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
            {loading && <Loader2 size={18} className="animate-spin text-gray-400" />}
            {q && !loading && (
              <button onClick={() => setQ("")} aria-label="Clear" className="text-gray-500 hover:text-gray-900"><X size={18} /></button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {results.map((p) => (
            <button key={p.full} onClick={() => pick(p.full)} className="flex w-full items-start gap-4 rounded-2xl border border-gray-200 p-4 text-left hover:border-brand-500 hover:bg-brand-50/40">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><MapPin size={18} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-gray-900">{p.title}</span>
                <span className="block truncate text-sm text-gray-500">{p.full}</span>
              </span>
              <ArrowRight size={18} className="mt-1 shrink-0 text-gray-400" />
            </button>
          ))}

          {!loading && term.length >= 3 && results.length === 0 && (
            <p className="text-center text-sm text-gray-500">No matches found.</p>
          )}

          {q.trim().length >= 5 && (
            <button onClick={() => pick(q.trim())} className="w-full rounded-2xl border border-dashed border-gray-300 p-4 text-left text-sm text-gray-600 hover:border-brand-500">
              Can't find it? Use <span className="font-bold text-gray-900">“{q.trim()}”</span> as my address
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 bg-stone-50 p-5">
          <button onClick={onClose} className="w-full rounded-2xl border border-gray-300 bg-white py-3 text-base font-bold text-gray-700 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
}