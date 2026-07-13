"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Story", href: "/story" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount } = useCart();

  // Only homepage has a full-screen dark hero — all other pages have light backgrounds
  const isHeroPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll(); // run on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  // Light (cream) style = scrolled OR not on hero page
  const isLight = scrolled || !isHeroPage;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isLight
            ? "bg-[#faf9f6]/96 backdrop-blur-lg border-b border-black/8 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
          {/* Left Side (Hidden on mobile so logo goes left) */}
          <div className="hidden lg:flex flex-1 items-center">
            <nav className="flex items-center gap-10">
              {navLinks.slice(0, 2).map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-colors duration-300 ${
                    isLight
                      ? "text-brand-black/60 hover:text-brand-black"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logo (always perfectly centered) */}
          <Link href="/" className="flex-shrink-0 flex items-center justify-center">
            <img
              src={
                isLight
                  ? "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_assets/Black"
                  : "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_assets/white"
              }
              alt="Fitrah"
              className={`h-20 md:h-24 w-auto object-contain transition-all duration-300 ${
                isLight ? "scale-100" : "scale-[1.25]"
              }`}
            />
          </Link>

          {/* Right Side (Nav + Icons) */}
          <div className="flex-1 flex items-center justify-end gap-8">
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.slice(2).map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-colors duration-300 ${
                    isLight
                      ? "text-brand-black/60 hover:text-brand-black"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`transition-colors duration-300 ${
                  isLight ? "text-brand-black/50 hover:text-brand-black" : "text-white/70 hover:text-white"
                }`}
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              {/* Login / Account icon */}
              <Link
                href="/account"
                className={`transition-colors duration-300 ${
                  isLight ? "text-brand-black/50 hover:text-brand-black" : "text-white/70 hover:text-white"
                }`}
                aria-label="Account"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
              <Link
                href="/cart"
                className={`relative transition-colors duration-300 ${
                  isLight ? "text-brand-black/50 hover:text-brand-black" : "text-white/70 hover:text-white"
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {totalCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center font-sans transition-colors duration-300 ${
                      isLight ? "bg-brand-black text-white" : "bg-white text-black"
                    }`}
                  >
                    {totalCount > 9 ? "9+" : totalCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen(true)}
                className={`lg:hidden transition-colors duration-300 ${
                  isLight ? "text-brand-black/60 hover:text-brand-black" : "text-white/80 hover:text-white"
                }`}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10 bg-[#111]/90 backdrop-blur-lg overflow-hidden"
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const q = formData.get("q");
                  if (q) {
                    setSearchOpen(false);
                    router.push(`/shop?q=${encodeURIComponent(q.toString())}`);
                  }
                }}
                className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center gap-4"
              >
                <Search className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                <input
                  autoFocus
                  name="q"
                  type="search"
                  placeholder="Search products…"
                  className="flex-1 bg-transparent font-sans text-sm text-white placeholder:text-white/40 focus:outline-none py-2"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-white/50 hover:text-white">
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 w-80 z-50 bg-[#111] flex flex-col p-10"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end text-white/50 hover:text-white mb-12"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <nav className="flex flex-col gap-8">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-serif text-4xl text-white hover:text-white/60 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto space-y-4">
                <div className="flex gap-4 border-t border-white/10 pt-6">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-3 border border-white/20 font-sans text-xs uppercase tracking-widest text-white/70 hover:text-white hover:border-white/50 transition-colors"
                  >
                    Account
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-3 bg-white text-black font-sans text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
                <p className="font-sans text-xs text-white/30 tracking-widest uppercase">Lahore, Pakistan</p>
                <p className="font-sans text-xs text-white/20 tracking-widest uppercase">fitrahpk@gmail.com</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
