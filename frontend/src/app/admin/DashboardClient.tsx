"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { DollarSign, Package, ShoppingBag, Users, Calendar, Download, Eye, Globe } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfMonth, isAfter, isBefore, endOfDay, startOfDay } from "date-fns";
import { useReactToPrint } from "react-to-print";

export default function DashboardClient({ 
  orders, 
  productsCount, 
  currencySymbol,
  users,
  pageViews = []
}: { 
  orders: any[], 
  productsCount: number, 
  currencySymbol: string,
  users: any[],
  pageViews?: any[]
}) {
  const [activeTab, setActiveTab] = useState("sales"); // "sales" or "views"
  const [dateFilter, setDateFilter] = useState("30days"); // "7days", "30days", "thisMonth", "allTime", "custom"
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Fitrah_Report_${format(new Date(), 'yyyy-MM-dd')}`,
  });

  const filteredData = useMemo(() => {
    let startDate: Date;
    let endDate: Date = new Date();
    const now = new Date();

    if (dateFilter === "7days") {
      startDate = subDays(now, 7);
    } else if (dateFilter === "30days") {
      startDate = subDays(now, 30);
    } else if (dateFilter === "thisMonth") {
      startDate = startOfMonth(now);
    } else if (dateFilter === "custom" && customStart && customEnd) {
      startDate = startOfDay(new Date(customStart));
      endDate = endOfDay(new Date(customEnd));
    } else {
      startDate = new Date(0); // All time
    }

    const isWithinRange = (dateStr: string) => {
        const d = new Date(dateStr);
        return isAfter(d, startDate) && isBefore(d, endDate);
    };

    const filteredOrders = orders.filter(o => isWithinRange(o.created_at));
    const filteredUsers = users.filter(u => isWithinRange(u.created_at));
    const filteredViews = pageViews.filter(v => isWithinRange(v.created_at));

    // Calculate metrics
    const totalRevenue = filteredOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);
    const activeOrders = filteredOrders.filter(o => o.status === "Processing" || o.status === "Pending").length;
    const newCustomers = filteredUsers.length;

    // View Metrics
    const totalViews = filteredViews.length;
    const uniqueVisitors = new Set(filteredViews.map(v => v.session_id)).size;
    const topPagesMap: Record<string, number> = {};
    filteredViews.forEach(v => {
        topPagesMap[v.path] = (topPagesMap[v.path] || 0) + 1;
    });
    const topPages = Object.entries(topPagesMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Generate Chart Data (Group by Day)
    const chartDataMap: Record<string, { date: string; revenue: number; orders: number; views: number }> = {};
    
    // Initialize last X days with 0 to show empty days on chart
    if (dateFilter !== "allTime" && !(dateFilter === "custom" && (!customStart || !customEnd))) {
        let current = new Date(startDate);
        while (current <= endDate) {
            const dateStr = format(current, "MMM dd");
            chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0, views: 0 };
            current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        }
    }

    // Add Sales Data
    [...filteredOrders].reverse().forEach(o => {
        const dateStr = format(new Date(o.created_at), "MMM dd");
        if (!chartDataMap[dateStr]) chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0, views: 0 };
        chartDataMap[dateStr].revenue += Number(o.total_amount);
        chartDataMap[dateStr].orders += 1;
    });

    // Add Views Data
    [...filteredViews].reverse().forEach(v => {
        const dateStr = format(new Date(v.created_at), "MMM dd");
        if (!chartDataMap[dateStr]) chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0, views: 0 };
        chartDataMap[dateStr].views += 1;
    });

    const chartData = Object.values(chartDataMap);

    return { totalRevenue, activeOrders, newCustomers, filteredOrders, chartData, totalViews, uniqueVisitors, topPages };
  }, [orders, users, pageViews, dateFilter, customStart, customEnd]);

  return (
    <div className="space-y-8" ref={componentRef}>
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 border border-black/10 rounded-sm print:hidden">
        <div>
          <h1 className="font-serif text-3xl text-brand-black mb-1">Analytics Dashboard</h1>
          <p className="font-sans text-sm text-brand-muted">Track your sales and traffic</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Tabs */}
          <div className="flex bg-[#faf9f6] p-1 border border-black/10 rounded-md w-full sm:w-auto">
            <button 
                onClick={() => setActiveTab("sales")}
                className={`flex-1 px-4 py-1.5 text-sm font-sans font-medium rounded-sm transition-colors ${activeTab === 'sales' ? 'bg-white shadow-sm border border-black/5 text-brand-black' : 'text-brand-muted hover:text-brand-black'}`}
            >
                Sales Report
            </button>
            <button 
                onClick={() => setActiveTab("views")}
                className={`flex-1 px-4 py-1.5 text-sm font-sans font-medium rounded-sm transition-colors ${activeTab === 'views' ? 'bg-white shadow-sm border border-black/5 text-brand-black' : 'text-brand-muted hover:text-brand-black'}`}
            >
                Views Analytics
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {dateFilter === "custom" && (
                  <div className="flex items-center gap-2">
                      <input 
                        type="date" 
                        value={customStart} 
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="px-3 py-2 bg-[#faf9f6] border border-black/10 rounded-md font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black"
                      />
                      <span className="text-brand-muted text-sm">to</span>
                      <input 
                        type="date" 
                        value={customEnd} 
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="px-3 py-2 bg-[#faf9f6] border border-black/10 rounded-md font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black"
                      />
                  </div>
              )}

              <button 
                  onClick={() => handlePrint()}
                  className="px-4 py-2 bg-black text-white rounded-md font-sans text-sm font-medium flex items-center gap-2 hover:bg-black/80 transition-colors"
              >
                  <Download className="w-4 h-4" /> Download PDF
              </button>
          </div>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block mb-8">
          <h1 className="font-serif text-3xl text-brand-black">Analytics Report</h1>
          <p className="font-sans text-sm text-brand-muted">
              Generated on {format(new Date(), "MMM dd, yyyy")} | Period: {dateFilter === "custom" ? `${customStart} to ${customEnd}` : dateFilter}
          </p>
      </div>

      {activeTab === "sales" && (
          <div className="space-y-8">
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
            <div className="bg-white p-6 border border-black/10 rounded-sm print:break-inside-avoid print:border-none print:shadow-none print:p-0">
              <h3 className="font-sans text-sm uppercase tracking-widest text-brand-black font-semibold mb-6">Sales Trend</h3>
              <div className="h-80 w-full print:h-[300px]">
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
                      <Area isAnimationActive={false} type="monotone" dataKey="revenue" stroke="#111" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-black/10 rounded-sm overflow-hidden print:break-inside-avoid print:border-none print:mt-10">
                <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between print:px-0">
                  <h2 className="font-serif text-xl text-brand-black">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm">
                    <thead className="bg-black/5 text-brand-muted text-xs uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4 font-semibold print:px-2">Date</th>
                        <th className="px-6 py-4 font-semibold print:px-2">Customer</th>
                        <th className="px-6 py-4 font-semibold print:px-2">Status</th>
                        <th className="px-6 py-4 font-semibold text-right print:px-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {filteredData.filteredOrders.slice(0, 10).map((order) => (
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
          </div>
      )}

      {activeTab === "views" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Page Views", value: filteredData.totalViews.toString(), icon: Eye },
                { label: "Unique Visitors", value: filteredData.uniqueVisitors.toString(), icon: Globe },
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

            {/* Views Chart */}
            <div className="bg-white p-6 border border-black/10 rounded-sm print:break-inside-avoid">
              <h3 className="font-sans text-sm uppercase tracking-widest text-brand-black font-semibold mb-6">Traffic Trend</h3>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} dx={-10} tickFormatter={(val) => `${val}`} />
                      <CartesianGrid vertical={false} stroke="#eee" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px', fontSize: '12px' }}
                        itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                      />
                      <Area isAnimationActive={false} type="monotone" dataKey="views" name="Page Views" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
            </div>

            {/* Top Pages Table */}
            <div className="bg-white border border-black/10 rounded-sm overflow-hidden print:break-inside-avoid">
                <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
                  <h2 className="font-serif text-xl text-brand-black">Top Pages</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm">
                    <thead className="bg-black/5 text-brand-muted text-xs uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Page Path</th>
                        <th className="px-6 py-4 font-semibold text-right">Total Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {filteredData.topPages.map(([path, count]) => (
                        <tr key={path} className="hover:bg-black/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-brand-black">{path}</td>
                          <td className="px-6 py-4 text-right font-medium text-brand-black">{count}</td>
                        </tr>
                      ))}
                      {filteredData.topPages.length === 0 && (
                          <tr>
                              <td colSpan={2} className="px-6 py-8 text-center text-brand-muted">No tracking data available yet.</td>
                          </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
      )}
    </div>
  );
}
