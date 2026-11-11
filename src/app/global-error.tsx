"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[#FDF7EC] text-[#2B1410] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-[#D4A143] p-6 sm:p-8 text-center shadow-xl space-y-4">
          <h1 className="text-2xl font-bold text-[#5E0B15]">
            Navya Grand – Temporary Service Issue
          </h1>
          <p className="text-sm text-[#664941]">
            An unexpected server error occurred. Please try reloading the page.
          </p>
          {error?.digest && (
            <p className="text-xs font-mono text-[#8B1524]">
              Digest: {error.digest}
            </p>
          )}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="px-5 py-2.5 rounded-full bg-[#5E0B15] text-[#ECC572] text-sm font-semibold cursor-pointer"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#D4A143] text-[#36090E] text-sm font-bold"
            >
              Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

