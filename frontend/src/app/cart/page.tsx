"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { PRODUCTS } from "@/lib/products";

export default function CartPage() {
  const { items, removeFromCart, setQty, totalPrice } = useCart();
  const { currencySymbol } = useCurrency();

  const cartProducts = items.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  if (cartProducts.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf9f6] px-6 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-black mb-6">Your Cart is Empty</h1>
        <p className="font-sans text-[15px] text-brand-muted mb-10 max-w-md">
          It looks like you haven't added any products to your cart yet. Discover our collection of premium beard oils.
        </p>
        <Link href="/shop" className="group inline-flex items-center gap-3 bg-brand-black text-white px-10 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-black transition-colors">
          Shop the Collection
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-black mb-12">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8 border-t border-black/10 pt-8">
            {cartProducts.map(({ id, qty, product }) => (
              <div key={id} className="flex gap-6 pb-8 border-b border-black/5">
                <div className="w-24 h-32 md:w-32 md:h-40 relative bg-[#ebebeb] shrink-0">
                  <Image src={product!.image} alt={product!.name} fill className="object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/shop/${id}`} className="font-serif text-xl md:text-2xl text-brand-black hover:text-brand-muted transition-colors">
                        {product!.name}
                      </Link>
                      <p className="font-sans text-xs text-brand-muted uppercase tracking-widest mt-1">{product!.purpose}</p>
                    </div>
                    <button onClick={() => removeFromCart(id)} className="text-brand-muted hover:text-red-500 transition-colors p-1" aria-label="Remove item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-end justify-between mt-6">
                    <div className="flex items-center border border-black/20">
                      <button onClick={() => setQty(id, qty - 1)} className="px-3 py-2 text-brand-muted hover:bg-black/5 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-sans text-sm font-semibold w-8 text-center">{qty}</span>
                      <button onClick={() => setQty(id, qty + 1)} className="px-3 py-2 text-brand-muted hover:bg-black/5 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-sans text-base font-semibold text-brand-black">{currencySymbol}{(product!.price * qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 lg:sticky lg:top-32 h-fit border border-black/5 shadow-sm">
            <h2 className="font-serif text-2xl text-brand-black mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between font-sans text-[15px] text-brand-muted">
                <span>Subtotal</span>
                <span>{currencySymbol}{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-sans text-[15px] text-brand-muted">
                <span>Shipping</span>
                <span>{totalPrice > 150 ? 'Free' : 'Calculated at checkout'}</span>
              </div>
              <div className="pt-4 border-t border-black/10 flex justify-between font-sans text-lg font-semibold text-brand-black">
                <span>Total</span>
                <span>{currencySymbol}{totalPrice.toFixed(2)} {totalPrice > 150 ? '' : '+'}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full group flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-black transition-colors">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
