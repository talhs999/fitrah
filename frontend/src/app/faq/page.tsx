"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    category: "Products",
    items: [
      { q: "Are Fitrah beard oils safe for sensitive skin?", a: "Yes. All Fitrah beard oils are formulated with 100% natural, plant-based ingredients and contain no parabens, sulphates, artificial fragrances, or mineral oil. If you have a known allergy to a specific botanical, please review the ingredient list on each product page before purchasing." },
      { q: "How long does one bottle last?", a: "One 30ml bottle of Fitrah Beard Oil typically lasts between 6–10 weeks with daily use, depending on your beard length and the amount applied. For shorter beards, expect closer to 10 weeks. For longer beards, approximately 6." },
      { q: "Can I use more than one Fitrah oil at the same time?", a: "Absolutely. Many of our customers layer Shaghaf (for hydration) with Ro'ab (for growth). Simply apply one in the morning and one at night. We recommend starting with one oil and adding a second after 2–3 weeks once your skin has adjusted." },
      { q: "Are the oils halal?", a: "Yes. All Fitrah Beard Oil products are 100% halal. We use only plant-derived ingredients with no animal-derived additives. Fitrah was founded on Islamic values and that extends to every aspect of how we formulate." },
      { q: "What is the difference between all 5 products?", a: "Each oil is engineered for a specific purpose: Shaghaf for hydration and frizz control, Ro'ab for follicle growth stimulation, Ad'Dawa for healing and itch relief, Qawwam for strength and density, and Muhafiz for protection from environmental damage." },
    ],
  },
  {
    category: "Shipping & Orders",
    items: [
      { q: "Where do you ship?", a: "We currently ship Pakistan-wide, with standard and express options available at checkout. We are working on international shipping and will announce when it becomes available." },
      { q: "How long does delivery take?", a: "Standard delivery within Lahore: 1–3 business days. Standard delivery to other Pakistani cities: 3–7 business days. Express delivery is available and typically arrives within 1–2 business days." },
      { q: "Do you offer free shipping?", a: "Yes. We offer free standard shipping on all orders over 80 in your selected currency. Orders under 80 incur a flat 8 shipping fee." },
      { q: "How do I track my order?", a: "Once your order is dispatched, you will receive an email with a tracking number. You can use this to track your parcel directly on the TCS or courier website." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of purchase. The product must be unused and in its original condition. Contact us on WhatsApp (+92 319 2801199) or email fitrahpk@gmail.com to arrange a return." },
      { q: "What if I receive a damaged or incorrect item?", a: "We sincerely apologise if this happens. Please contact us on WhatsApp (+92 319 2801199) or email fitrahpk@gmail.com with your order number and a photo of the item, and we will send a replacement at no cost within 24 hours." },
      { q: "Can I exchange a product?", a: "Yes. If you'd like to exchange one oil for another, please contact us within 30 days. We'll arrange the exchange once the original product is returned." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/8">
      <button
        className="w-full flex items-start justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans text-[15px] font-semibold text-brand-black">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" strokeWidth={1.5} />}
      </button>
      {open && (
        <p className="font-sans text-[14px] text-brand-muted font-light leading-relaxed pb-5 pr-8">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="bg-[#faf9f6] pt-20 min-h-screen">
      <div className="bg-white border-b border-black/8 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">Support</span>
          <h1 className="font-serif text-5xl md:text-6xl text-brand-black mb-4">Frequently Asked Questions</h1>
          <p className="font-sans text-[15px] text-brand-muted font-light">Everything you need to know about Fitrah products, shipping, and returns.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 space-y-16">
        {FAQS.map((section) => (
          <div key={section.category}>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold mb-6">{section.category}</h2>
            <div>
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
        <div className="pt-8 border-t border-black/8 text-center">
          <p className="font-sans text-[15px] text-brand-muted font-light mb-4">Still have a question?</p>
          <a href="/contact" className="font-sans text-sm font-bold text-brand-black border-b border-brand-black pb-0.5 hover:text-brand-muted hover:border-brand-muted transition-colors">
            Contact our team
          </a>
        </div>
      </div>
    </main>
  );
}
