"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[65dvh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white/95 rounded-3xl border-2 border-[#D4A143]/50 p-6 sm:p-8 text-center shadow-lg space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#5E0B15] text-[#ECC572] flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3D050C]">
          Something went wrong
        </h1>
        <p className="text-sm text-[#664941]">
          We encountered an unexpected error loading this section. Please try
          refreshing or return to the homepage.
        </p>
        {error?.digest && (
          <p className="text-xs font-mono text-[#8B1524]">
            Reference: {error.digest}
          </p>
        )}
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-maroon inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#ECC572]" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

