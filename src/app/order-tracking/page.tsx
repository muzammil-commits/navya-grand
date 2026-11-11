"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  XCircle,
} from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import type { Order, OrderStatus } from "@/lib/types";

const DELIVERY_STEPS: OrderStatus[] = [
  "Order Placed",
  "Order Accepted",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

const TAKEAWAY_STEPS: OrderStatus[] = [
  "Order Placed",
  "Order Accepted",
  "Preparing",
  "Ready for Pickup",
  "Delivered",
];

function OrderTrackingInner() {
  const searchParams = useSearchParams();
  const [orderRef, setOrderRef] = useState(searchParams.get("ref") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchOrder = useCallback(async (refVal: string, phoneVal: string) => {
    if (!refVal.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(refVal.trim())}?phone=${encodeURIComponent(
          phoneVal.trim()
        )}`
      );
      const data = await res.json();
      if (!res.ok) {
        setOrder(null);
        setErrorMsg(data.error || "Order not found.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setErrorMsg("Unable to fetch order status right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const refParam = searchParams.get("ref");
    const phoneParam = searchParams.get("phone");
    if (refParam && phoneParam) {
      fetchOrder(refParam, phoneParam);
    }
  }, [searchParams, fetchOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderRef, phone);
  };

  const steps =
    order?.orderType === "takeaway" ? TAKEAWAY_STEPS : DELIVERY_STEPS;
  const currentIndex = order ? steps.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-8 sm:py-12 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 shadow-sm space-y-4"
      >
        <h2 className="font-display text-xl font-bold text-[#3D050C]">
          Look Up Your Order
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
              Order Reference *
            </label>
            <input
              type="text"
              required
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="e.g., NG-261111-A4F2"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile used at checkout"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-maroon px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-[#ECC572]" />
          )}
          <span>Check Live Status</span>
        </button>
      </form>

      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {order && (
        <div className="bg-white/95 rounded-3xl border-2 border-[#D4A143]/55 p-5 sm:p-7 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4A143]/25 pb-4">
            <div>
              <p className="text-xs uppercase font-bold text-[#8B1524]">
                Order Reference
              </p>
              <h3 className="font-mono text-xl font-bold text-[#3D050C]">
                {order.orderRef}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span
                className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold ${
                  order.orderStatus === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : order.orderStatus === "Delivered"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-[#5E0B15] text-[#ECC572]"
                }`}
              >
                {order.orderStatus}
              </span>
              <p className="text-xs text-[#664941] mt-1 capitalize">
                Payment: {order.paymentStatus.replace("_", " ")} (
                {order.paymentMethod.toUpperCase()})
              </p>
            </div>
          </div>

          {order.orderStatus === "Cancelled" ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">This order was cancelled.</p>
                <p className="text-xs">
                  Please contact +91 8500212200 if you need assistance.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs uppercase font-bold tracking-wider text-[#8B1524]">
                Live Kitchen &amp; Dispatch Progress
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {steps.map((step, idx) => {
                  const done = idx <= currentIndex;
                  const icons = [Clock, CheckCircle2, ChefHat, order.orderType === "takeaway" ? PackageCheck : Bike, CheckCircle2];
                  const StepIcon = icons[idx] || CheckCircle2;
                  return (
                    <div
                      key={step}
                      className={`p-3 rounded-2xl border text-center flex sm:flex-col items-center gap-2.5 sm:gap-1.5 ${
                        done
                          ? "bg-[#5E0B15] text-[#ECC572] border-[#5E0B15]"
                          : "bg-[#FDF7EC] text-[#664941] border-[#D4A143]/30"
                      }`}
                    >
                      <StepIcon className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-semibold leading-tight">
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-display text-lg font-bold text-[#3D050C]">
              Items Summary
            </h4>
            <div className="divide-y divide-[#D4A143]/20 border rounded-2xl border-[#D4A143]/30">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 flex items-center justify-between text-sm"
                >
                  <span>
                    {item.quantity} × {item.name}
                    {item.variantLabel ? ` (${item.variantLabel})` : ""}
                  </span>
                  <span className="font-semibold text-[#5E0B15]">
                    ₹{item.lineTotal}
                  </span>
                </div>
              ))}
              <div className="px-4 py-3 bg-[#FDF7EC] flex justify-between font-bold text-[#5E0B15]">
                <span>Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <div>
      <PageHeaderBanner
        eyebrow="Live Order Status"
        title="Track Your Order"
        description="Enter your Navya Grand order reference and mobile number to check real-time kitchen and delivery updates."
        breadcrumbs={[{ label: "Order Tracking" }]}
      />
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <OrderTrackingInner />
      </Suspense>
    </div>
  );
}

