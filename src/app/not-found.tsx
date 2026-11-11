import React from "react";
import Link from "next/link";
import { Home, UtensilsCrossed } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[65dvh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white/95 rounded-3xl border border-[#D4A143]/50 p-6 sm:p-10 text-center shadow-md space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] font-bold text-[#8B1524]">
          404 • Page Not Found
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3D050C]">
          We couldn&apos;t find that page
        </h1>
        <p className="text-sm text-[#664941]">
          The page you requested may have moved. Explore our menu, banquet hall,
          or return to the Navya Grand homepage.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-maroon inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            <Home className="w-4 h-4 text-[#ECC572]" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/menu"
            className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Explore Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

