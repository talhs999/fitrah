"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Search, Package, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { trackOrder } from "./actions";
import { useCurrency } from "@/context/CurrencyContext";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [trackingId, setTrackingId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);
  const { currencySymbol } = useCurrency();

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId);
    }
  }, [initialId]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(trackingId);
  };

  const handleTrack = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const result = await trackOrder(id);
      if (result.success && result.order) {
        setOrder(result.order);
      } else {
        setError(result.error || "Order not found");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusIcon = (status: string) => {
    switch(status) {
      case "Processing": return <Clock className="w-8 h-8 text-brand-black" />;
      case "Shipped": return <Package className="w-8 h-8 text-brand-black" />;
      case "Delivered": return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case "Cancelled": return <XCircle className="w-8 h-8 text-red-600" />;
      default: return <Package className="w-8 h-8 text-brand-muted" />;
    }
  };

  return (
    <>
      <div className="text-center mb-10 relative z-10">
        <h1 className="font-serif text-4xl text-brand-black mb-4">Track Your Order</h1>
        <p className="font-sans text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
          Enter your 8-character Tracking ID from your confirmation email to see your order status.
        </p>
      </div>

      <form onSubmit={onSubmit} className="relative mb-12 z-10">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            placeholder="e.g. A1B2C3D4"
            className="w-full pl-12 pr-32 py-4 bg-[#faf9f6] border border-black/10 font-sans text-base text-brand-black placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-black transition-colors uppercase tracking-wider"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-black text-white px-6 py-2.5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Track"}
          </button>
        </div>
        {error && <p className="text-red-500 font-sans text-sm mt-3 text-center">{error}</p>}
      </form>

      {order && (
        <div className="border-t border-black/5 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-brand-black/5 rounded-full flex items-center justify-center mb-6">
              {renderStatusIcon(order.status)}
            </div>
            <h2 className="font-serif text-3xl text-brand-black mb-2">{order.status}</h2>
            <p className="font-sans text-sm text-brand-muted">
              Order placed on {order.date}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-black/5 pb-8 mb-8">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted font-bold mb-2">Customer</p>
              <p className="font-sans text-sm text-brand-black font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted font-bold mb-2">Shipping To</p>
              <p className="font-sans text-sm text-brand-black leading-relaxed font-medium">
                {order.shippingAddress}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-brand-black font-bold mb-4">Items</h3>
            <div className="space-y-3 mb-6">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm font-sans">
                  <span className="text-brand-black">{item.qty}x {item.name}</span>
                  <span className="text-brand-muted">{currencySymbol}{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-base font-sans font-bold pt-4 border-t border-black/5">
              <span className="text-brand-black">Total</span>
              <span className="text-brand-black">{currencySymbol}{order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/shop" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-black font-sans text-xs uppercase tracking-widest font-semibold transition-colors group">
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Return to Shop
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] py-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 md:p-16 border border-black/5 shadow-sm relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-black/[0.02] rounded-bl-full pointer-events-none" />
        <Suspense fallback={<div className="text-center py-20 font-sans text-sm text-brand-muted uppercase tracking-widest">Loading...</div>}>
          <TrackContent />
        </Suspense>
      </div>
    </main>
  );
}
