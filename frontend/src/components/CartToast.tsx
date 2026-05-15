"use client";

import { useEffect } from "react";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

interface CartToastProps {
  show: boolean;
  productName: string;
  productImage: string;
  productPrice: number;
  onClose: () => void;
}

export default function CartToast({ show, productName, productImage, productPrice, onClose }: CartToastProps) {
  const { currency } = useCurrency();
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[999] w-[340px] bg-white shadow-2xl border border-black/8 overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between bg-brand-black px-4 py-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-white" strokeWidth={1.5} />
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white font-bold">Added to Cart</span>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Product Row */}
          <div className="flex items-center gap-4 p-4">
            <div className="w-16 h-20 relative bg-[#f0ece6] shrink-0">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-cover mix-blend-multiply"
                sizes="64px"
              />
            </div>
            <div className="flex-1">
              <p className="font-serif text-lg text-brand-black leading-tight">{productName}</p>
              <p className="font-sans text-sm text-brand-muted mt-1">${productPrice.toFixed(2)} {currency}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 border-t border-black/8">
            <button
              onClick={onClose}
              className="py-3 font-sans text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-black transition-colors font-semibold border-r border-black/8"
            >
              Continue Shopping
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="py-3 font-sans text-[10px] uppercase tracking-widest text-brand-black hover:bg-brand-black hover:text-white transition-colors font-bold flex items-center justify-center gap-2"
            >
              View Cart
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: "linear" }}
            className="h-0.5 bg-brand-black origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
