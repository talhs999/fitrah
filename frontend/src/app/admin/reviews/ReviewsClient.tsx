"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Trash2, Search, MessageSquare } from "lucide-react";
import { deleteReview } from "./actions";

export default function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    // Optimistic update
    const previousReviews = [...reviews];
    setReviews(reviews.filter(r => r.id !== id));
    
    const result = await deleteReview(id);
    
    if (!result.success) {
      alert("Failed to delete review: " + result.error);
      setReviews(previousReviews);
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.customer_name.toLowerCase().includes(search.toLowerCase()) || 
    r.review_text.toLowerCase().includes(search.toLowerCase()) ||
    r.products?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-brand-black mb-1">Customer Reviews</h1>
          <p className="font-sans text-sm text-brand-muted">Manage product reviews and feedback</p>
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-black/10 flex flex-col sm:flex-row gap-4 justify-between bg-[#faf9f6]">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Search reviews or products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black transition-colors"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-auto">
          {filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-brand-muted space-y-4 py-20">
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p className="font-sans text-sm">No reviews found.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-black/5 transition-colors">
                  
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full md:w-64 shrink-0">
                    <div className="w-12 h-12 bg-black/5 rounded-sm overflow-hidden relative shrink-0">
                      {review.products?.image && (
                        <Image 
                          src={review.products.image} 
                          alt={review.products.name} 
                          fill 
                          className="object-cover mix-blend-multiply" 
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-serif text-sm text-brand-black line-clamp-2">{review.products?.name || "Unknown Product"}</p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-sans text-sm font-bold text-brand-black mr-3">{review.customer_name}</span>
                        <span className="font-sans text-[10px] text-brand-muted uppercase tracking-widest">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="text-brand-muted hover:text-red-600 transition-colors p-2"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-brand-gold text-brand-gold" : "fill-brand-muted/20 text-brand-muted/20"}`} />
                      ))}
                    </div>
                    <p className="font-sans text-sm text-brand-muted leading-relaxed">
                      {review.review_text}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
