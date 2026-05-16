"use client";

import { useState } from "react";
import { Download, Filter, Search, X } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export default function OrdersClient({ orders }: { orders: any[] }) {
  const { currencySymbol } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.customer_name.toLowerCase().includes(term) ||
      order.customer_email.toLowerCase().includes(term)
    );
  });

  const exportCSV = () => {
    // CSV Header
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Email",
      "Phone",
      "Address",
      "City",
      "Country",
      "Postal Code",
      "Total Items",
      "Total Amount",
      "Status",
    ];

    // CSV Rows
    const rows = filteredOrders.map((order) => {
      const totalItems = order.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
      return [
        order.id,
        new Date(order.created_at).toLocaleDateString(),
        `"${order.customer_name}"`,
        `"${order.customer_email}"`,
        `"${order.customer_phone}"`,
        `"${order.shipping_address}"`,
        `"${order.city}"`,
        `"${order.country}"`,
        `"${order.postal_code}"`,
        totalItems,
        order.total_amount,
        order.status,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fitrah_orders_${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-black/10 rounded-sm">
        <div>
          <h1 className="font-serif text-3xl text-brand-black mb-1">Orders</h1>
          <p className="font-sans text-sm text-brand-muted">Track and manage deliveries</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-white border border-black/20 text-brand-black px-6 py-3 rounded-md font-sans text-xs uppercase tracking-widest font-semibold hover:border-brand-black transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-black/10 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by order ID, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#faf9f6] border border-black/10 rounded-md font-sans text-sm focus:outline-none focus:border-brand-black transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 text-brand-muted hover:text-brand-black font-sans text-sm transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-black/5 text-brand-muted text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold text-center">Items</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-brand-muted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => {
                  const totalItems = order.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-brand-black text-xs uppercase tracking-widest">{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-brand-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="text-brand-black font-medium">{order.customer_name}</div>
                          <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold ${order.user_id ? "bg-black text-white" : "bg-black/5 text-brand-muted"}`}>
                            {order.user_id ? "Logged" : "Guest"}
                          </span>
                        </div>
                        <div className="text-brand-muted text-[11px]">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 text-center text-brand-muted">{totalItems}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-black/5 text-brand-muted"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-brand-black">{currencySymbol}{order.total_amount}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal (Slip) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#faf9f6] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative rounded-sm flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#faf9f6] z-10 flex items-center justify-between p-6 border-b border-black/10">
              <div>
                <h2 className="font-serif text-2xl text-brand-black">Order Slip</h2>
                <p className="font-sans text-xs text-brand-muted mt-1 uppercase tracking-widest">#{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-brand-black" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-8 flex-1">
              
              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-5 border border-black/10 rounded-sm">
                  <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-muted mb-4 border-b border-black/10 pb-2">Customer Details</h3>
                  <div className="space-y-2 font-sans text-sm text-brand-black">
                    <p><span className="text-brand-muted w-20 inline-block">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="text-brand-muted w-20 inline-block">Email:</span> {selectedOrder.customer_email}</p>
                    <p><span className="text-brand-muted w-20 inline-block">Phone:</span> {selectedOrder.customer_phone}</p>
                    <p><span className="text-brand-muted w-20 inline-block">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-5 border border-black/10 rounded-sm">
                  <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-muted mb-4 border-b border-black/10 pb-2">Shipping Address</h3>
                  <div className="space-y-2 font-sans text-sm text-brand-black">
                    <p>{selectedOrder.shipping_address}</p>
                    <p>{selectedOrder.city}, {selectedOrder.postal_code}</p>
                    <p>{selectedOrder.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-serif text-xl text-brand-black mb-4">Items Ordered</h3>
                <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
                  <table className="w-full text-left font-sans text-sm">
                    <thead className="bg-black/5 text-brand-muted text-[10px] uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Product</th>
                        <th className="px-4 py-3 font-semibold text-center">Qty</th>
                        <th className="px-4 py-3 font-semibold text-right">Price</th>
                        <th className="px-4 py-3 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {selectedOrder.order_items?.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 flex items-center gap-4">
                            <div className="w-12 h-16 bg-[#faf9f6] border border-black/10 rounded-sm overflow-hidden shrink-0">
                              {item.product?.image ? (
                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-brand-muted uppercase">No Img</div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-brand-black">{item.product?.name || "Unknown Product"}</p>
                              <p className="text-[11px] text-brand-muted mt-0.5">{item.product?.size || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center text-brand-muted">{item.quantity}</td>
                          <td className="px-4 py-4 text-right text-brand-muted">{currencySymbol}{item.price_at_time}</td>
                          <td className="px-4 py-4 text-right font-medium text-brand-black">{currencySymbol}{(item.quantity * item.price_at_time).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary & Status Update */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 border border-black/10 rounded-sm">
                <div className="w-full md:w-64 space-y-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Update Order Status</label>
                    <select 
                      defaultValue={selectedOrder.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const { updateOrderStatus } = await import("../actions");
                          await updateOrderStatus(selectedOrder.id, newStatus);
                          setSelectedOrder({...selectedOrder, status: newStatus});
                        } catch (error) {
                          alert("Failed to update status.");
                        }
                      }}
                      className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors rounded-sm"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {selectedOrder.status === "Cancelled" && selectedOrder.cancellation_reason && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-sm">
                      <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-red-800 mb-1">
                        Cancellation Reason:
                      </p>
                      <p className="font-sans text-sm text-red-700">
                        {selectedOrder.cancellation_reason}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-auto text-right space-y-2 font-sans">
                  <div className="flex justify-between md:justify-end gap-8 text-sm text-brand-muted">
                    <span>Subtotal:</span>
                    <span>{currencySymbol}{selectedOrder.total_amount}</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-8 text-sm text-brand-muted">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-8 text-lg font-serif text-brand-black pt-2 border-t border-black/10">
                    <span>Total:</span>
                    <span>{currencySymbol}{selectedOrder.total_amount}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
