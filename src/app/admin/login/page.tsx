"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Invalid credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMsg("Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Authorized Access Only"
        title="Navya Grand Admin Portal"
        description="Sign in to manage menu items, orders, table reservations, banquet enquiries, and site content."
        breadcrumbs={[{ label: "Admin Login" }]}
      />

      <div className="max-w-md mx-auto px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 rounded-3xl border border-[#D4A143]/50 p-6 sm:p-8 shadow-lg space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#5E0B15] text-[#ECC572] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#3D050C]">
                Staff Sign In
              </h2>
              <p className="text-xs text-[#664941]">
                Session protected with HTTP-only cookie
              </p>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-maroon w-full py-3 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Sign In to Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
}

