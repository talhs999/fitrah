import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Package, User, MapPin } from "lucide-react";
import Link from "next/link";
import AccountOrdersClient from "./AccountOrdersClient";

export const metadata = { title: "My Account — Fitrah" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch orders specific to this logged in user
  const { data: userOrders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = userOrders || [];

  return (
    <main className="bg-[#faf9f6] min-h-screen pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-black/10 p-6 rounded-sm sticky top-32">
            <div className="w-16 h-16 bg-[#111] text-white rounded-full flex items-center justify-center font-serif text-2xl mb-4">
              {user.email?.[0].toUpperCase()}
            </div>
            <h1 className="font-serif text-xl text-brand-black truncate">{user.user_metadata?.full_name || "Valued Customer"}</h1>
            <p className="font-sans text-xs text-brand-muted truncate mb-8">{user.email}</p>

            <nav className="space-y-1">
              <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 bg-black/5 text-brand-black font-sans text-sm font-semibold rounded-sm">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-brand-muted hover:text-brand-black hover:bg-black/5 transition-colors font-sans text-sm rounded-sm">
                <Package className="w-4 h-4" /> My Orders
              </Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-brand-muted hover:text-brand-black hover:bg-black/5 transition-colors font-sans text-sm rounded-sm">
                <MapPin className="w-4 h-4" /> Addresses
              </Link>
            </nav>

            <div className="mt-8 pt-6 border-t border-black/10">
              <form action="/api/auth/signout" method="POST">
                <button className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:text-brand-black transition-colors font-sans text-sm w-full text-left">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          <div className="bg-white border border-black/10 p-8 rounded-sm">
            <h2 className="font-serif text-2xl text-brand-black mb-6">Account Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Full Name</label>
                <div className="font-sans text-sm text-brand-black p-3 bg-[#faf9f6] border border-black/10 rounded-sm">
                  {user.user_metadata?.full_name || "Not provided"}
                </div>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Email Address</label>
                <div className="font-sans text-sm text-brand-black p-3 bg-[#faf9f6] border border-black/10 rounded-sm">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <AccountOrdersClient orders={orders} />

        </div>

      </div>
    </main>
  );
}
