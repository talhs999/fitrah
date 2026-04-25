"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Registration successful! Please check your email to verify your account.");
      setName("");
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex bg-[#faf9f6]">
      {/* Left — cinematic image panel */}
      <div className="hidden lg:flex flex-col justify-end w-[45%] relative overflow-hidden px-16 py-20">
        {/* Background image */}
        <Image
          src="/api/media?path=C%3A%5CUsers%5CIQRA%20TRADERS%5CDesktop%5CFitrah%20Website%5CGemini_Generated_Image_jkg1ffjkg1ffjkg1.png"
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
            src="/api/media?path=C%3A%5CUsers%5CIQRA%20TRADERS%5CDesktop%5CFitrah%20Website%5Clogos%20new%5Cwhite.png"
            alt="Fitrah"
            className="h-28 w-auto object-contain mb-4 -ml-2"
          />
          <p className="font-serif text-4xl text-white leading-snug">
            Join the<br />
            <em className="font-light text-white/50 not-italic">brotherhood.</em>
          </p>
          <p className="font-sans text-sm text-white/50 font-light leading-relaxed max-w-xs">
            Create your Fitrah account to track orders, save favourites, and unlock exclusive member benefits.
          </p>
          <p className="font-sans text-[11px] text-white/25 tracking-widest uppercase pt-6 border-t border-white/10">
            Reviving the Sunnah — Perth, AU
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="font-serif text-4xl text-brand-black mb-3">Create Account</h1>
            <p className="font-sans text-sm text-brand-muted">Join the Fitrah brotherhood. It&apos;s free.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-7">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Full Name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Ali" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com" required
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters" required minLength={6}
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-sm text-brand-black placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full group inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-black transition-colors disabled:opacity-50 mt-2">
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
            
            {errorMsg && <p className="text-red-500 font-sans text-xs mt-4 text-center">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 font-sans text-xs mt-4 text-center">{successMsg}</p>}
          </form>

          <p className="mt-8 text-center font-sans text-sm text-brand-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-black border-b border-brand-black pb-0.5 hover:text-brand-muted transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
