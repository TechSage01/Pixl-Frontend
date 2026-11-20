import { Bell } from "lucide-react";
import AccountLayout from "../components/AccountLayout";

export default function Notifications() {
  return (
    <AccountLayout>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">Inbox</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Notifications</h1>
      <p className="mt-1.5 text-sm text-stone-600">Updates about your orders and account will show up here.</p>
      <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
        <Bell className="mx-auto h-10 w-10 text-stone-400" />
        <p className="mt-3 text-base font-bold">No notifications yet</p>
        <p className="mt-1 text-sm text-stone-500">You are all caught up.</p>
      </div>
    </AccountLayout>
  );
}