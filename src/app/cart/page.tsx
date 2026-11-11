"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { useCart } from "@/context/CartContext";
import { VegBadge } from "@/components/VegBadge";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    hydrated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const estimatedTax = Math.round(subtotal * 0.05 * 100) / 100;
  const qualifiesFreeDelivery = subtotal >= 600;
  const deliveryFee = subtotal === 0 || qualifiesFreeDelivery ? 0 : 40;
  const estimatedTotal = Math.round((subtotal + estimatedTax + deliveryFee) * 100) / 100;

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Review Your Selection"
        title="Shopping Cart"
        description="Adjust portion quantities, review items, and proceed to secure checkout."
        breadcrumbs={[{ label: "Cart" }]}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!hydrated ? (
          <div className="bg-white/90 rounded-2xl p-8 text-center text-[#664941]">
            Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-10 text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F6EAD4] text-[#5E0B15] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#3D050C]">
              Your shopping cart is empty
            </h2>
            <p className="text-sm text-[#664941]">
              Add delicious Biryanis, Andhra Specials, Tandoori platters, or
              desserts from our menu.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/order-now"
                className="btn-maroon px-6 py-3 rounded-full text-sm font-semibold"
              >
                Order Online Now
              </Link>
              <Link
                href="/menu"
                className="px-6 py-3 rounded-full border border-[#D4A143] text-[#5E0B15] text-sm font-semibold hover:bg-[#F6EAD4]"
              >
                Explore Full Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h2 className="font-display text-xl font-bold text-[#3D050C]">
                  Cart Items ({itemCount})
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-[#8B1524] hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.key}
                  className="bg-white/95 rounded-2xl border border-[#D4A143]/35 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#F6EAD4]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <VegBadge vegType={item.vegType} />
                        <h3 className="font-display text-base sm:text-lg font-bold text-[#3D050C] truncate">
                          {item.name}
                        </h3>
                      </div>
                      {item.variantLabel && (
                        <p className="text-xs text-[#664941] mt-0.5">
                          Portion: {item.variantLabel}
                        </p>
                      )}
                      {item.instructions && (
                        <p className="text-xs text-[#8B1524] italic mt-0.5">
                          Note: {item.instructions}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-[#5E0B15] mt-1">
                        ₹{item.unitPrice} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D4A143]/20">
                    <div className="inline-flex items-center rounded-full border border-[#D4A143]/60 bg-[#FDF7EC]">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.key, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-[#5E0B15] hover:bg-[#F6EAD4] rounded-l-full cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 text-sm font-bold text-[#3D050C]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.key, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-[#5E0B15] hover:bg-[#F6EAD4] rounded-r-full cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="text-base font-bold text-[#3D050C]">
                        ₹{item.unitPrice * item.quantity}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.name}`}
                      className="p-2 text-[#664941] hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5E0B15] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4 bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 shadow-md space-y-4">
              <h2 className="font-display text-xl font-bold text-[#3D050C] pb-2 border-b border-[#D4A143]/25">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-[#664941]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#3D050C]">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-[#664941]">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-[#3D050C]">
                    ₹{estimatedTax}
                  </span>
                </div>
                <div className="flex justify-between text-[#664941]">
                  <span>Delivery Charge (if Delivery)</span>
                  <span className="font-semibold text-[#3D050C]">
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>
                {!qualifiesFreeDelivery && (
                  <p className="text-xs text-[#8B1524] bg-[#FDF7EC] p-2.5 rounded-xl border border-[#D4A143]/30">
                    Add ₹{600 - subtotal} more for free local delivery in Guntur
                    (or ₹0 with Restaurant Takeaway).
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#D4A143]/35 flex justify-between items-center">
                <span className="font-display text-lg font-bold text-[#3D050C]">
                  Estimated Total
                </span>
                <span className="text-xl font-bold text-[#5E0B15]">
                  ₹{estimatedTotal}
                </span>
              </div>

              <Link
                href="/checkout"
                className="btn-gold w-full py-3 px-6 rounded-full text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

