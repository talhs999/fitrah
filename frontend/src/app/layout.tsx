import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Fitrah Beard Oil — Lahore, Pakistan", template: "%s — Fitrah Beard Oil" },
  description:
    "Premium beard oils inspired by 1,400 years of prophetic tradition. Crafted with 100% natural cold-pressed oils. Free delivery over $80 across Pakistan.",
  keywords: ["beard oil", "natural beard oil", "Lahore", "Pakistan", "Islamic beard care", "organic beard oil"],
};

import WhatsAppButton from "@/components/WhatsAppButton";

import { CurrencyProvider } from "@/context/CurrencyContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-[#111111] font-sans">
        <CurrencyProvider>
          <CartProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}

