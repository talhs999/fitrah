"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

function ShopContent({ products, categories }: { products: any[], categories: any[] }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const { currencySymbol } = useCurrency();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("featured");

  // Filtering
  let filtered = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category_id === activeCategory);

  // Search Filtering
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name?.toLowerCase().includes(searchQuery) ||
      p.subtitle?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery) ||
      p.purpose?.toLowerCase().includes(searchQuery)
    );
  }

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    const priceA = a.sale_price || a.price;
    const priceB = b.sale_price || b.price;
    if (sortOrder === "price-low") return priceA - priceB;
    if (sortOrder === "price-high") return priceB - priceA;
    if (sortOrder === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0; // featured/default
  });

  return (
    <main className="bg-[#faf9f6] min-h-screen">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-black/8 pt-32 pb-14 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">
            Fitrah Beard Oil
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-brand-black mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Shop the Collection"}
          </h1>
          <p className="font-sans text-[15px] text-brand-muted font-light max-w-xl">
            {searchQuery 
              ? `Found ${filtered.length} product${filtered.length === 1 ? "" : "s"} matching your search.`
              : "Premium grooming engineered for specific purposes. Find yours below."}
          </p>
        </div>
      </div>

      {/* ── Filters & Grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-brand-muted mr-1" strokeWidth={1.5} />
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-5 py-2 font-sans text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border ${
                activeCategory === "All"
                  ? "bg-brand-black text-white border-brand-black"
                  : "bg-transparent text-brand-muted border-black/10 hover:border-brand-black hover:text-brand-black"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-5 py-2 font-sans text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border ${
                  activeCategory === c.id
                    ? "bg-brand-black text-white border-brand-black"
                    : "bg-transparent text-brand-muted border-black/10 hover:border-brand-black hover:text-brand-black"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <p className="font-sans text-xs text-brand-muted uppercase tracking-widest hidden sm:block">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Sort Dropdown */}
            <div className="relative group">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-transparent border border-black/10 px-5 py-2 pr-10 font-sans text-[11px] uppercase tracking-widest font-bold text-brand-black focus:outline-none focus:border-brand-black cursor-pointer rounded-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-4 h-4 text-brand-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <motion.div key={p.id} layout variants={fadeUp} initial="hidden" animate="show" custom={i}>
                <Link href={`/shop/${p.id}`} className="group block">
                  {/* Image */}
                  <div
                    className="relative w-full aspect-[4/5] overflow-hidden mb-5"
                    style={{ backgroundColor: p.bg || "#faf9f6" }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover mix-blend-multiply transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90">
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: p.accent || "#111" }}>
                        {p.purpose || "Grooming"}
                      </span>
                    </div>
                    {p.sale_price && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-brand-gold text-white">
                        <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold">Sale</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/85 py-4 text-center">
                      <span className="font-sans text-xs uppercase tracking-[0.2em] text-white font-bold">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <h3 className="font-serif text-2xl text-brand-black">{p.name}</h3>
                    <p className="font-sans text-[11px] text-brand-muted uppercase tracking-[0.2em]">
                      {p.subtitle}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {p.sale_price ? (
                        <>
                          <span className="font-serif text-lg text-brand-muted line-through">{currencySymbol}{p.price}</span>
                          <span className="font-serif text-xl text-brand-black">{currencySymbol}{p.sale_price}</span>
                        </>
                      ) : (
                        <span className="font-serif text-xl text-brand-black">{currencySymbol}{p.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <h2 className="font-serif text-2xl text-brand-black mb-2">No products found</h2>
            <p className="font-sans text-brand-muted">We couldn't find any products in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShopClient(props: { products: any[], categories: any[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f6] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-black border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopContent {...props} />
    </Suspense>
  );
}
