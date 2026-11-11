"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bike,
  Store,
  Wallet,
  QrCode,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ContactInfo, DeliveryConfig, Order, OrderType, PaymentMethod } from "@/lib/types";
import { VegBadge } from "./VegBadge";

interface CheckoutClientProps {
  deliveryConfig: DeliveryConfig;
  contact: ContactInfo;
}

export function CheckoutClient({ deliveryConfig, contact }: CheckoutClientProps) {
  const { items, subtotal, hydrated, clearCart } = useCart();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city] = useState(deliveryConfig.supportedCity || "Guntur");
  const [pincode, setPincode] = useState(
    deliveryConfig.supportedPincodes[6] || deliveryConfig.supportedPincodes[0] || "522007"
  );
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentRef, setPaymentRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleOrderTypeChange = (nextType: OrderType) => {
    setOrderType(nextType);
    if (nextType === "takeaway" && paymentMethod === "cod") {
      setPaymentMethod("pickup");
    } else if (nextType === "delivery" && paymentMethod === "pickup") {
      setPaymentMethod("cod");
    }
  };

  const deliveryCharge =
    orderType === "delivery" && subtotal < deliveryConfig.freeDeliveryAbove
      ? deliveryConfig.deliveryFee
      : 0;
  const taxAmount =
    Math.round(((subtotal * deliveryConfig.taxRatePercent) / 100) * 100) / 100;
  const grandTotal =
    Math.round((subtotal + deliveryCharge + taxAmount) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          orderType,
          address,
          landmark,
          city,
          pincode,
          instructions,
          paymentMethod,
          paymentRef,
          items: items.map((i) => ({
            productId: i.productId,
            variantLabel: i.variantLabel,
            quantity: i.quantity,
            instructions: i.instructions,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to place order.");
      } else {
        setConfirmedOrder(data.order);
        clearCart();
      }
    } catch {
      setErrorMsg("Network error while creating your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        <div className="bg-white/95 rounded-3xl border-2 border-[#D4A143]/60 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <CheckCircle2 className="w-14 h-14 text-emerald-700 mx-auto" />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8B1524]">
              Order Created
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D050C]">
              Thank You, {confirmedOrder.customerName}!
            </h2>
            <p className="text-sm text-[#664941]">
              Order Reference:{" "}
              <span className="font-mono font-bold text-[#5E0B15]">
                {confirmedOrder.orderRef}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FDF7EC] rounded-2xl p-4 border border-[#D4A143]/35 text-sm">
            <div>
              <p className="text-xs uppercase font-bold text-[#8B1524]">
                Order Status
              </p>
              <p className="font-semibold text-[#3D050C] mt-0.5">
                {confirmedOrder.orderStatus}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#8B1524]">
                Payment Status
              </p>
              <p className="font-semibold text-[#3D050C] mt-0.5 capitalize">
                {confirmedOrder.paymentStatus.replace("_", " ")} (
                {confirmedOrder.paymentMethod.toUpperCase()})
              </p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#8B1524]">
                Fulfillment
              </p>
              <p className="text-[#3D050C] mt-0.5">
                {confirmedOrder.orderType === "delivery"
                  ? `Delivery to ${confirmedOrder.address}, ${confirmedOrder.city} – ${confirmedOrder.pincode}`
                  : `Takeaway Counter (${contact.addressLine1}, ${contact.addressLine2})`}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#8B1524]">
                Estimated Preparation
              </p>
              <p className="text-[#3D050C] mt-0.5">
                {confirmedOrder.estimatedTime}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-[#3D050C]">
              Ordered Dishes
            </h3>
            <div className="divide-y divide-[#D4A143]/20 border rounded-2xl border-[#D4A143]/30 bg-white">
              {confirmedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-semibold text-[#3D050C]">
                      {item.quantity} × {item.name}
                    </span>
                    {item.variantLabel && (
                      <span className="text-xs text-[#664941] ml-1.5">
                        ({item.variantLabel})
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-[#5E0B15]">
                    ₹{item.lineTotal}
                  </span>
                </div>
              ))}
              <div className="px-4 py-3 bg-[#FDF7EC] flex items-center justify-between font-bold text-[#5E0B15]">
                <span>Total Payable</span>
                <span className="text-lg">₹{confirmedOrder.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href={`/order-tracking?ref=${encodeURIComponent(
                confirmedOrder.orderRef
              )}&phone=${encodeURIComponent(confirmedOrder.phone)}`}
              className="btn-maroon px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2"
            >
              <span>Track Order Status</span>
              <ArrowRight className="w-4 h-4 text-[#ECC572]" />
            </Link>
            <Link
              href="/menu"
              className="px-6 py-3 rounded-full border border-[#D4A143] text-[#5E0B15] text-sm font-semibold hover:bg-[#F6EAD4]"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-[#664941]">
        Loading checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-8 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#8B1524] mx-auto" />
          <h2 className="font-display text-2xl font-bold text-[#3D050C]">
            Your cart is empty
          </h2>
          <p className="text-sm text-[#664941]">
            Add dishes from the Navya Grand menu before checking out.
          </p>
          <Link
            href="/order-now"
            className="btn-maroon inline-block px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            Order Food Online
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Left: Checkout Details (single column on mobile) */}
        <div className="lg:col-span-7 space-y-6">
          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Type */}
          <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-5 sm:p-6 space-y-3 shadow-xs">
            <h2 className="font-display text-xl font-bold text-[#3D050C]">
              1. Order Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOrderTypeChange("delivery")}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  orderType === "delivery"
                    ? "border-[#5E0B15] bg-[#FDF7EC]"
                    : "border-[#D4A143]/30 bg-white hover:bg-[#FDF7EC]/60"
                }`}
              >
                <Bike className="w-5 h-5 text-[#5E0B15] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[#3D050C]">
                    Home Delivery (Guntur)
                  </p>
                  <p className="text-xs text-[#664941] mt-0.5">
                    Free above ₹{deliveryConfig.freeDeliveryAbove} • ₹
                    {deliveryConfig.deliveryFee} otherwise
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleOrderTypeChange("takeaway")}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  orderType === "takeaway"
                    ? "border-[#5E0B15] bg-[#FDF7EC]"
                    : "border-[#D4A143]/30 bg-white hover:bg-[#FDF7EC]/60"
                }`}
              >
                <Store className="w-5 h-5 text-[#5E0B15] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[#3D050C]">
                    Restaurant Takeaway
                  </p>
                  <p className="text-xs text-[#664941] mt-0.5">
                    Pickup at Vidyanagar Main Road • ₹0 fee
                  </p>
                </div>
              </button>
            </div>
            <p className="text-xs text-[#664941]">
              {deliveryConfig.deliveryHoursNote}
            </p>
          </div>

          {/* Customer Information */}
          <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="font-display text-xl font-bold text-[#3D050C]">
              2. Customer &amp; Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
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
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
              />
            </div>

            {orderType === "delivery" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
                    Delivery Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat No., Building, Street"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near Don Bosco..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={city}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 border border-[#D4A143]/35 text-base sm:text-sm text-[#2B1410]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
                      Guntur Pincode *
                    </label>
                    <select
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
                    >
                      {deliveryConfig.supportedPincodes.map((pin) => (
                        <option key={pin} value={pin}>
                          {pin}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
                Additional Kitchen / Delivery Instructions
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Call on arrival, spice preference, cutlery request..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="font-display text-xl font-bold text-[#3D050C]">
              3. Payment Method
            </h2>

            <div className="space-y-3">
              {orderType === "delivery" ? (
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D4A143]/45 bg-[#FDF7EC] cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 accent-[#5E0B15]"
                  />
                  <Wallet className="w-5 h-5 text-[#5E0B15] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-[#3D050C]">
                      Cash / UPI on Delivery
                    </p>
                    <p className="text-xs text-[#664941]">
                      Pay directly to our delivery partner upon receiving your
                      order.
                    </p>
                  </div>
                </label>
              ) : (
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D4A143]/45 bg-[#FDF7EC] cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "pickup"}
                    onChange={() => setPaymentMethod("pickup")}
                    className="mt-1 accent-[#5E0B15]"
                  />
                  <Store className="w-5 h-5 text-[#5E0B15] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-[#3D050C]">
                      Pay at Restaurant Pickup Counter
                    </p>
                    <p className="text-xs text-[#664941]">
                      Pay via Cash, Card, or UPI when collecting your order.
                    </p>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D4A143]/45 bg-white cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="mt-1 accent-[#5E0B15]"
                />
                <QrCode className="w-5 h-5 text-[#5E0B15] shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="font-bold text-sm text-[#3D050C]">
                      Direct UPI Transfer (Verified by Restaurant)
                    </p>
                    <p className="text-xs text-[#664941]">
                      Transfer ₹{grandTotal} to UPI ID:{" "}
                      <strong className="text-[#5E0B15]">
                        {deliveryConfig.upiId}
                      </strong>{" "}
                      and enter your 12-digit UTR / transaction reference below.
                    </p>
                  </div>

                  {paymentMethod === "upi" && (
                    <input
                      type="text"
                      required
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="Enter UPI UTR / Transaction Reference ID"
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410]"
                    />
                  )}
                </div>
              </label>

              <div
                className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                  deliveryConfig.gatewayConfigured
                    ? "border-[#D4A143]/45 bg-white"
                    : "border-neutral-200 bg-neutral-50 opacity-75"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  disabled={!deliveryConfig.gatewayConfigured}
                  checked={paymentMethod === "gateway"}
                  onChange={() => setPaymentMethod("gateway")}
                  className="mt-1 accent-[#5E0B15]"
                />
                <CreditCard className="w-5 h-5 text-[#5E0B15] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[#3D050C]">
                    Online Payment Gateway (Cards / Netbanking)
                  </p>
                  <p className="text-xs text-[#664941]">
                    {deliveryConfig.gatewayConfigured
                      ? "Pay securely via verified Razorpay checkout."
                      : "Pending merchant payment gateway API configuration. Please use Cash on Delivery / Pay at Pickup or UPI Verification."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 shadow-md space-y-4 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-[#3D050C] pb-2 border-b border-[#D4A143]/25">
            Order Summary
          </h2>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-2 text-sm"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="mt-0.5">
                    <VegBadge vegType={item.vegType} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#3D050C] truncate">
                      {item.quantity} × {item.name}
                    </p>
                    {item.variantLabel && (
                      <p className="text-xs text-[#664941]">
                        {item.variantLabel}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-[#5E0B15] shrink-0">
                  ₹{item.unitPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#D4A143]/25 space-y-2 text-sm">
            <div className="flex justify-between text-[#664941]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#3D050C]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#664941]">
              <span>GST ({deliveryConfig.taxRatePercent}%)</span>
              <span className="font-semibold text-[#3D050C]">₹{taxAmount}</span>
            </div>
            <div className="flex justify-between text-[#664941]">
              <span>Delivery Charge</span>
              <span className="font-semibold text-[#3D050C]">
                {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#D4A143]/40 flex justify-between items-center">
            <span className="font-display text-lg font-bold text-[#3D050C]">
              Total Payable
            </span>
            <span className="text-2xl font-bold text-[#5E0B15]">
              ₹{grandTotal}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full py-3.5 px-6 rounded-full text-sm sm:text-base font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Order...</span>
              </>
            ) : (
              <>
                <span>Place Order • ₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </aside>
      </form>
    </div>
  );
}

