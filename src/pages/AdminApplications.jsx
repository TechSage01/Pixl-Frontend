import { useEffect, useState, useCallback } from "react";
import { Check, X, Loader2, MapPin, Phone, Mail, Store } from "lucide-react";
import PageShell from "../components/PageShell";
import { CATEGORY_LABELS } from "../utils/categoryLabels";

const API = import.meta.env.VITE_API_URL;
const TABS = [["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"]];

function Card({ app, onDone }) {
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function act(kind) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/vendors/applications/${app._id}/${kind}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const label = CATEGORY_LABELS?.[app.category] || app.category;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Store size={20} /></span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-gray-900">{app.businessName}</h3>
          <p className="text-sm text-gray-500">{label} · applied {new Date(app.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-700">{app.whatYouSell}</p>

      <div className="mt-4 space-y-1.5 text-sm text-gray-600">
        <p className="flex items-center gap-2"><Mail size={15} className="shrink-0" /> {app.user?.name || "Unnamed"} · {app.user?.email}</p>
        <p className="flex items-center gap-2"><Phone size={15} className="shrink-0" /> {app.phone}</p>
        <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> <span>{app.businessAddress}{app.pickupSpot ? ` (pickup: ${app.pickupSpot})` : ""}</span></p>
      </div>

      {app.status !== "pending" && app.reviewNote && (
        <p className="mt-4 rounded-lg bg-stone-50 p-3 text-sm text-gray-600">Note: {app.reviewNote}</p>
      )}

      {app.status === "pending" && (
        <div className="mt-5">
          {rejecting ? (
            <div className="space-y-2">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={300} placeholder="Reason (the applicant will see this)" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600" />
              <div className="flex gap-2">
                <button disabled={busy} onClick={() => act("reject")} className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50">
                  {busy ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />} Confirm reject
                </button>
                <button onClick={() => { setRejecting(false); setNote(""); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button disabled={busy} onClick={() => act("approve")} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50">
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Approve
              </button>
              <button disabled={busy} onClick={() => setRejecting(true)} className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">Reject</button>
            </div>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default function AdminApplications() {
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/vendors/applications?status=${tab}`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load applications");
      setItems(data.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Vendor applications</h1>
        <p className="mt-1 text-gray-600">Review people who want to sell on Kartly.</p>

        <div className="mt-6 inline-flex rounded-full bg-stone-100 p-1 text-sm font-bold">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-full px-5 py-2 ${tab === k ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{l}</button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          {!loading && !error && items.length === 0 && <p className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">No {tab} applications.</p>}
          {items.map((a) => <Card key={a._id} app={a} onDone={load} />)}
        </div>
      </div>
    </PageShell>
  );
}