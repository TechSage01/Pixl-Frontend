import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import AccountLayout from "../components/AccountLayout";
import { useAuth } from "../context/AuthContext";

const ROLE = { buyer: "Buyer", vendor: "Vendor", admin: "Admin" };

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const rows = [
    ["Name", user?.name || "—"],
    ["Email", user?.email || "—"],
    ["Account type", ROLE[user?.role] || "—"],
    ["Sign-in method", "Email code, Google or GitHub (no password to manage)"],
  ];

  return (
    <AccountLayout>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">Account</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Settings</h1>
      <p className="mt-1.5 text-sm text-stone-600">Your account details. Editing your profile is coming later.</p>

      <dl className="mt-8 divide-y divide-stone-100 rounded-3xl border border-stone-200 bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-sm text-stone-500">{k}</dt>
            <dd className="break-all font-semibold sm:text-right">{v}</dd>
          </div>
        ))}
      </dl>

      <button
        onClick={async () => { try { await logout(); } finally { navigate("/"); } }}
        className="mt-6 flex items-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-bold hover:bg-stone-50"
      >
        <LogOut size={18} /> Sign out
      </button>
    </AccountLayout>
  );
}