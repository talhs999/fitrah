"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/lib/products";
import { ArrowRight, User, UserCheck, ShoppingBag } from "lucide-react";
import { createOrder } from "./actions";

type GateChoice = "none" | "login" | "register" | "guest";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [gate, setGate] = useState<GateChoice>("none");
  const router = useRouter();

  // ─── Login form state ──────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ─── Register form state ──────────────────────────────────
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // ─── Shipping form (guest + logged-in) ────────────────────
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  // ─── Coupon form state ────────────────────────────────────
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, type: string, value: number} | null>(null);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    
    if (code === "WELCOME10") {
      setAppliedCoupon({ code, type: "percentage", value: 10 });
      setCouponError("");
    } else if (code === "FREESHIP") {
      setAppliedCoupon({ code, type: "fixed", value: 0 }); // Free shipping
      setCouponError("");
    } else {
      setCouponError("Invalid or expired coupon.");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  let shipping = totalPrice >= 80 ? 0 : 9.95;
  let discountAmount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = totalPrice * (appliedCoupon.value / 100);
    } else if (appliedCoupon.code === "FREESHIP") {
      shipping = 0;
    }
  }

  const freeShipping = shipping === 0;
  const orderSubtotalAfterDiscount = Math.max(0, totalPrice - discountAmount);
  const total = orderSubtotalAfterDiscount + shipping;

  // ─── Empty cart ───────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] px-6 text-center">
        <ShoppingBag className="w-12 h-12 text-brand-muted/40 mb-6" strokeWidth={1} />
        <h1 className="font-serif text-3xl text-brand-black mb-3">Your cart is empty</h1>
        <p className="font-sans text-sm text-brand-muted mb-8">Add some products before checking out.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors">
          Shop Now <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  // ─── GATE SCREEN ─────────────────────────────────────────
  if (gate === "none") {
    return (
      <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg">
          <div className="text-center mb-12">
            <Link href="/">
              <img
                src="/assets/Black.png"
                alt="Fitrah" className="h-20 w-auto object-contain mx-auto"
              />
            </Link>
            <h1 className="font-serif text-4xl text-brand-black mb-3">How would you like to continue?</h1>
            <p className="font-sans text-sm text-brand-muted">Sign in for a faster experience, or continue as a guest.</p>
          </div>

          <div className="space-y-4">
            {/* Sign In */}
            <button
              onClick={() => setGate("login")}
              className="group w-full flex items-center gap-5 bg-brand-black text-white px-7 py-5 hover:bg-black transition-colors"
            >
              <User className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              <div className="text-left flex-1">
                <p className="font-sans text-xs uppercase tracking-widest font-bold">Sign In to My Account</p>
                <p className="font-sans text-xs text-white/50 mt-0.5">Track your order, faster checkout</p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Create Account */}
            <button
              onClick={() => setGate("register")}
              className="group w-full flex items-center gap-5 border border-brand-black text-brand-black px-7 py-5 hover:bg-brand-black hover:text-white transition-colors"
            >
              <UserCheck className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              <div className="text-left flex-1">
                <p className="font-sans text-xs uppercase tracking-widest font-bold">Create an Account</p>
                <p className="font-sans text-xs text-brand-muted group-hover:text-white/60 mt-0.5 transition-colors">Get 10% off your first order</p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-black/10" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-brand-muted">or</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* Continue as Guest */}
            <button
              onClick={() => setGate("guest")}
              className="w-full text-center py-4 font-sans text-xs uppercase tracking-widest text-brand-muted hover:text-brand-black transition-colors font-semibold border border-black/10 hover:border-black/30"
            >
              Continue as Guest →
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── LOGIN FORM (in-checkout) ─────────────────────────────
  if (gate === "login") {
    return (
      <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <Link href="/" className="font-serif text-2xl text-brand-black block text-center mb-8">FITRAH</Link>
          <h1 className="font-serif text-3xl text-brand-black mb-2 text-center">Sign In</h1>
          <p className="font-sans text-sm text-brand-muted text-center mb-10">Continue to checkout</p>

          <form className="space-y-7" onSubmit={(e) => { e.preventDefault(); setGate("guest"); }}>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Email Address</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="you@email.com" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold">Password</label>
                <Link href="#" className="font-sans text-[11px] text-brand-muted hover:text-brand-black transition-colors">Forgot?</Link>
              </div>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                placeholder="Your password" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
            <button type="submit" className="w-full group inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors">
              Sign In & Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button onClick={() => setGate("register")} className="font-sans text-sm text-brand-muted hover:text-brand-black transition-colors">
              Don&apos;t have an account? <span className="border-b border-current">Create one</span>
            </button>
            <br />
            <button onClick={() => setGate("guest")} className="font-sans text-xs uppercase tracking-widest text-brand-muted/60 hover:text-brand-muted transition-colors">
              Or continue as guest
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── REGISTER FORM (in-checkout) ──────────────────────────
  if (gate === "register") {
    return (
      <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <Link href="/" className="font-serif text-2xl text-brand-black block text-center mb-8">FITRAH</Link>
          <h1 className="font-serif text-3xl text-brand-black mb-2 text-center">Create Account</h1>
          <p className="font-sans text-sm text-brand-muted text-center mb-10">Get 10% off your first order</p>

          <form className="space-y-7" onSubmit={(e) => { e.preventDefault(); setGate("guest"); }}>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Full Name</label>
              <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                placeholder="Muhammad Ali" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Email Address</label>
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                placeholder="you@email.com" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Password</label>
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                placeholder="Min. 6 characters" required minLength={6}
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
            <button type="submit" className="w-full group inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors">
              Create Account & Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button onClick={() => setGate("login")} className="font-sans text-sm text-brand-muted hover:text-brand-black transition-colors">
              Already have an account? <span className="border-b border-current">Sign in</span>
            </button>
            <br />
            <button onClick={() => setGate("guest")} className="font-sans text-xs uppercase tracking-widest text-brand-muted/60 hover:text-brand-muted transition-colors">
              Or continue as guest
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── FULL CHECKOUT FORM (guest or logged-in) ──────────────
  return (
    <main className="min-h-screen bg-[#faf9f6] pt-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">

        {/* Left — Shipping Form */}
        <div>
          <div className="mb-10">
            <Link href="/">
              <img
                src="/assets/Black.png"
                alt="Fitrah" className="h-20 w-auto object-contain mb-6 -ml-2"
              />
            </Link>
            <div className="flex items-center gap-3 text-[10px] font-sans uppercase tracking-widest text-brand-muted">
              <Link href="/cart" className="hover:text-brand-black transition-colors">Cart</Link>
              <span>/</span>
              <span className="text-brand-black font-bold">Shipping</span>
              <span>/</span>
              <span>Payment</span>
            </div>
          </div>

          <h2 className="font-serif text-3xl text-brand-black mb-8">Shipping Details</h2>

          <form className="space-y-7" onSubmit={async (e) => {
            e.preventDefault();
            const orderTotal = total;
            const shippingCost = shipping;
            
            try {
              await createOrder({
                customer_name: guestName,
                customer_email: guestEmail,
                shipping_address: address, // City and postcode are handled separately
                city: city,
                postal_code: postcode,
                total_amount: orderTotal,
                items: items.map(item => {
                  const p = PRODUCTS.find(x => x.id === item.id)!;
                  return { id: item.id, qty: item.qty, price: p.price };
                })
              });

              // Create legacy object for the success page
              const orderData = {
                orderNumber: `FTR-${Date.now().toString().slice(-6)}`,
                date: new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }),
                name: guestName,
                email: guestEmail,
                address,
                city,
                postcode,
                items: items.map(item => {
                  const p = PRODUCTS.find(x => x.id === item.id)!;
                  return { id: item.id, name: p.name, subtitle: p.subtitle, price: p.price, qty: item.qty, image: p.image, bg: p.bg };
                }),
                subtotal: totalPrice,
                shipping: shippingCost,
                total: orderTotal,
              };

              localStorage.setItem("fitrah_last_order", JSON.stringify(orderData));
              clearCart();
              router.push("/checkout/success");
            } catch (err: any) {
              console.error(err);
              alert("Failed to place order: " + (err.message || "Unknown error"));
            }
          }}>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Full Name</label>
                <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                  placeholder="Muhammad Ali" required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div className="col-span-2">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Email Address</label>
                <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                  placeholder="you@email.com" required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div className="col-span-2">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Street Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="123 King Street" required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)}
                  placeholder="Perth" required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Postcode</label>
                <input type="text" value={postcode} onChange={e => setPostcode(e.target.value)}
                  placeholder="6000" required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>

            <div className="pt-4 border-t border-black/8">
              <h2 className="font-serif text-2xl text-brand-black mb-6">Payment</h2>
              <div className="bg-white border border-black/10 px-5 py-4 flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-brand-black" />
                <span className="font-sans text-sm text-brand-black">Credit / Debit Card (Stripe)</span>
                <span className="ml-auto font-sans text-[10px] uppercase tracking-widest text-brand-muted">Secure</span>
              </div>
              <div className="bg-[#f5f3ef] border border-black/5 px-5 py-4">
                <p className="font-sans text-xs text-brand-muted">Card payment integration via Stripe coming soon. No card info is stored.</p>
              </div>
            </div>

            <button type="submit" className="w-full group inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors">
              Place Order — ${total.toFixed(2)} AUD
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white border border-black/8 p-8">
            <h2 className="font-sans text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-6">Order Summary</h2>
            <div className="space-y-5 mb-6">
              {items.map((item) => {
                const product = PRODUCTS.find(p => p.id === item.id);
                if (!product) return null;
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-20 relative shrink-0 overflow-hidden" style={{ backgroundColor: product.bg }}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-base text-brand-black">{product.name}</p>
                      <p className="font-sans text-xs text-brand-muted">Qty: {item.qty}</p>
                    </div>
                    <span className="font-sans text-sm font-semibold text-brand-black">${(product.price * item.qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Section */}
            <div className="border-t border-black/8 pt-6 pb-6">
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input 
                      type="text" 
                      placeholder="Discount code" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full sm:flex-1 bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors uppercase min-w-0"
                    />
                    <button 
                      type="submit" 
                      disabled={!couponInput.trim()}
                      className="w-full sm:w-auto shrink-0 bg-brand-black text-white px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="font-sans text-[11px] text-red-600 mt-1">{couponError}</p>}
                </form>
              ) : (
                <div className="flex items-center justify-between bg-black/5 px-4 py-3 border border-black/10 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold bg-white px-2 py-1 border border-black/10 rounded-sm text-brand-black">
                      {appliedCoupon.code}
                    </span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="font-sans text-[10px] text-brand-muted hover:text-red-600 transition-colors uppercase tracking-widest font-bold">
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-black/8 pt-5 space-y-3">
              <div className="flex justify-between font-sans text-sm text-brand-muted">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && appliedCoupon.type === "percentage" && (
                <div className="flex justify-between font-sans text-sm text-green-600 font-medium">
                  <span>Discount ({appliedCoupon.value}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-sans text-sm text-brand-muted">
                <span>Shipping</span>
                <span className={freeShipping ? "text-green-600 font-semibold" : ""}>
                  {freeShipping ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {!freeShipping && (
                <p className="font-sans text-[10px] text-brand-muted/60">Free shipping on orders over $80</p>
              )}
              <div className="flex justify-between font-serif text-xl text-brand-black border-t border-black/8 pt-4 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)} AUD</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 justify-center">
            <Link href="/cart" className="font-sans text-xs text-brand-muted hover:text-brand-black transition-colors uppercase tracking-widest">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
