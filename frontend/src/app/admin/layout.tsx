"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Settings, Users, Tags, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/10 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-20 flex items-center px-8 border-b border-black/10">
          <div className="p-6">
            <span className="font-serif text-2xl tracking-widest text-brand-black uppercase">FITRAH</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-sans text-sm ${
                  isActive
                    ? "bg-[#111] text-white font-semibold"
                    : "text-brand-muted hover:bg-black/5 hover:text-brand-black"
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-brand-muted hover:bg-black/5 hover:text-brand-black rounded-md transition-colors font-sans text-sm"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Topbar for mobile & quick actions */}
        <header className="h-20 bg-white border-b border-black/10 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-serif text-2xl text-brand-black hidden md:block">
            {navigation.find((n) => pathname === n.href || (pathname.startsWith(n.href) && n.href !== "/admin"))?.name || "Admin"}
          </h1>
          
          <div className="flex items-center gap-4 md:hidden">
             <Link href="/">
              <span className="font-serif text-xl tracking-widest text-brand-black uppercase">FITRAH</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center font-sans text-xs font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
