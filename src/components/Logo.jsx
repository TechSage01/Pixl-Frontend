import { ShoppingBag } from "lucide-react";

// Text logo; takes its colour from the parent (set text-white or text-night where you use it).
export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
        <ShoppingBag size={20} className="text-white" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">kartly</span>
    </span>
  );
}