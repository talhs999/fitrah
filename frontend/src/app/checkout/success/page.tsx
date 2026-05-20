"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedOrder = localStorage.getItem("fitrah_last_order");
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center"></div>;
  }

  if (!order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] px-6 text-center">
        <Package className="w-12 h-12 text-brand-muted/40 mb-6 mx-auto" strokeWidth={1} />
        <h1 className="font-serif text-3xl text-brand-black mb-3">No recent order found</h1>
        <p className="font-sans text-sm text-brand-muted mb-8">It looks like you haven't placed an order recently.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] py-24 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 border border-black/5 shadow-sm relative overflow-hidden">
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-black/[0.02] rounded-bl-full pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="w-20 h-20 bg-brand-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-black">
            <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-4xl text-brand-black mb-4">Order Confirmed</h1>
          <p className="font-sans text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            Jazakallah Khair, {order.name}. Your order <strong className="text-brand-black font-semibold">#{order.orderNumber}</strong> has been placed successfully. We'll send a confirmation email to <span className="text-brand-black">{order.email}</span> shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="border-t border-b border-black/5 py-8 mb-12 bg-black/[0.01] -mx-8 px-8 md:-mx-16 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted font-bold mb-2">Order Number</p>
              <p className="font-sans text-sm text-brand-black font-medium">{order.orderNumber}</p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted font-bold mb-2">Date</p>
              <p className="font-sans text-sm text-brand-black font-medium">{order.date}</p>
            </div>
            <div className="col-span-2 md:col-span-2">
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted font-bold mb-2">Shipping To</p>
              <p className="font-sans text-sm text-brand-black leading-relaxed font-medium">
                {order.address}<br />
                {order.city}, {order.postcode}
              </p>
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="mb-12">
          <h2 className="font-sans text-[10px] uppercase tracking-widest text-brand-black font-bold mb-6">Order Summary</h2>
          <div className="space-y-6">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-center">
                <div 
                  className="w-20 h-20 shrink-0 p-3 border border-black/5 flex items-center justify-center"
                  style={{ backgroundColor: item.bg || '#ebebeb' }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="w-8 h-8 bg-black/10 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-brand-black truncate">{item.name}</h3>
                  <p className="font-sans text-xs text-brand-muted truncate">{item.subtitle} | Cap: {item.selectedCap === 'pump' ? 'Pump' : 'Dropper'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-sans text-sm text-brand-black font-medium">${(item.price * item.qty).toFixed(2)}</p>
                  <p className="font-sans text-[10px] text-brand-muted uppercase tracking-widest mt-1">Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-black/5 pt-6 space-y-3">
          <div className="flex justify-between font-sans text-sm text-brand-muted">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-sans text-sm text-brand-muted">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-sans text-base text-brand-black font-bold pt-4 border-t border-black/5 mt-4">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-16 text-center">
          <Link href="/shop" className="inline-flex items-center gap-3 bg-brand-black text-white px-10 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors group">
            Continue Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </main>
  );
}
