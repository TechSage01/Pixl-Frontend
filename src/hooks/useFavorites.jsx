import { useCallback, useState } from "react";

const KEY = "kartly:favorites";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// Saved items live in this browser for now. Later we can sync them to the account.
export default function useFavorites() {
  const [ids, setIds] = useState(read);

  const toggle = useCallback((id) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const isFav = useCallback((id) => ids.includes(id), [ids]);

  return { ids, isFav, toggle };
}