"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/1",
  "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/2",
  "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/3",
  "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/4",
  "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/5",
  "https://res.cloudinary.com/em5hu05n/image/upload/f_auto,q_auto/v1/fitrah_gallery/6",
];

const LOOP_IMAGES = [...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES];

const CARD_WIDTH = 420;
const GAP = 16;
const STEP = CARD_WIDTH + GAP;

export default function GallerySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const startX = GALLERY_IMAGES.length * STEP;
    el.scrollLeft = startX;
    posRef.current = startX;
  }, []);

  const animate = useCallback(() => {
    if (isPaused) return;
    const el = scrollRef.current;
    if (!el) return;

    posRef.current += 0.6;

    const singleSetWidth = GALLERY_IMAGES.length * STEP;
    if (posRef.current >= singleSetWidth * 2) {
      posRef.current = singleSetWidth;
    }

    el.scrollLeft = posRef.current;
    animRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  const scrollManual = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -STEP : STEP;
    posRef.current += amount;

    const singleSetWidth = GALLERY_IMAGES.length * STEP;
    if (posRef.current < singleSetWidth) posRef.current = singleSetWidth;
    if (posRef.current >= singleSetWidth * 2) posRef.current = singleSetWidth;

    el.scrollTo({ left: posRef.current, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white border-b border-black/8">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-2">Gallery</span>
        <h2 className="font-serif text-3xl md:text-4xl text-brand-black">The Fitrah Lifestyle</h2>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          onClick={() => scrollManual("left")}
          aria-label="Scroll left"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-black/15 flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-white transition-all duration-200 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <button
          onClick={() => scrollManual("right")}
          aria-label="Scroll right"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-black/15 flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-white transition-all duration-200 shadow-lg"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 px-6 md:px-10 overflow-x-scroll pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            userSelect: "none",
          } as React.CSSProperties}
        >
          {LOOP_IMAGES.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] md:w-[420px] h-[360px] md:h-[540px] relative group overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Fitrah lifestyle ${(i % GALLERY_IMAGES.length) + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
