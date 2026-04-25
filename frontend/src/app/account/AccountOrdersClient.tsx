"use client";

import { useState } from "react";
import { Package, X } from "lucide-react";
import Link from "next/link";
import { cancelUserOrder } from "./actions";

export default function AccountOrdersClient({ orders }: { orders: any[] }) {
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder || !reason.trim()) return;

    setIsSubmitting(true);
    try {
      await cancelUserOrder(cancellingOrder, reason);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setCancellingOrder(null);
        setReason("");
        window.location.reload(); // Refresh to update list state
      }, 2000);
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
        <div className="p-6 border-b border-black/10">
          <h2 className="font-serif text-xl text-brand-black">Recent Orders</h2>
        </div>
        <div className="p-12 text-center">
          <Package className="w-12 h-12 text-black/10 mx-auto mb-4" />
          <h3 className="font-serif text-lg text-brand-black mb-2">No orders yet</h3>
          <p className="font-sans text-sm text-brand-muted font-light max-w-sm mx-auto mb-6">
            When you place an order, it will appear here so you can track its status.
          </p>
          <Link href="/shop" className="inline-flex bg-[#111] text-white px-8 py-3 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
        <div className="p-6 border-b border-black/10 flex items-center justify-between">
          <h2 className="font-serif text-xl text-brand-black">Your Orders</h2>
        </div>
        
        <div className="divide-y divide-black/10">
          {orders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-brand-muted mb-1">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="font-sans text-sm text-brand-black font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`inline-flex px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${
                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                    order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                    order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status}
                  </span>
                  
                  <span className="font-sans text-sm font-semibold text-brand-black">
                    ${order.total_amount}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-[#faf9f6] p-4 border border-black/10 rounded-sm mt-4 space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-white border border-black/10 flex-shrink-0">
                        {item.product?.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                        )}
                      </div>
                      <div>
                        <p className="font-sans text-xs font-semibold text-brand-black">{item.product?.name || "Product"}</p>
                        <p className="font-sans text-[10px] text-brand-muted uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-sans text-xs text-brand-muted">${item.price_at_time}</p>
                  </div>
                ))}
              </div>

              {/* Cancel Button */}
              {order.status === "Processing" && (
                <div className="mt-4 text-right">
                  <button 
                    onClick={() => {
                      setCancellingOrder(order.id);
                      setIsSuccess(false);
                      setReason("");
                    }}
                    className="font-sans text-[10px] uppercase tracking-widest text-red-600 hover:text-red-800 border-b border-transparent hover:border-red-800 transition-colors font-bold"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
              {order.status === "Cancelled" && order.cancellation_reason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-sm">
                  <p className="font-sans text-[11px] text-red-800">
                    <span className="font-bold">Cancellation Reason:</span> {order.cancellation_reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-8 rounded-sm shadow-2xl relative">
            {!isSuccess && (
              <button 
                onClick={() => setCancellingOrder(null)} 
                className="absolute top-6 right-6 text-brand-muted hover:text-brand-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-brand-black mb-2">Order Cancelled</h3>
                <p className="font-sans text-sm text-brand-muted">Your order has been successfully cancelled.</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="font-serif text-2xl text-brand-black mb-2">Cancel Order</h3>
                  <p className="font-sans text-sm text-brand-muted">Are you sure you want to cancel this order? This action cannot be undone.</p>
                </div>
                
                <form onSubmit={handleCancel} className="space-y-6">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-3">
                      Reason for Cancellation
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please tell us why you are cancelling this order..."
                      className="w-full p-4 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black resize-none transition-colors"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setCancellingOrder(null)}
                      className="flex-1 py-4 border border-black/10 text-brand-black font-sans text-xs uppercase tracking-widest font-semibold hover:bg-black/5 transition-colors rounded-sm"
                    >
                      Keep Order
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || !reason.trim()}
                      className="flex-1 py-4 bg-red-600 text-white font-sans text-xs uppercase tracking-widest font-bold hover:bg-red-700 transition-colors disabled:opacity-50 rounded-sm"
                    >
                      {isSubmitting ? "Cancelling..." : "Confirm Cancel"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
