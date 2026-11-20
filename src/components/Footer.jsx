import { Link } from "react-router-dom";
import { BRAND, PAYMENT_NOTICE } from "../brand";
import { useAuth } from "../context/AuthContext";
import { GROUPS } from "../utils/categoryGroups";
import Logo from "./Logo";

function Col({ title, children }) {
  return (
    <div>
      <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/50">{title}</h4>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}

const Soon = () => (
  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">Soon</span>
);

// Shared footer, used on every page.
export default function Footer() {
  const { user } = useAuth();
  const isVendor = user?.role === "vendor";

  return (
    <footer className="bg-night px-4 pb-10 text-white/70 sm:px-6">
      <div className="mx-auto max-w-7xl border-t border-white/10 pt-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              {BRAND.tagline} A multi-vendor marketplace with escrow-style payments, where vendors are paid only after you confirm delivery.
            </p>
            <p className="mt-8 text-xs text-white/50">© {BRAND.year} {BRAND.name}. All rights reserved.</p>
            {PAYMENT_NOTICE && <p className="mt-1 text-xs text-white/50">{PAYMENT_NOTICE}</p>}
          </div>

          <Col title="Categories">
            {GROUPS.slice(1).map((g) => (
              <li key={g.id}><Link to={`/products?group=${g.id}`} className="hover:text-white">{g.label}</Link></li>
            ))}
          </Col>

          <Col title="Trust & Safety">
            <li><Link to="/#how" className="hover:text-white">How Escrow Works</Link></li>
            <li><Link to="/#how" className="hover:text-white">Delivery Confirmation Code</Link></li>
            <li className="flex items-center gap-2 text-white/40">Refunds & Disputes <Soon /></li>
            <li className="flex items-center gap-2 text-white/40">Report a Scam <Soon /></li>
          </Col>

          <Col title="Sell & Support">
            <li><Link to="/vendors" className="hover:text-white">Our Vendors</Link></li>
            <li><Link to={isVendor ? "/sell/new" : "/sell/apply"} className="hover:text-white">{isVendor ? "Add Listing" : `Sell on ${BRAND.name}`}</Link></li>
            {!user && <li><Link to="/login" className="hover:text-white">Log in or Sign up</Link></li>}
            {BRAND.supportEmail && <li><a href={`mailto:${BRAND.supportEmail}`} className="hover:text-white">Contact Support</a></li>}
            <li className="flex items-center gap-2 text-white/40">Vendor Help Desk <Soon /></li>
          </Col>
        </div>
      </div>
    </footer>
  );
}