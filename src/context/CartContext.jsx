import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "kartly:cart";
const CartContext = createContext(null);

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

// Cart lives in this browser (localStorage). Each item: { id, title, price, img, seller, qty }
export function CartProvider({ children }) {
  const [items, setItems] = useState(read);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const value = useMemo(() => {
    const add = (l) =>
      setItems((prev) => {
        const hit = prev.find((i) => i.id === l.id);
        if (hit) return prev.map((i) => (i.id === l.id ? { ...i, qty: Math.min(i.qty + 1, 10) } : i));
        return [...prev, { id: l.id, title: l.title, price: Number(l.price) || 0, img: l.img || "", seller: l.seller || "", qty: 1 }];
      });
    const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
    const setQty = (id, qty) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)));
    const clear = () => setItems([]);
    const has = (id) => items.some((i) => i.id === id);
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + i.qty * i.price, 0);
    return { items, add, remove, setQty, clear, has, count, total };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);