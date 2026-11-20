import { useEffect, useState } from "react";
const files = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,svg}", { eager: true, query: "?url", import: "default" });
const asset = (name) => files[`../assets/${name}`];
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fetches listings from the Pixl API and reshapes them for the UI.
export default function useListings({ category = "all", search = "", university = "lautech" } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ university, category });
    if (search.trim()) params.set("search", search.trim());

    setLoading(true);
    setError("");

    // small delay so we don't hit the API on every keystroke
    const timer = setTimeout(() => {
      fetch(`${API}/api/public/listings?${params}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load listings"))))
        .then((data) =>
          setItems(
            data.items.map((l) => ({
              id: l.id,
              cat: l.category,
              title: l.title,
              price: l.price,
              img: l.image ? (l.image.startsWith("http") ? l.image : asset(l.image)) : null,
              seller: l.seller,
              spot: l.pickupSpot,
              tag: l.isDemo ? "Demo" : null,
            }))
          )
        )
        .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 250);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [category, search, university]);
  console.log("assets found:", Object.keys(files));

  return { items, loading, error };
}