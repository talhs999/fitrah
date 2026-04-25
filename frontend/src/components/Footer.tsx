"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Shaghaf — Hydration", href: "/shop/shaghaf" },
    { label: "Ro'ab — Growth", href: "/shop/roab" },
    { label: "Ad'Dawa — Healing", href: "/shop/addawa" },
    { label: "Qawwam — Strength", href: "/shop/qawwam" },
    { label: "Muhafiz — Protection", href: "/shop/muhafiz" },
  ],
  info: [
    { label: "Our Story", href: "/story" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Contact Us", href: "/contact" },
  ],
  account: [
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/register" },
    { label: "My Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#111111] text-white">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-14">
        {/* Brand */}
        <div className="space-y-7">
          <div>
            <img
              src="/api/media?path=C%3A%5CUsers%5CIQRA%20TRADERS%5CDesktop%5CFitrah%20Website%5Clogos%20new%5Cwhite.png"
              alt="Fitrah"
              className="h-28 w-auto object-contain -ml-2"
            />
          </div>
          <p className="text-white/50 font-sans text-sm leading-relaxed font-light">
            Premium beard oils inspired by 1,400 years of prophetic tradition. Formulated for the modern man in Perth, Australia.
          </p>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="mailto:info@fitrahbeardoil.com.au" className="text-white/40 hover:text-white transition-colors" aria-label="Email">
              <Mail className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className="space-y-7">
          <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-white/40">Products</h4>
          <ul className="space-y-3">
            {LINKS.shop.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="font-sans text-sm text-white/60 hover:text-white transition-colors font-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div className="space-y-7">
          <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-white/40">Account</h4>
          <ul className="space-y-3">
            {LINKS.account.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="font-sans text-sm text-white/60 hover:text-white transition-colors font-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-2 space-y-3">
            <Link
              href="/login"
              className="block w-full text-center py-3 border border-white/20 font-sans text-xs uppercase tracking-widest text-white/70 hover:text-white hover:border-white/50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full text-center py-3 bg-white text-black font-sans text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          <div className="pt-2">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-white/40 mb-4">Legal</h4>
            <ul className="space-y-3">
              {LINKS.legal.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="font-sans text-sm text-white/60 hover:text-white transition-colors font-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-7">
          <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-white/40">Contact</h4>
          <ul className="space-y-5">
            <li className="flex gap-4 text-white/60">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
              <span className="font-sans text-sm font-light">Perth, WA 6000, Australia</span>
            </li>
            <li className="flex gap-4 text-white/60">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
              <span className="font-sans text-sm font-light">+61 400 123 456</span>
            </li>
            <li className="flex gap-4 text-white/60">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
              <span className="font-sans text-sm font-light">info@fitrahbeardoil.com.au</span>
            </li>
          </ul>
          {/* Newsletter mini */}
          <form onSubmit={(e) => e.preventDefault()} className="pt-2">
            <p className="font-sans text-xs text-white/40 uppercase tracking-widest mb-3">Get 10% off your first order</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="flex-1 bg-white/5 border border-white/10 px-4 py-3 font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors" required />
              <button type="submit" className="bg-white text-black px-5 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-colors">
                Go
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Fitrah Beard Oil Pty Ltd. ABN 00 000 000 000.
          </p>
          <p className="font-sans text-[11px] text-white/20 tracking-[0.2em] uppercase">
            Reviving the Sunnah — Perth, Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
