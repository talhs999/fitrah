"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, Shield, Truck, RotateCcw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import CartToast from "@/components/CartToast";
import { createClient } from "@/utils/supabase/client";
import { submitReview } from "./actions";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left focus:outline-none"
      >
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-brand-black">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-brand-muted" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-brand-muted" strokeWidth={1.5} />}
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pb-5 overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function ProductClient({ product, related, initialReviews }: { product: any, related: any[], initialReviews: any[] }) {
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, setQty: updateCartQty } = useCart();
  const { currency } = useCurrency();

  const allImages = [product.image, ...(product.gallery_images || [])];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product.id);
    if (qty > 1) {
      updateCartQty(product.id, qty);
    }
    setShowToast(true);
  };

  // Reviews State
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";


  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    
    setIsSubmittingReview(true);
    setReviewMessage("");

    const result = await submitReview({
      product_id: product.id,
      customer_name: reviewName,
      rating: reviewRating,
      review_text: reviewText
    });
    
    if (result.success === false) {
      setReviewMessage("Failed to submit review: " + result.error);
    } else {
      setReviews([result.data, ...reviews]);
      setReviewName("");
      setReviewText("");
      setReviewRating(5);
      setReviewMessage("Thank you! Your review has been published.");
    }
    
    setIsSubmittingReview(false);
  };

  return (
    <>
    <CartToast
      show={showToast}
      productName={product.name}
      productImage={product.image}
      productPrice={product.price * qty}
      onClose={() => setShowToast(false)}
    />
    <main className="bg-[#faf9f6] pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-black/8 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center gap-2 font-sans text-xs text-brand-muted uppercase tracking-widest">
          <Link href="/" className="hover:text-brand-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-black">{product.name}</span>
        </div>
      </div>

      {/* Main Product Split */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT: Image Gallery */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <div
            className="relative w-full aspect-square overflow-hidden group"
            style={{ backgroundColor: product.bg }}
          >
            <Image
              src={allImages[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover mix-blend-multiply transition-opacity duration-300"
              priority
            />
            <div
              className="absolute top-5 left-5 px-3 py-1.5"
              style={{ backgroundColor: product.accent || "#111" }}
            >
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-white">
                {product.purpose}
              </span>
            </div>

            {/* Slider Controls */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button 
                  onClick={handleNextImage} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-black' : 'bg-black/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* RIGHT: Details */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="space-y-8">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold">{product.purpose}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-brand-black leading-none tracking-tight mb-1">
              {product.name}
            </h1>
            <p className="font-serif text-2xl text-brand-muted font-light">{product.arabic}</p>
            <p className="font-sans text-sm text-brand-muted uppercase tracking-widest mt-3">{product.subtitle}</p>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? "fill-brand-gold text-brand-gold" : "fill-brand-muted/20 text-brand-muted/20"}`} />
              ))}
            </div>
            <span className="font-sans text-xs text-brand-muted">{averageRating} out of 5 ({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 border-y border-black/8 py-6">
            <span className="font-serif text-4xl text-brand-black">${product.price}</span>
            <span className="font-sans text-sm text-brand-muted uppercase tracking-widest">{currency}</span>
          </div>

          {/* Description */}
          <p className="font-sans text-sm text-brand-muted leading-relaxed">
            {product.description}
          </p>

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              {/* Qty */}
              <div className="flex items-center border border-black/20 w-32">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4 text-brand-muted hover:text-brand-black hover:bg-black/5 transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="flex-1 text-center font-sans text-sm font-semibold text-brand-black">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-4 text-brand-muted hover:text-brand-black hover:bg-black/5 transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.stock}
                className="flex-1 flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                {product.stock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <Shield className="w-5 h-5 mx-auto mb-2 text-brand-muted" strokeWidth={1.5} />
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted">Secure<br/>Checkout</p>
            </div>
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto mb-2 text-brand-muted" strokeWidth={1.5} />
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted">Fast<br/>Delivery</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 mx-auto mb-2 text-brand-muted" strokeWidth={1.5} />
              <p className="font-sans text-[10px] uppercase tracking-widest text-brand-muted">30-Day<br/>Returns</p>
            </div>
          </div>

          {/* Accordions */}
          <div className="pt-8">
            <Accordion title="Ingredients">
              <ul className="list-disc pl-4 space-y-2 font-sans text-sm text-brand-muted">
                {product.ingredients?.map((ing: string, i: number) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="How to Use">
              <p className="font-sans text-sm text-brand-muted leading-relaxed">
                {product.how_to_use}
              </p>
            </Accordion>
            <Accordion title="Scent & Size">
              <div className="space-y-4 font-sans text-sm text-brand-muted">
                <div>
                  <span className="font-bold text-brand-black">Scent Profile:</span><br/>
                  {product.scent}
                </div>
                <div>
                  <span className="font-bold text-brand-black">Volume:</span><br/>
                  {product.size}
                </div>
              </div>
            </Accordion>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white py-16 border-t border-black/10">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h2 className="font-serif text-3xl text-brand-black mb-10 text-center">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Reviews List */}
            <div className="space-y-8">
              {reviews.length === 0 ? (
                <p className="font-sans text-sm text-brand-muted italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-black/10 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-sm font-bold text-brand-black">{review.customer_name}</span>
                      <span className="font-sans text-[10px] text-brand-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-brand-gold text-brand-gold" : "fill-brand-muted/20 text-brand-muted/20"}`} />
                      ))}
                    </div>
                    <p className="font-sans text-sm text-brand-muted leading-relaxed">
                      {review.review_text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a Review Form */}
            <div className="bg-[#faf9f6] p-8 border border-black/5 rounded-sm h-fit">
              <h3 className="font-serif text-xl text-brand-black mb-6">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Your Name</label>
                  <input type="text" value={reviewName} onChange={e => setReviewName(e.target.value)} required placeholder="Muhammad Ali" className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewRating(star)} className="focus:outline-none">
                        <Star className={`w-6 h-6 ${star <= reviewRating ? "fill-brand-gold text-brand-gold" : "fill-brand-muted/20 text-brand-muted/20 hover:text-brand-gold"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Your Review</label>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required rows={4} placeholder="What did you like about this product?" className="w-full bg-white border border-black/10 px-4 py-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors resize-none"></textarea>
                </div>
                {reviewMessage && (
                  <p className={`font-sans text-xs ${reviewMessage.includes("Failed") ? "text-red-600" : "text-green-600"}`}>{reviewMessage}</p>
                )}
                <button type="submit" disabled={isSubmittingReview} className="w-full bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors disabled:opacity-50">
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {related && related.length > 0 && (
        <div className="bg-[#faf9f6] py-20 border-t border-black/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-black mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((item, index) => (
                <Link key={item.id} href={`/shop/${item.id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden mb-6" style={{ backgroundColor: item.bg || "#f4f4f4" }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <div className="text-center">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-muted font-bold block mb-2">
                      {item.purpose || item.category || "Product"}
                    </span>
                    <h3 className="font-serif text-2xl text-brand-black mb-1">{item.name}</h3>
                    <p className="font-sans text-sm text-brand-muted">${item.price} {currency}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
