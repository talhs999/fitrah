import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Our Story — Fitrah Beard Oil" };

export default function StoryPage() {
  return (
    <main className="bg-[#faf9f6] pt-20">
      {/* Header */}
      <div className="bg-[#111] text-white pt-32 pb-24 px-6 md:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 max-w-xl relative z-10">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold block mb-6">Our Story</span>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight mb-8">
              Honouring 1,400 <br />
              <em className="not-italic font-light text-white/50">years of heritage.</em>
            </h1>
            <p className="font-sans text-lg text-white/60 font-light leading-relaxed mb-8">
              Fitrah was born from a simple conviction — that the Sunnah of keeping a beard deserves a product of extraordinary quality.
            </p>
          </div>
          
          {/* Right Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-6 relative z-10">
             {/* Card 1: Product Image */}
             <div className="relative aspect-[4/5] bg-white/5 rounded-sm overflow-hidden flex flex-col justify-center items-center p-6 border border-white/10 group">
                <span className="font-serif text-4xl tracking-widest text-white uppercase">FITRAH</span>
             </div>
             
             {/* Card 2: Logo */}
             <div className="relative aspect-[4/5] bg-[#1a1a1a] rounded-sm overflow-hidden flex items-center justify-center p-8 border border-white/10 translate-y-6 md:translate-y-10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <img
                  src="/assets/white.png"
                  alt="Fitrah Logo"
                  className="w-full h-auto object-contain opacity-90 transition-transform duration-700 group-hover:scale-110 relative z-10"
                />
             </div>
          </div>
        </div>
      </div>

      {/* Story Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 space-y-20">
        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] bg-[#e8e3d8] overflow-hidden">
            <Image src="/assets/brand-story.png" alt="Brand Story" fill className="object-cover opacity-80" />
          </div>
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-black leading-tight">
              Where it began.
            </h2>
            <p className="font-sans text-[15px] text-brand-muted font-light leading-relaxed">
              We grew up understanding the beard as more than a trend. It is a sign of dignity, a prophetic tradition, and for 1,400 years — a mark of the believing man. The problem we faced was simple: every beard oil on the market was generic, chemical-laden, or dishonest about its ingredients.
            </p>
            <p className="font-sans text-[15px] text-brand-muted font-light leading-relaxed">
              So in Perth, Australia, we set out to fix that. We spent two years researching ancient remedies, consulting herbalists, and sourcing the purest cold-pressed oils on earth. Fitrah is the result.
            </p>
          </div>
        </div>

        {/* Pull Quote */}
        <div className="border-l-2 border-brand-black pl-8 py-4">
          <p className="font-serif text-2xl md:text-3xl text-brand-black leading-relaxed">
            &ldquo;The name Fitrah means the natural disposition — the innate, pure state that every human is born with. We believe that caring for your beard is an act of returning to that purity.&rdquo;
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-black">Our commitment.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Zero Compromise Ingredients", desc: "Every oil we use is cold-pressed, unrefined, and sourced from certified organic farms. We will never use mineral oil, synthetic fragrance, or silicones." },
              { title: "Purpose-Driven Formulas", desc: "Each Fitrah blend is engineered for one specific beard need. We don't believe in one-size-fits-all — we believe in targeted, effective solutions." },
              { title: "Traceable Sourcing", desc: "We know exactly where every ingredient comes from. Argan oil from Morocco. Jojoba from Arizona. Black seed from Egypt. Transparency is non-negotiable." },
              { title: "Made in Perth, Australia", desc: "Every bottle of Fitrah is formulated and bottled in Perth, WA. We are proud to be an Australian-owned, Muslim-founded business." },
            ].map((item) => (
              <div key={item.title} className="space-y-3 p-6 bg-white border border-black/8">
                <h3 className="font-serif text-xl text-brand-black">{item.title}</h3>
                <p className="font-sans text-[14px] text-brand-muted font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-black/8">
          <p className="font-sans text-[15px] text-brand-muted font-light mb-8">
            Ready to experience the Fitrah difference?
          </p>
          <Link href="/shop" className="group inline-flex items-center gap-3 bg-brand-black text-white px-10 py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors">
            Shop the Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
