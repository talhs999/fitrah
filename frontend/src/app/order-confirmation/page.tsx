"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Download, ArrowRight, Package } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  qty: number;
  image: string;
  bg: string;
}

interface OrderData {
  orderNumber: string;
  date: string;
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fitrah_last_order");
      if (stored) setOrder(JSON.parse(stored));
    } catch {}
  }, []);

  const handleDownload = () => {
    if (!order) return;

    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Fitrah Invoice ${order.orderNumber}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm 16mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      color: #111;
      background: white;
      font-size: 11pt;
    }
    .sans { font-family: Arial, Helvetica, sans-serif; }
    .label {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #888;
      font-weight: 700;
    }
    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 1px solid #e5e5e5; margin-bottom: 14px; }
    .brand-name { font-size: 22pt; letter-spacing: -0.02em; }
    .brand-sub { font-family: Arial, Helvetica, sans-serif; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-top: 3px; }
    .brand-details { margin-top: 10px; }
    .brand-details p { font-family: Arial, Helvetica, sans-serif; font-size: 8pt; color: #777; line-height: 1.6; }
    .invoice-meta { text-align: right; }
    .invoice-num { font-size: 16pt; }
    .invoice-date { font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; color: #777; margin-top: 4px; }
    .badge { display: inline-block; background: #f0f0f0; font-family: Arial, Helvetica, sans-serif; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; padding: 3px 8px; margin-top: 8px; }
    /* Bill/Ship */
    .addresses { display: flex; gap: 40px; margin-bottom: 16px; }
    .address-block p { font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; color: #555; line-height: 1.7; margin-top: 4px; }
    .address-name { font-size: 11pt; font-family: Georgia, serif; color: #111; }
    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
    thead tr { border-bottom: 1px solid #e5e5e5; }
    thead th { font-family: Arial, Helvetica, sans-serif; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.15em; color: #999; font-weight: 700; padding: 0 0 8px 0; }
    thead th:first-child { text-align: left; }
    thead th:not(:first-child) { text-align: right; }
    tbody tr { border-bottom: 1px solid #f0f0f0; }
    tbody td { padding: 8px 0; font-family: Arial, Helvetica, sans-serif; font-size: 9pt; }
    tbody td:first-child { text-align: left; }
    tbody td:not(:first-child) { text-align: right; color: #555; }
    tbody td.amount { font-weight: 700; color: #111; }
    .product-name { font-family: Georgia, serif; font-size: 10pt; color: #111; }
    .product-sub { font-size: 7.5pt; color: #999; margin-top: 2px; }
    /* Totals */
    .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
    .totals-box { width: 220px; }
    .totals-row { display: flex; justify-content: space-between; font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: #666; padding: 3px 0; }
    .totals-final { display: flex; justify-content: space-between; font-family: Georgia, serif; font-size: 13pt; color: #111; border-top: 1px solid #e5e5e5; margin-top: 6px; padding-top: 6px; font-weight: 700; }
    .free { color: #16a34a; font-weight: 700; }
    /* Footer */
    .footer { border-top: 1px solid #e5e5e5; padding-top: 10px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; color: #999; max-width: 260px; line-height: 1.6; }
    .footer-brand { font-family: Arial, Helvetica, sans-serif; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.2em; color: #ccc; text-align: right; }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-name">FITRAH</div>
      <div class="brand-sub">Beard Oil — Perth, AU</div>
      <div class="brand-details">
        <p>ABN: 00 000 000 000</p>
        <p>info@fitrahbeardoil.com.au</p>
        <p>Perth, WA 6000, Australia</p>
      </div>
    </div>
    <div class="invoice-meta">
      <div class="label">Tax Invoice</div>
      <div class="invoice-num">#${order.orderNumber}</div>
      <div class="invoice-date">Date: ${order.date}</div>
      <div class="badge">✓ Confirmed</div>
    </div>
  </div>

  <!-- Addresses -->
  <div class="addresses">
    <div class="address-block">
      <div class="label">Bill To</div>
      <div class="address-name">${order.name}</div>
      <p class="sans" style="font-size:8.5pt;color:#555;margin-top:3px;">${order.email}</p>
    </div>
    <div class="address-block">
      <div class="label">Ship To</div>
      <div class="address-name">${order.name}</div>
      <p class="sans" style="font-size:8.5pt;color:#555;line-height:1.7;margin-top:3px;">
        ${order.address}<br/>
        ${order.city}, ${order.postcode}<br/>
        Australia
      </p>
    </div>
  </div>

  <!-- Items Table -->
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
      <tr>
        <td>
          <div class="product-name">${item.name}</div>
          <div class="product-sub">${item.subtitle} · 30ml</div>
        </td>
        <td>${item.qty}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td class="amount">$${(item.price * item.qty).toFixed(2)}</td>
      </tr>`).join("")}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
      <div class="totals-row"><span>Shipping</span><span class="${order.shipping === 0 ? "free" : ""}">${order.shipping === 0 ? "FREE" : "$" + order.shipping.toFixed(2)}</span></div>
      <div class="totals-row"><span>GST (included)</span><span>$${(order.total / 11).toFixed(2)}</span></div>
      <div class="totals-final"><span>Total (AUD)</span><span>$${order.total.toFixed(2)}</span></div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-note">Thank you for your order. For questions or returns, contact us at info@fitrahbeardoil.com.au within 30 days of delivery.</div>
    <div class="footer-brand">Reviving the Sunnah<br/>Perth, Australia</div>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=794,height=1123");
    if (!win) return;
    win.document.write(invoiceHTML);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
  };

  if (!order) {
    return (
      <main className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6 text-center">
        <Package className="w-12 h-12 text-brand-muted/40 mb-6" strokeWidth={1} />
        <h1 className="font-serif text-3xl text-brand-black mb-3">No order found</h1>
        <p className="font-sans text-sm text-brand-muted mb-8">Please complete a checkout first.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors">
          Shop Now <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#faf9f6] pt-28 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">

          {/* ─── Thank You Header ───────────────────────────── */}
          <div className="text-center mb-14 no-print">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-5xl text-brand-black mb-3">JazakAllah Khair!</h1>
            <p className="font-sans text-base text-brand-muted max-w-md mx-auto leading-relaxed">
              Your order has been placed successfully. We&apos;ll send you a confirmation email shortly and dispatch your Fitrah beard oil within 1–2 business days.
            </p>
          </div>

          {/* ─── Invoice ──────────────────────────────────────── */}
          <div id="invoice-printable" ref={invoiceRef} className="bg-white border border-black/8 p-8">

            {/* Invoice Header */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-black/8">
              <div>
                <p className="font-serif text-3xl text-brand-black tracking-tight">FITRAH</p>
                <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-brand-muted mt-1">Beard Oil — Perth, AU</p>
                <div className="mt-4 space-y-0.5">
                  <p className="font-sans text-xs text-brand-muted">ABN: 00 000 000 000</p>
                  <p className="font-sans text-xs text-brand-muted">info@fitrahbeardoil.com.au</p>
                  <p className="font-sans text-xs text-brand-muted">Perth, WA 6000, Australia</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold mb-2">Tax Invoice</p>
                <p className="font-serif text-2xl text-brand-black">#{order.orderNumber}</p>
                <p className="font-sans text-xs text-brand-muted mt-2">Date: {order.date}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-black/5 px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-brand-black">Confirmed</span>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold mb-3">Bill To</p>
                <p className="font-serif text-base text-brand-black">{order.name}</p>
                <p className="font-sans text-sm text-brand-muted mt-1">{order.email}</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold mb-3">Ship To</p>
                <p className="font-sans text-sm text-brand-muted leading-relaxed">
                  {order.name}<br />
                  {order.address}<br />
                  {order.city}, {order.postcode}<br />
                  Australia
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-black/8">
                  <th className="text-left font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold pb-4">Product</th>
                  <th className="text-center font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold pb-4">Qty</th>
                  <th className="text-right font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold pb-4">Unit Price</th>
                  <th className="text-right font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold pb-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-black/5">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 relative shrink-0 overflow-hidden no-print" style={{ backgroundColor: item.bg }}>
                          <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover mix-blend-multiply" />
                        </div>
                        <div>
                          <p className="font-serif text-sm text-brand-black">{item.name}</p>
                          <p className="font-sans text-xs text-brand-muted">{item.subtitle} · 30ml</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center font-sans text-sm text-brand-black">{item.qty}</td>
                    <td className="py-3 text-right font-sans text-sm text-brand-muted">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-sans text-sm font-semibold text-brand-black">${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between font-sans text-sm text-brand-muted">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-brand-muted">
                  <span>Shipping</span>
                  <span className={order.shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-sans text-sm text-brand-muted">
                  <span>GST (included)</span>
                  <span>${(order.total / 11).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif text-xl text-brand-black border-t border-black/8 pt-3">
                  <span>Total (AUD)</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-black/8 flex items-start justify-between gap-6">
              <p className="font-sans text-xs text-brand-muted/60 leading-relaxed max-w-xs">
                Thank you for your order. For questions or returns, contact us at info@fitrahbeardoil.com.au within 30 days.
              </p>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-muted/40 text-right shrink-0">
                Reviving the Sunnah<br />Perth, Australia
              </p>
            </div>
          </div>

          {/* ─── Action Buttons ──────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 no-print">
            <button
              onClick={handleDownload}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-black text-white px-10 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-black transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Invoice (PDF)
            </button>
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-black/20 px-10 py-4 font-sans text-xs uppercase tracking-[0.18em] font-semibold text-brand-black hover:bg-brand-black hover:text-white transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ─── Delivery Info ───────────────────────────────── */}
          <div className="grid grid-cols-3 gap-6 mt-12 no-print">
            {[
              ["📦", "Packed within 24hrs", "Orders before 2PM AWST ship same day"],
              ["🚚", "Express Delivery", "2–5 business days across Australia"],
              ["📧", "Confirmation Email", "Sent immediately to your inbox"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="text-center py-6 px-4 bg-white border border-black/8">
                <p className="text-2xl mb-2">{icon}</p>
                <p className="font-serif text-sm text-brand-black">{title}</p>
                <p className="font-sans text-xs text-brand-muted/70 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
