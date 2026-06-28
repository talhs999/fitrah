"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DollarSign, Package, ShoppingBag, Users, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfMonth, isAfter } from "date-fns";

export default function DashboardClient({ 
  orders, 
  productsCount, 
  currencySymbol,
  users
}: { 
  orders: any[], 
  productsCount: number, 
  currencySymbol: string,
  users: any[]
}) {
  const [dateFilter, setDateFilter] = useState("30days"); // "7days", "30days", "thisMonth", "allTime"

  const filteredData = useMemo(() => {
    let startDate: Date;
    const now = new Date();

    if (dateFilter === "7days") {
      startDate = subDays(now, 7);
    } else if (dateFilter === "30days") {
      startDate = subDays(now, 30);
    } else if (dateFilter === "thisMonth") {
      startDate = startOfMonth(now);
    } else {
      startDate = new Date(0); // All time
    }

    const filteredOrders = orders.filter(o => isAfter(new Date(o.created_at), startDate));
    const filteredUsers = users.filter(u => isAfter(new Date(u.created_at), startDate));

    // Calculate metrics
    const totalRevenue = filteredOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);
    const activeOrders = filteredOrders.filter(o => o.status === "Processing" || o.status === "Pending").length;
    const newCustomers = filteredUsers.length;

    // Generate Chart Data (Group by Day)
    const chartDataMap: Record<string, { date: string; revenue: number; orders: number }> = {};
    
    // Initialize last X days with 0 to show empty days on chart
    if (dateFilter !== "allTime") {
        let current = new Date(startDate);
        while (current <= now) {
            const dateStr = format(current, "MMM dd");
            chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
            current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        }
    }

    // Add actual data
    [...filteredOrders].reverse().forEach(o => {
        const dateStr = format(new Date(o.created_at), "MMM dd");
        if (!chartDataMap[dateStr]) {
            chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
        }
        chartDataMap[dateStr].revenue += Number(o.total_amount);
        chartDataMap[dateStr].orders += 1;
    });

    const chartData = Object.values(chartDataMap);

    return { totalRevenue, activeOrders, newCustomers, filteredOrders, chartData };
  }, [orders, users, dateFilter]);

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-black/10 rounded-sm">
        <div>
          <h1 className="font-serif text-3xl text-brand-black mb-1">Analytics Overview</h1>
          <p className="font-sans text-sm text-brand-muted">Track your sales and customer growth</p>
        </div>
        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-9 pr-8 py-2 bg-[#faf9f6] border border-black/10 rounded-md font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors appearance-none cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="allTime">All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Revenue", value: `${currencySymbol}${filteredData.totalRevenue.toFixed(2)}`, icon: DollarSign },
          { label: "Orders", value: filteredData.filteredOrders.length.toString(), icon: ShoppingBag },
          { label: "New Users", value: filteredData.newCustomers.toString(), icon: Users },
          { label: "Total Products", value: productsCount.toString(), icon: Package },
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
            <p className="font-serif text-3xl text-brand-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 border border-black/10 rounded-sm">
        <h3 className="font-sans text-sm uppercase tracking-widest text-brand-black font-semibold mb-6">Sales Trend</h3>
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#111" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} dx={-10} tickFormatter={(val) => `${val}`} />
                <CartesianGrid vertical={false} stroke="#eee" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px', fontSize: '12px' }}
                  itemStyle={{ color: '#111', fontWeight: 600 }}
                  formatter={(value: any) => [`${currencySymbol}${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#111" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
        </div>
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
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filteredData.filteredOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-black/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-black text-xs">
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                    </td>
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
                    <td className="px-6 py-4 text-right font-medium text-brand-black">{currencySymbol}{order.total_amount}</td>
                  </tr>
                ))}
                {filteredData.filteredOrders.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-brand-muted">No orders in this period.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Help */}
        <div className="space-y-6">
          <div className="bg-[#111] text-white p-6 rounded-sm">
            <h3 className="font-serif text-xl mb-2">Vercel Analytics</h3>
            <p className="font-sans text-xs text-white/70 mb-4 leading-relaxed">
              Website traffic and page views are tracked natively in Vercel. Log in to your Vercel Dashboard to see live visitors and views.
            </p>
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-white text-black font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-colors rounded-sm">
              Open Vercel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
