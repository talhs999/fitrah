"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Star, Check, Droplets, Shield, Leaf } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import GallerySlider from "@/components/GallerySlider";

/* ── HERO SLIDES: Custom Generated Cinematic Images ── */
const SLIDES = [
  {
    image: "/assets/hero_slide_1_beard_oil_1776964963587.png",
    eyebrow: "The Heritage",
    headline: ["Master Your", "Craft."],
    sub: "Premium beard oils crafted from prophetic wisdom and the finest organic ingredients. A legacy of purity.",
    cta: "Shop the Collection",
    ctaHref: "/shop",
  },
  {
    image: "/assets/Gemini_Generated_Image_jkg1ffjkg1ffjkg1.png",
    eyebrow: "The Reflection",
    headline: ["Stand Tall.", "Guard Your Legacy."],
    sub: "Five carefully engineered oils. Five powerful purposes. One unbreakable standard of quality.",
    cta: "Discover the Range",
    ctaHref: "/shop",
  },
  {
    image: "/assets/Gemini_Generated_Image_fculq8fculq8fcul.png",
    eyebrow: "The Ascent",
    headline: ["Every Drop", "Has a Purpose."],
    sub: "Where heritage meets luxury. Beard care for the man who knows his worth and honours his Sunnah.",
    cta: "Our Story",
    ctaHref: "/story",
  },
];

/* ── TRUST BADGES MARQUEE ── */
const MARQUEE_ITEMS = [
  "Cold-Pressed Oils",
  "100% Natural",
  "No Parabens",
  "No Silicones",
  "Free Shipping Over $80",
  "Made in Perth, AU",
  "Islamic Heritage Formula",
  "No Artificial Fragrances",
];

/* ── CAROUSEL HOOK ── */
function useCarousel(total: number, ms = 6000) {
  const [idx, setIdx] = useState(0);
  const safe = idx >= total ? 0 : idx;
  const next = useCallback(() => setIdx((p) => (p + 1) % total), [total]);
  useEffect(() => {
    const t = setInterval(next, ms);
    return () => clearInterval(t);
  }, [next, ms]);
  return { idx: safe, setIdx };
}

/* ── FADE-UP VARIANT ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

/* ── SECTION WRAPPER ── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const { idx, setIdx } = useCarousel(SLIDES.length, 7000);

  return (
    <main className="bg-[#faf9f6]">
      {/* ═══════════════════════════════════════════
          HERO CAROUSEL
      ═══════════════════════════════════════════ */}
      <div className="relative w-full h-screen overflow-hidden bg-[#111]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[idx].image}
              alt="Fitrah Hero"
              fill
              priority
              unoptimized={SLIDES[idx].image.startsWith('/api/media')}
              className="object-cover object-center"
            />
            {/* Gradient overlays — dark at top (for navbar) and bottom (for text) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/60" />
          </motion.div>
        </AnimatePresence>

        {/* Text — top-center aligned */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-40 md:pt-48 px-6 text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/70 mb-6">
                {SLIDES[idx].eyebrow}
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] tracking-tight mb-7 max-w-4xl">
                {SLIDES[idx].headline[0]} <br />
                <em className="not-italic font-light text-white/80">{SLIDES[idx].headline[1]}</em>
              </h1>
              <p className="font-sans text-base md:text-lg text-white/70 font-light max-w-xl leading-relaxed mb-10">
                {SLIDES[idx].sub}
              </p>
              <Link
                href={SLIDES[idx].ctaHref}
                className="group inline-flex items-center gap-3 bg-white text-black px-10 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-white/90 transition-all duration-300"
              >
                {SLIDES[idx].cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-[2px] transition-all duration-500 ${
                i === idx ? "w-12 bg-white" : "w-5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TRUST MARQUEE
      ═══════════════════════════════════════════ */}
      <div className="border-y border-black/8 py-4 bg-[#faf9f6] overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 mx-8 font-sans text-[11px] uppercase tracking-[0.25em] text-brand-black/60 font-semibold">
              {item}
              <span className="inline-block w-1 h-1 rounded-full bg-brand-black/20" />
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          VALUES
      ═══════════════════════════════════════════ */}
      <Section className="py-32 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div variants={fadeUp} custom={0} className="mb-20 max-w-2xl">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-5">
            Why Fitrah
          </span>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.15] text-brand-black">
            Every drop has a <em className="not-italic font-light text-brand-muted">purpose.</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-black/8 pt-16">
          {[
            { icon: Droplets, title: "Cold-Pressed Purity", desc: "We extract oils at low temperatures to preserve 100% of their natural nutrients, vitamins, and therapeutic properties. No heat. No compromise." },
            { icon: Shield, title: "Scientifically Formulated", desc: "Each blend is engineered for a specific beard need — hydration, growth, healing, strength, or protection — not generic one-size-fits-all." },
            { icon: Leaf, title: "Certified Natural", desc: "No parabens. No silicones. No artificial fragrances. No mineral oil. Just pure, organic, raw ingredients as nature and the Sunnah intended." },
          ].map((item, i) => (
            <motion.div key={item.title} variants={fadeUp} custom={i + 1} className="space-y-5">
              <div className="w-10 h-10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-brand-black" strokeWidth={1} />
              </div>
              <h3 className="font-serif text-2xl text-brand-black">{item.title}</h3>
              <p className="font-sans text-[15px] text-brand-muted font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          PRODUCT GRID — LATEST COLLECTION
      ═══════════════════════════════════════════ */}
      <Section className="py-32 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <motion.div variants={fadeUp} custom={0}>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">
                The Collection
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight text-brand-black">
                Latest <em className="not-italic font-light text-brand-muted">Arrivals</em>
              </h2>
              <p className="font-sans text-[15px] text-brand-muted font-light mt-4 max-w-md leading-relaxed">
                Five purposeful oils. Each crafted for a specific need. All made with 100% natural ingredients.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="shrink-0">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-black transition-colors"
              >
                Shop All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Product Cards — auto renders all products from products.ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.div key={p.id} variants={fadeUp} custom={i * 0.4}>
                <div className="group block h-full">
                  {/* Image */}
                  <Link href={`/shop/${p.id}`}>
                    <div
                      className="relative w-full aspect-[3/4] overflow-hidden mb-4"
                      style={{ backgroundColor: p.bg }}
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      />
                      {/* Purpose Tag */}
                      <div className="absolute top-3 left-3 px-2.5 py-1" style={{ backgroundColor: p.accent }}>
                        <span className="font-sans text-[8px] uppercase tracking-[0.2em] font-bold text-white">
                          {p.purpose}
                        </span>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-brand-black py-3 text-center">
                        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white font-bold">
                          View Product →
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="px-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/shop/${p.id}`}>
                          <h3 className="font-serif text-lg text-brand-black group-hover:text-brand-muted transition-colors leading-tight">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="font-sans text-[10px] text-brand-muted uppercase tracking-widest mt-0.5">{p.subtitle}</p>
                      </div>
                      <span className="font-sans text-sm font-semibold text-brand-black shrink-0">${p.price}</span>
                    </div>
                    <Link
                      href={`/shop/${p.id}`}
                      className="mt-3 w-full block text-center border border-black/20 py-2.5 font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-brand-black hover:bg-brand-black hover:text-white hover:border-brand-black transition-all duration-200"
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════
          EDITORIAL STORY SECTION
      ═══════════════════════════════════════════ */}
      <Section className="py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={fadeUp} custom={0} className="relative h-[500px] md:h-[680px] grid grid-rows-2 gap-3">
            {/* Top: barber applying beard oil (user image) */}
            <div className="relative overflow-hidden">
              <Image
                src="/assets/Gemini_Generated_Image_p072udp072udp072.png"
                alt="Fitrah beard oil application"
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/15" />
            </div>
            {/* Bottom: Fitrah product (user image) */}
            <div className="relative overflow-hidden">
              <Image
                src="/assets/Gemini_Generated_Image_pcsrkppcsrkppcsr.png"
                alt="Fitrah premium beard oil"
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                unoptimized
                className="object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm px-5 py-4 inline-block border-l-2 border-[#c8a45e]">
                  <p className="font-serif text-base text-white">
                    &ldquo;The beard is a crown upon the face of a believer.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="space-y-9 max-w-lg">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-5">
                Our Story
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.2] text-brand-black">
                Honouring the past. <br />
                <em className="not-italic font-light text-brand-muted">Perfecting the present.</em>
              </h2>
            </div>
            <p className="font-sans text-[15px] text-brand-muted font-light leading-relaxed">
              The beard is not simply facial hair. For 1,400 years, it has been a symbol of dignity, a mark of identity, and a sign of devotion. Fitrah was born in Perth, Australia, from the belief that this tradition deserved an equally dignified product.
            </p>
            <p className="font-sans text-[15px] text-brand-muted font-light leading-relaxed">
              We source only the purest cold-pressed oils. We handpick organic botanicals. We craft every blend to serve a specific purpose. Not because it is easy — but because your beard and your heritage deserve nothing less than perfection.
            </p>
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-black/8">
              {[["5", "Products"], ["100%", "Natural"], ["AU", "Made"]].map(([n, l]) => (
                <div key={l} className="space-y-1">
                  <p className="font-serif text-3xl text-brand-black">{n}</p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-muted font-semibold">{l}</p>
                </div>
              ))}
            </div>
            <Link href="/story" className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-black text-white font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-black transition-colors">
              Read Our Full Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          SHOP BY PURPOSE / CATEGORY SECTION
      ═══════════════════════════════════════════ */}
      <Section className="py-28 px-6 md:px-10 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.span variants={fadeUp} custom={0} className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">
              Shop by Purpose
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-5xl text-brand-black">
              Find your <em className="not-italic font-light text-brand-muted">perfect formula.</em>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="font-sans text-[15px] text-brand-muted font-light mt-4 max-w-lg mx-auto leading-relaxed">
              Each oil targets a different need. Choose by what your beard requires most.
            </motion.p>
          </div>

          {/* Category Cards — one per product/purpose, auto-generated, 3 per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((p, i) => (
              <motion.div key={p.id} variants={fadeUp} custom={i * 0.3}>
                <Link
                  href={`/shop/${p.id}`}
                  className="group relative flex flex-col overflow-hidden border border-black/8 hover:border-black/20 transition-all duration-500 hover:shadow-2xl"
                  style={{ backgroundColor: p.bg }}
                >
                  <div className="h-1.5 w-full" style={{ backgroundColor: p.accent }} />
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  </div>
                  <div className="p-7 flex flex-col gap-3 bg-white flex-1">
                    <div className="inline-flex self-start px-3 py-1.5 text-[9px] font-sans uppercase tracking-[0.25em] font-bold text-white" style={{ backgroundColor: p.accent }}>
                      {p.purpose}
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl text-brand-black leading-tight">{p.name}</h3>
                      <p className="font-sans text-sm text-brand-muted font-light mt-1 tracking-wide">{p.subtitle}</p>
                    </div>
                    <p className="font-sans text-sm text-brand-muted/70 font-light leading-relaxed line-clamp-2">{p.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/8">
                      <span className="font-sans text-xl font-bold text-brand-black">${p.price}<span className="text-xs font-normal text-brand-muted ml-1">AUD</span></span>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-brand-muted group-hover:text-brand-black transition-colors font-bold flex items-center gap-1.5">
                        Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          BENEFITS LIST
      ═══════════════════════════════════════════ */}
      <Section className="py-32 px-6 md:px-10 bg-[#111] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div variants={fadeUp} custom={0} className="lg:sticky lg:top-28">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold block mb-5">
                The Benefits
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.2] text-white">
                A legacy that <br />
                <em className="not-italic font-light text-white/50">transforms.</em>
              </h2>
              <div className="mt-14">
                <Link href="/shop" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-white/90 transition-colors">
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <div className="space-y-0">
              {[
                "Promotes thick, healthy, natural beard growth",
                "Eliminates dryness, flaking, and beardruff",
                "Softens and tames coarse, wiry beard hair",
                "Moisturises skin underneath the beard",
                "Provides UV & environmental protection",
                "Delivers a natural, non-greasy, subtle shine",
                "Reduces beard itch and irritation",
                "Strengthens follicles to minimise breakage",
              ].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  variants={fadeUp}
                  custom={i * 0.4}
                  className="flex items-center gap-5 py-5 border-b border-white/8"
                >
                  <Check className="w-4 h-4 text-white/40 shrink-0" strokeWidth={1.5} />
                  <p className="font-sans text-[15px] text-white/70 font-light">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          LIFESTYLE SLIDER GALLERY — with nav buttons
      ═══════════════════════════════════════════ */}
      <GallerySlider />

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <Section className="py-32 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-20">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">
              Customer Reviews
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-black">What brothers say.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Ahmed K.", location: "Perth, WA", product: "Shaghaf", rating: 5, text: "This is genuinely the best beard oil I've ever used. The hydration lasts all day without any greasy residue. The scent is incredible — subtle, warm, and masculine." },
              { name: "Omar S.", location: "Sydney, NSW", product: "Qawwam", rating: 5, text: "Qawwam transformed my beard within 3 weeks. Noticeably thicker and stronger. I've tried every premium brand out there. Nothing compares to Fitrah's quality." },
              { name: "Bilal R.", location: "Melbourne, VIC", product: "Ad'Dawa", rating: 5, text: "I had chronic beard itch and beardruff for years. Ad'Dawa cleared it completely in 10 days. The fact that it's all-natural made it even better. A customer for life." },
            ].map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i} className="bg-[#faf9f6] p-8 space-y-5">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="font-serif text-xl leading-relaxed text-brand-black">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-4 border-t border-black/8">
                  <p className="font-sans text-sm font-semibold text-brand-black">{t.name}</p>
                  <p className="font-sans text-xs text-brand-muted mt-0.5">{t.location} — {t.product}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          VIDEO COLLAGE SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 bg-[#0c0c0c] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold block mb-4">The Fitrah Experience</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
              See it in <em className="not-italic font-light text-white/40">action.</em>
            </h2>
          </div>

          {/* 4-video mosaic grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[520px] md:h-[620px]">
            {[
              "/videos/video-1.mp4",
              "/videos/video-2.mp4",
              "/videos/video-3.mp4",
              "/videos/video-4.mp4",
            ].map((path, i) => (
              <div key={i} className="relative overflow-hidden group">
                <video
                  src={path}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dark overlay — lifts on hover */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-black py-32 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold block">
            Limited Time Offer
          </span>
          <h2 className="font-serif text-5xl md:text-6xl text-white leading-[1.1]">
            Get 10% off <br />
            <em className="not-italic font-light text-white/60">your first order.</em>
          </h2>
          <p className="font-sans text-[15px] text-white/60 font-light max-w-lg mx-auto">
            Subscribe to the Fitrah newsletter and receive an exclusive discount code instantly, plus early access to new product launches.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/8 border border-white/15 px-5 py-4 font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
              required
            />
            <button type="submit" className="bg-white text-black px-8 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-white/90 transition-colors whitespace-nowrap">
              Claim Discount
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
