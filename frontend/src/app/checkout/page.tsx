"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/lib/products";
import { ArrowRight, User, UserCheck, ShoppingBag } from "lucide-react";
import { createOrder, createStripeCheckout } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { useCurrency } from "@/context/CurrencyContext";

type GateChoice = "none" | "login" | "register" | "guest";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [gate, setGate] = useState<GateChoice>("none");
  const router = useRouter();

  // ─── Payment Settings State ───────────────────────────────
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [codEnabled, setCodEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(false);
  const [bankDetails, setBankDetails] = useState({ name: "", accountName: "", accountNumber: "", iban: "", instructions: "" });
  const [selectedPayment, setSelectedPayment] = useState<"stripe" | "cod" | "bank">("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const { currency, currencySymbol } = useCurrency();

  const [shippingSettings, setShippingSettings] = useState({
    local_shipping_rate: 0,
    standard_shipping_rate: 9.95,
    free_shipping_threshold: 80,
    local_shipping_city: "Lahore"
  });

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("payment_settings").select("*").single();
      if (data) {
        setStripeEnabled(data.stripe_enabled);
        setCodEnabled(data.cod_enabled);
        setBankTransferEnabled(!!(data as any).bank_transfer_enabled);
        if ((data as any).bank_transfer_enabled) {
          setBankDetails({
            name: (data as any).bank_name || "",
            accountName: (data as any).bank_account_name || "",
            accountNumber: (data as any).bank_account_number || "",
            iban: (data as any).bank_iban || "",
            instructions: (data as any).bank_instructions || "",
          });
        }
        if (data.stripe_enabled && !data.cod_enabled) {
          setSelectedPayment("stripe");
        } else if (!data.stripe_enabled && data.cod_enabled) {
          setSelectedPayment("cod");
        } else if (data.stripe_enabled && data.cod_enabled) {
          setSelectedPayment("stripe");
        }
        
        setShippingSettings({
          local_shipping_rate: (data as any).local_shipping_rate ?? 0,
          standard_shipping_rate: (data as any).standard_shipping_rate ?? 9.95,
          free_shipping_threshold: (data as any).free_shipping_threshold ?? 80,
          local_shipping_city: (data as any).local_shipping_city || "Lahore"
        });
      }
    };
    fetchPaymentSettings();
  }, []);

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

  let baseShipping = city.trim().toLowerCase() === (shippingSettings as any).local_shipping_city.toLowerCase() ? shippingSettings.local_shipping_rate : shippingSettings.standard_shipping_rate;
  let shipping = totalPrice >= shippingSettings.free_shipping_threshold ? 0 : baseShipping;
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
              if (selectedPayment === "stripe") {
                setIsProcessing(true);
                // Call Stripe Checkout Server Action
                const result = await createStripeCheckout({
                  customer_name: guestName,
                  customer_email: guestEmail,
                  shipping_address: `${address}, ${city}, ${postcode}`,
                  total_amount: orderTotal,
                  items: items.map(item => {
                    const p = PRODUCTS.find(x => x.id === item.id)!;
                    return { id: item.id, name: p.name, qty: item.qty, price: p.price, image: p.image };
                  })
                });

                if (result.url) {
                  window.location.href = result.url;
                } else {
                  alert("Failed to initialize Stripe checkout: " + result.error);
                  setIsProcessing(false);
                }
                return;
              }

              // Normal COD / Bank Transfer Flow
              const paymentLabel = selectedPayment === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';
              const result = await createOrder({
                customer_name: guestName,
                customer_email: guestEmail,
                shipping_address: `${address}, ${city}, ${postcode}`,
                total_amount: orderTotal,
                items: items.map(item => {
                  const p = PRODUCTS.find(x => x.id === item.id)!;
                  return { id: item.id, name: p.name, qty: item.qty, price: p.price };
                })
              });

              if (result && result.success === false) {
                alert("Failed to place order: " + result.error);
                return;
              }

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
                paymentMethod: paymentLabel
              };

              localStorage.setItem("fitrah_last_order", JSON.stringify(orderData));
              clearCart();
              router.push("/checkout/success");
            } catch (err: any) {
              console.error(err);
              alert("Failed to place order: " + (err.message || "Unknown error"));
              setIsProcessing(false);
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
                  placeholder="123 Main Street" required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)}
                  placeholder={shippingSettings.local_shipping_city || "Lahore"} required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Postcode</label>
                <input type="text" value={postcode} onChange={e => setPostcode(e.target.value)}
                  placeholder="54000" required
                  className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>

            <div className="pt-4 border-t border-black/8">
              <h2 className="font-serif text-2xl text-brand-black mb-6">Payment Method</h2>
              
              <div className="space-y-3 mb-6">
                {stripeEnabled && (
                  <label 
                    onClick={() => setSelectedPayment('stripe')}
                    className={`block border rounded-sm p-4 cursor-pointer transition-colors ${selectedPayment === 'stripe' ? 'border-brand-black bg-black/[0.02]' : 'border-black/10 hover:border-black/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === 'stripe' ? 'border-brand-black' : 'border-black/30'}`}>
                        {selectedPayment === 'stripe' && <div className="w-2 h-2 rounded-full bg-brand-black" />}
                      </div>
                      <span className="font-sans text-sm font-bold text-brand-black">Credit / Debit Card (Stripe)</span>
                      <span className="ml-auto font-sans text-[10px] uppercase tracking-widest text-brand-muted border border-black/10 px-2 py-0.5 rounded-sm">Secure</span>
                    </div>
                  </label>
                )}

                {codEnabled && (
                  <label 
                    onClick={() => setSelectedPayment('cod')}
                    className={`block border rounded-sm p-4 cursor-pointer transition-colors ${selectedPayment === 'cod' ? 'border-brand-black bg-black/[0.02]' : 'border-black/10 hover:border-black/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === 'cod' ? 'border-brand-black' : 'border-black/30'}`}>
                        {selectedPayment === 'cod' && <div className="w-2 h-2 rounded-full bg-brand-black" />}
                      </div>
                      <span className="font-sans text-sm font-bold text-brand-black">Cash on Delivery (COD)</span>
                      <span className="ml-auto font-sans text-[10px] uppercase tracking-widest text-brand-muted">Pay at Door</span>
                    </div>
                  </label>
                )}

                {bankTransferEnabled && (
                  <div>
                    <label 
                      onClick={() => setSelectedPayment('bank')}
                      className={`block border rounded-sm p-4 cursor-pointer transition-colors ${selectedPayment === 'bank' ? 'border-emerald-700 bg-emerald-50/30' : 'border-black/10 hover:border-black/30'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === 'bank' ? 'border-emerald-700' : 'border-black/30'}`}>
                          {selectedPayment === 'bank' && <div className="w-2 h-2 rounded-full bg-emerald-700" />}
                        </div>
                        <span className="font-sans text-sm font-bold text-brand-black">Bank Transfer</span>
                        <span className="ml-auto font-sans text-[10px] uppercase tracking-widest text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-sm">Secure</span>
                      </div>
                    </label>
                    {selectedPayment === 'bank' && (
                      <div className="mt-2 border border-emerald-200 bg-emerald-50/40 rounded-sm p-4 space-y-2">
                        <p className="font-sans text-[10px] uppercase tracking-widest text-emerald-800 font-bold mb-3">Bank Details</p>
                        {bankDetails.name && <div className="flex justify-between font-sans text-sm"><span className="text-brand-muted">Bank</span><span className="font-semibold text-brand-black">{bankDetails.name}</span></div>}
                        {bankDetails.accountName && <div className="flex justify-between font-sans text-sm"><span className="text-brand-muted">Account Name</span><span className="font-semibold text-brand-black">{bankDetails.accountName}</span></div>}
                        {bankDetails.accountNumber && <div className="flex justify-between font-sans text-sm"><span className="text-brand-muted">Account No.</span><span className="font-semibold text-brand-black">{bankDetails.accountNumber}</span></div>}
                        {bankDetails.iban && <div className="flex justify-between font-sans text-sm"><span className="text-brand-muted">IBAN</span><span className="font-semibold text-brand-black text-xs break-all">{bankDetails.iban}</span></div>}
                        {bankDetails.instructions && <p className="font-sans text-[11px] text-emerald-700 border-t border-emerald-200 pt-2 mt-2">{bankDetails.instructions}</p>}
                      </div>
                    )}
                  </div>
                )}
                
                {!stripeEnabled && !codEnabled && !bankTransferEnabled && (
                  <div className="p-4 bg-red-50 text-red-600 font-sans text-sm border border-red-100 rounded-sm">
                    No payment methods are currently available. Please contact support.
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing || (!stripeEnabled && !codEnabled && !bankTransferEnabled)}
              className="w-full group inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : `Place Order — ${currencySymbol}${total.toFixed(2)} ${currency}`}
              {!isProcessing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
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
                    <span className="font-sans text-sm font-semibold text-brand-black">{currencySymbol}{(product.price * item.qty).toFixed(2)}</span>
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
                <span>{currencySymbol}{totalPrice.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && appliedCoupon.type === "percentage" && (
                <div className="flex justify-between font-sans text-sm text-green-600 font-medium">
                  <span>Discount ({appliedCoupon.value}%)</span>
                  <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-sans text-sm text-brand-muted">
                <span>Shipping</span>
                <span className={freeShipping ? "text-green-600 font-semibold" : ""}>
                  {freeShipping ? "FREE" : `${currencySymbol}${shipping.toFixed(2)}`}
                </span>
              </div>
              {!freeShipping && (
                <p className="font-sans text-[10px] text-brand-muted/60">Free shipping on orders over {currencySymbol}{shippingSettings.free_shipping_threshold}</p>
              )}
              <div className="flex justify-between font-serif text-xl text-brand-black border-t border-black/8 pt-4 mt-2">
                <span>Total</span>
                <span>{currencySymbol}{total.toFixed(2)} {currency}</span>
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
