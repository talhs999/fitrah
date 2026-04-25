"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <main className="min-h-screen flex bg-[#faf9f6]">
      {/* Left — cinematic image panel */}
      <div className="hidden lg:flex flex-col justify-end w-[45%] relative overflow-hidden px-16 py-20">
        {/* Background image */}
        <Image
          src="/assets/Gemini_Generated_Image_fculq8fculq8fcul.png"
          alt="Fitrah lifestyle"
          fill
          unoptimized
          className="object-cover object-center"
          priority
        />
        {/* Heavy dark overlay */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Content over image */}
        <div className="relative z-10 space-y-6">
          <img
            src="/assets/white.png"
            alt="Fitrah"
            className="h-28 w-auto object-contain mb-4 -ml-2"
          />
          <p className="font-serif text-4xl text-white leading-snug">
            Welcome<br />
            <em className="font-light text-white/50 not-italic">back.</em>
          </p>
          <p className="font-sans text-sm text-white/50 font-light leading-relaxed max-w-xs">
            Sign in to track your orders, access your saved products, and enjoy a seamless experience.
          </p>
          <p className="font-sans text-[11px] text-white/25 tracking-widest uppercase pt-6 border-t border-white/10">
            Reviving the Sunnah — Perth, AU
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex flex-col items-center mb-10">
            <img
              src="/assets/Black.png"
              alt="Fitrah"
              className="h-20 w-auto object-contain"
            />
          </Link>
          <div className="mb-10">
            <h1 className="font-serif text-4xl text-brand-black mb-3">Welcome Back</h1>
            <p className="font-sans text-sm text-brand-muted">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold">Password</label>
                <Link href="#" className="font-sans text-[11px] text-brand-muted hover:text-brand-black transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full group inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-black transition-colors disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
            
            {errorMsg && <p className="text-red-500 font-sans text-xs mt-4 text-center">{errorMsg}</p>}
          </form>

          <p className="mt-8 text-center font-sans text-sm text-brand-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-black border-b border-brand-black pb-0.5 hover:text-brand-muted transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
