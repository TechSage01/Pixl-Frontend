import { Link } from "react-router-dom";
import { Banknote, PackageCheck, ShieldCheck, ShoppingBag, Handshake } from "lucide-react";
import AccountLayout from "../components/AccountLayout";
import { BRAND } from "../brand";

const STEPS = [
  [ShoppingBag, "You order", "Pick an item and pay at checkout."],
  [Banknote, "We hold the payment", "The vendor does not receive your money yet."],
  [PackageCheck, "You get your item", "Check it matches the listing."],
  [Handshake, "You confirm delivery", "Only then is the payment released to the vendor."],
];

export default function Escrow() {
  return (
    <AccountLayout>
      <div>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><ShieldCheck size={28} /></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Escrow orders</h1>
            <p className="text-stone-500">Track the orders you have paid for here.</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-base font-bold">No orders yet</p>
          <p className="mt-1 text-sm text-stone-500">
            {BRAND.paymentsLive ? "Your orders will appear here after you check out." : "Checkout is not live yet. Your orders will appear here once it opens."}
          </p>
          <Link to="/products" className="mt-5 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700">Browse products</Link>
        </div>

        <h2 className="mt-12 text-xl font-bold">How escrow works on {BRAND.name}</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2">
          {STEPS.map(([Icon, title, text], i) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon size={22} /></span>
              <div>
                <p className="font-bold">{i + 1}. {title}</p>
                <p className="mt-1 text-sm text-stone-500">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </AccountLayout>
  );
}