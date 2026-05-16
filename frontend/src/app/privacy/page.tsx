export const metadata = { title: "Privacy Policy — Fitrah Beard Oil" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 py-10 border-b border-black/8">
      <h2 className="font-serif text-2xl text-brand-black">{title}</h2>
      <div className="font-sans text-[14px] text-brand-muted font-light leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="bg-[#faf9f6] pt-20 min-h-screen">
      <div className="bg-white border-b border-black/8 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">Legal</span>
          <h1 className="font-serif text-5xl md:text-6xl text-brand-black">Privacy Policy</h1>
          <p className="font-sans text-sm text-brand-muted mt-4">Last updated: April 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <Section title="1. Who We Are">
          <p>Fitrah Beard Oil Pty Ltd (&ldquo;Fitrah,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates fitrahbeardoil.com.au. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
        </Section>
        <Section title="2. Information We Collect">
          <p><strong>Personal information:</strong> Name, email address, shipping address, phone number, and payment information when you place an order.</p>
          <p><strong>Usage data:</strong> Browser type, IP address, pages visited, and referring URLs, collected via cookies and analytics tools.</p>
          <p><strong>Communications:</strong> Any messages you send us via our contact form or email.</p>
        </Section>
        <Section title="3. How We Use Your Information">
          <p>We use your information to: process and fulfil your orders; communicate about your order status; send promotional emails (if you have opted in); improve our website and products; comply with legal obligations.</p>
          <p>We will never sell your personal information to third parties.</p>
        </Section>
        <Section title="4. Data Storage & Security">
          <p>Your data is stored securely on Pakistani and international servers. We use industry-standard encryption and security protocols. Payment information is processed by our PCI-compliant payment provider and is never stored on our servers.</p>
        </Section>
        <Section title="5. Cookies">
          <p>We use cookies to improve your browsing experience, remember your preferences, and analyse website traffic. You can disable cookies in your browser settings, though some features may not function correctly as a result.</p>
        </Section>
        <Section title="6. Third Party Services">
          <p>We use the following third-party services: Shopify/Stripe (payment processing), TCS or Pakistan Post (shipping), Klaviyo (email marketing), and Google Analytics (website analytics). Each has their own privacy policy.</p>
        </Section>
        <Section title="7. Your Rights">
          <p>Under the Prevention of Electronic Crimes Act 2016, you have the right to access, correct, or delete your personal information. To exercise these rights, contact us at fitrahpk@gmail.com. We will respond within 30 days.</p>
        </Section>
        <Section title="8. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website. Continued use of our website after changes are posted constitutes acceptance of the updated policy.</p>
        </Section>
        <Section title="9. Contact Us">
          <p>For any privacy-related questions or requests, contact us at: fitrahpk@gmail.com or Fitrah Beard Oil, Lahore, Pakistan.</p>
        </Section>
      </div>
    </main>
  );
}
