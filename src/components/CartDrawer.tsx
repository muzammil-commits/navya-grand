"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { VegBadge } from "./VegBadge";

export function CartDrawer() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } =
    useCart();
  const { isCartOpen, closeCart } = useUI();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs"
        onClick={closeCart}
      />
      <aside className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FDF7EC] border-l-2 border-[#D4A143]/50 shadow-2xl flex flex-col">
        <div className="px-5 py-4 bg-[#4B0710] text-[#F8EEDB] flex items-center justify-between border-b border-[#D4A143]/35">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#ECC572]" />
            <div>
              <h2 className="font-display text-xl font-bold text-white leading-none">
                Your Order Cart
              </h2>
              <p className="text-xs text-[#ECC572] mt-0.5">
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart drawer"
            className="w-9 h-9 rounded-full bg-white/10 text-[#ECC572] hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-[#F6EAD4] border border-[#D4A143]/40 flex items-center justify-center text-[#5E0B15] mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#3D050C]">
                Your cart is empty
              </h3>
              <p className="text-sm text-[#664941] mt-1 max-w-xs">
                Explore our signature Andhra Biryanis, Tandoori platters, and
                South Indian classics to start ordering.
              </p>
              <Link
                href="/menu"
                onClick={closeCart}
                className="btn-maroon mt-5 px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.key}
                  className="bg-white/95 rounded-xl border border-[#D4A143]/30 p-3 flex gap-3 shadow-xs"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#F6EAD4]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <VegBadge vegType={item.vegType} />
                        <h4 className="font-semibold text-sm text-[#3D050C] truncate">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#664941] hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variantLabel && (
                      <p className="text-xs text-[#664941] mt-0.5">
                        Portion: {item.variantLabel}
                      </p>
                    )}
                    {item.instructions && (
                      <p className="text-[11px] text-[#8B1524] italic mt-0.5 truncate">
                        Note: {item.instructions}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-[#D4A143]/50 bg-[#FDF7EC]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#5E0B15] hover:bg-[#F6EAD4] rounded-l-full cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#3D050C]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#5E0B15] hover:bg-[#F6EAD4] rounded-r-full cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#5E0B15]">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-[#8B1524] hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-[#D4A143]/40 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#664941]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#3D050C]">₹{subtotal}</span>
              </div>
              <p className="text-[11px] text-[#664941]">
                Taxes &amp; delivery charges (free above ₹600) calculated at
                checkout.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/cart"
                onClick={closeCart}
                className="px-4 py-2.5 rounded-full border border-[#5E0B15] text-[#5E0B15] text-sm font-semibold text-center hover:bg-[#F6EAD4] transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-gold px-4 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

