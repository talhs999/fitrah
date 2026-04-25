import Link from "next/link";
import { ArrowUpRight, DollarSign, Package, ShoppingBag, Users } from "lucide-react";

import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Admin Dashboard — Fitrah",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch real data
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  const { data: products } = await supabase.from("products").select("id");

  const totalRevenue = orders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
  const activeOrders = orders?.filter(o => o.status === "Processing" || o.status === "Pending").length || 0;
  const productCount = products?.length || 0;
  const customerCount = new Set(orders?.map(o => o.customer_email)).size; // Unique customers

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, trend: "+0%" },
          { label: "Active Orders", value: activeOrders.toString(), icon: ShoppingBag, trend: "+0%" },
          { label: "Products", value: productCount.toString(), icon: Package, trend: "0%" },
          { label: "Total Customers", value: customerCount.toString(), icon: Users, trend: "+0%" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 border border-black/10 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-xs uppercase tracking-widest text-brand-muted font-semibold">
                {stat.label}
              </h3>
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-brand-black">
                <stat.icon className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="font-serif text-3xl text-brand-black">{stat.value}</p>
              <div className="flex items-center gap-1 text-green-600 font-sans text-xs font-bold">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-black/10 rounded-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
            <h2 className="font-serif text-xl text-brand-black">Recent Orders</h2>
            <Link href="/admin/orders" className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-muted hover:text-brand-black transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-black/5 text-brand-muted text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {orders?.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-black/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-black text-xs">{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-brand-muted">{order.customer_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-brand-black">${order.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-black/10 rounded-sm p-6">
            <h2 className="font-serif text-xl text-brand-black mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/products" className="w-full flex items-center justify-between px-4 py-3 bg-[#111] text-white rounded-md font-sans text-sm font-semibold hover:bg-black transition-colors group">
                <span className="flex items-center gap-3">
                  <Package className="w-4 h-4" /> Add New Product
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link href="/admin/orders" className="w-full flex items-center justify-between px-4 py-3 bg-white border border-black/20 text-brand-black rounded-md font-sans text-sm font-semibold hover:border-brand-black transition-colors">
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" /> View All Orders
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
