"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, Minus, Flame, ShoppingBag } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import { VegBadge } from "./VegBadge";

export function ProductDetailModal() {
  const { selectedProduct, closeProductModal, showToast, openCart } = useUI();
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (!selectedProduct) return;
    setSelectedVariant(
      selectedProduct.variants.length > 0
        ? selectedProduct.variants[0].label
        : null
    );
    setQuantity(1);
    setInstructions("");
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const activeVariantObj = selectedVariant
    ? selectedProduct.variants.find((v) => v.label === selectedVariant)
    : undefined;
  const activePrice = activeVariantObj?.price ?? selectedProduct.price;

  const handleAdd = () => {
    if (!selectedProduct.isAvailable) return;
    addItem(selectedProduct, {
      quantity,
      variantLabel: selectedVariant,
      unitPrice: activePrice,
      instructions: instructions.trim() || undefined,
    });
    showToast({
      title: `Added ${quantity} × ${selectedProduct.name}`,
      description: `₹${activePrice * quantity}`,
      type: "success",
    });
    closeProductModal();
    openCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={selectedProduct.name}
    >
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={closeProductModal}
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#FDF7EC] rounded-3xl border-2 border-[#D4A143]/55 shadow-2xl">
        <button
          type="button"
          onClick={closeProductModal}
          aria-label="Close dish details"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[340px] bg-[#F6EAD4]">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 pr-8">
                <VegBadge vegType={selectedProduct.vegType} showLabel />
                {selectedProduct.spiceLevel && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#8B1524] bg-[#F6EAD4] px-2.5 py-0.5 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span className="capitalize">
                      {selectedProduct.spiceLevel}
                    </span>
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-[#3D050C]">
                {selectedProduct.name}
              </h2>

              <p className="text-xl font-bold text-[#5E0B15]">₹{activePrice}</p>

              <p className="text-sm text-[#664941] leading-relaxed">
                {selectedProduct.description}
              </p>

              {selectedProduct.variants.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#5E0B15]">
                    Choose Portion Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((v) => {
                      const active = selectedVariant === v.label;
                      return (
                        <button
                          key={v.label}
                          type="button"
                          onClick={() => setSelectedVariant(v.label)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            active
                              ? "bg-[#5E0B15] text-[#ECC572] border-[#5E0B15]"
                              : "bg-white text-[#3D050C] border-[#D4A143]/50 hover:bg-[#F6EAD4]"
                          }`}
                        >
                          {v.label} – ₹{v.price}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <label
                  htmlFor="dish-instructions"
                  className="text-xs font-semibold uppercase tracking-wider text-[#5E0B15]"
                >
                  Cooking Instructions (Optional)
                </label>
                <input
                  id="dish-instructions"
                  type="text"
                  maxLength={160}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g., Less spicy, extra raita, no onion"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/45 text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
                />
              </div>
            </div>

            {selectedProduct.isAvailable ? (
              <div className="flex items-center gap-3 pt-2">
                <div className="inline-flex items-center rounded-full border border-[#D4A143]/60 bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#5E0B15] hover:bg-[#F6EAD4] rounded-l-full cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-[#3D050C]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#5E0B15] hover:bg-[#F6EAD4] rounded-r-full cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn-maroon flex-1 py-2.5 px-5 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#ECC572]" />
                  <span>Add • ₹{activePrice * quantity}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium text-center">
                This dish is currently unavailable.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

