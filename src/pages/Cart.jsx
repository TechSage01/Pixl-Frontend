import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, ShieldCheck, Trash2 } from "lucide-react";
import AccountLayout from "../components/AccountLayout";
import { useCart } from "../context/CartContext";
import { BRAND } from "../brand";

const naira = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");

export default function Cart() {
  const { items, setQty, remove, clear, total, count } = useCart();

  return (
    <AccountLayout>
      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">Shopping</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Your cart</h1>
            <p className="mt-1 text-sm text-stone-500">{count} {count === 1 ? "item" : "items"}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="text-sm font-semibold text-stone-500 hover:text-red-600">Clear cart</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-stone-400" />
            <p className="mt-3 text-lg font-bold">Your cart is empty</p>
            <p className="mt-1 text-sm text-stone-500">Add items you like and they will show up here.</p>
            <Link to="/products" className="mt-6 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700">Start shopping</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                  <Link to={`/listing/${i.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {i.img ? <img src={i.img} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-2xl font-bold text-brand-700">{i.title?.[0]}</span>}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link to={`/listing/${i.id}`} className="line-clamp-1 font-semibold hover:text-brand-700">{i.title}</Link>
                    {i.seller && <p className="text-sm text-stone-500">Sold by {i.seller}</p>}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-stone-200">
                        <button onClick={() => setQty(i.id, i.qty - 1)} disabled={i.qty <= 1} aria-label="Less" className="p-2 disabled:opacity-40"><Minus size={16} /></button>
                        <span className="w-8 text-center text-sm font-bold">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} disabled={i.qty >= 10} aria-label="More" className="p-2 disabled:opacity-40"><Plus size={16} /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{naira(i.price * i.qty)}</span>
                        <button onClick={() => remove(i.id)} aria-label="Remove" className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold">Order summary</h2>
              <div className="mt-4 flex justify-between text-sm text-stone-600"><span>Subtotal</span><span className="font-semibold text-night">{naira(total)}</span></div>
              <div className="mt-4 border-t border-stone-100 pt-4 flex justify-between"><span className="font-bold">Total</span><span className="text-xl font-extrabold">{naira(total)}</span></div>
              <button disabled className="mt-5 w-full cursor-not-allowed rounded-full bg-stone-200 py-3.5 text-sm font-bold text-stone-500">Checkout with escrow (coming soon)</button>
              <p className="mt-4 flex gap-2 rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-700">
                <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                When checkout opens, your payment is held in escrow and released to the vendor after you confirm delivery.{!BRAND.paymentsLive && " Checkout is not live yet."}
              </p>
            </aside>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}