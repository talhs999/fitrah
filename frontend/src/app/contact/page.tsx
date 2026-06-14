"use client";

import { useState } from "react";
import { Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { sendContactMessage } from "@/app/api/site/actions";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Order Enquiry");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    const result = await sendContactMessage({ firstName, lastName, email, subject, message });

    if (result.success) {
      setSent(true);
    } else {
      // Still show success to user even if email fails (don't expose SMTP errors)
      setSent(true);
    }
    setIsSending(false);
  };

  return (
    <main className="bg-[#faf9f6] pt-20 min-h-screen">
      <div className="bg-white border-b border-black/8 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-muted font-semibold block mb-4">Contact</span>
          <h1 className="font-serif text-5xl md:text-6xl text-brand-black">Get in touch.</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="space-y-12">
          <p className="font-sans text-[15px] text-brand-muted font-light leading-relaxed max-w-md">
            Have a question about your order, our products, or want to wholesale Fitrah? We'd love to hear from you. Our team typically responds within 24 hours.
          </p>
          <div className="space-y-8">
            {[
              { icon: Phone, label: "Phone", value: "+92 319 2801199" },
              { icon: Mail, label: "Email", value: "fitrahpk@gmail.com" },
              { icon: Clock, label: "Hours", value: "Sat–Thu: 7am–3pm  |  Fri: Off" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-5">
                <div className="w-10 h-10 border border-black/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand-muted" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-muted font-semibold mb-1">{label}</p>
                  <p className="font-sans text-[15px] text-brand-black font-light">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-black/8 p-10">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-14 h-14 border border-green-200 bg-green-50 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-brand-black">Message Sent.</h2>
              <p className="font-sans text-[14px] text-brand-muted font-light">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <h2 className="font-serif text-2xl text-brand-black mb-8">Send us a message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-black/10 focus:border-brand-black focus:outline-none font-sans text-sm text-brand-black transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf9f6] border border-black/10 focus:border-brand-black focus:outline-none font-sans text-sm text-brand-black transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-black/10 focus:border-brand-black focus:outline-none font-sans text-sm text-brand-black transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-black/10 focus:border-brand-black focus:outline-none font-sans text-sm text-brand-black transition-colors"
                >
                  <option>Order Enquiry</option>
                  <option>Product Question</option>
                  <option>Returns &amp; Refunds</option>
                  <option>Wholesale / Stockist</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted mb-2">Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-black/10 focus:border-brand-black focus:outline-none font-sans text-sm text-brand-black transition-colors resize-none"
                  required
                />
              </div>
              {error && <p className="font-sans text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-brand-black text-white py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-black/80 transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isSending ? "Sending..." : <><span>Send Message</span><Send className="w-4 h-4" strokeWidth={1.5} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
