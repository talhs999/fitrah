export const metadata = { title: "Terms & Conditions — Fitrah Beard Oil" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 py-10 border-b border-black/8">
      <h2 className="font-serif text-2xl text-brand-black">{title}</h2>
      <div className="font-sans text-[14px] text-brand-muted font-light leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-[#faf9f6] pt-20 min-h-screen">
      <div className="bg-white border-b border-black/8 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">Legal</span>
          <h1 className="font-serif text-5xl md:text-6xl text-brand-black">Terms & Conditions</h1>
          <p className="font-sans text-sm text-brand-muted mt-4">Last updated: April 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <Section title="1. Agreement to Terms">
          <p>By accessing and using the Fitrah Beard Oil website (fitrahbeardoil.com.au), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.</p>
        </Section>
        <Section title="2. Products & Pricing">
          <p>All prices are listed in your selected currency and include GST where applicable. We reserve the right to change prices at any time without notice. Prices displayed at the time of your order will be honoured.</p>
          <p>We do our best to ensure product descriptions are accurate, but do not warrant that all descriptions, images, or other content are error-free.</p>
        </Section>
        <Section title="3. Orders & Payment">
          <p>By placing an order, you confirm that all information provided is accurate and complete. We accept payment via credit card, debit card, and PayPal through our secure payment gateway.</p>
          <p>We reserve the right to cancel or refuse any order for any reason, including suspected fraud or pricing errors.</p>
        </Section>
        <Section title="4. Shipping & Delivery">
          <p>We ship Australia-wide. Standard delivery takes 3–7 business days. Express delivery takes 1–2 business days. Shipping fees are calculated at checkout. Free shipping applies to orders over 80 in your selected currency.</p>
          <p>We are not responsible for delays caused by Australia Post or other courier services beyond our control.</p>
        </Section>
        <Section title="5. Returns & Refunds">
          <p>We accept returns within 30 days of purchase if the product is unused and in its original condition. To initiate a return, contact us at returns@fitrahbeardoil.com.au.</p>
          <p>Refunds are processed within 5–10 business days once we receive the returned product. Shipping costs are non-refundable unless the return is due to our error.</p>
        </Section>
        <Section title="6. Intellectual Property">
          <p>All content on this website, including text, images, logos, and product descriptions, is the intellectual property of Fitrah Beard Oil Pty Ltd. Reproduction without written permission is strictly prohibited.</p>
        </Section>
        <Section title="7. Limitation of Liability">
          <p>Fitrah Beard Oil Pty Ltd is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the product in question.</p>
        </Section>
        <Section title="8. Governing Law">
          <p>These Terms are governed by the laws of Western Australia, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of Western Australia.</p>
        </Section>
        <Section title="9. Contact">
          <p>For any questions regarding these Terms, please contact us at legal@fitrahbeardoil.com.au or write to us at: Fitrah Beard Oil Pty Ltd, Perth, WA 6000, Australia.</p>
        </Section>
      </div>
    </main>
  );
}
