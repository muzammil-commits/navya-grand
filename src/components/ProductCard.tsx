"use client";

import React from "react";
import { Plus, Minus, Flame, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import type { Product } from "@/lib/types";
import { VegBadge } from "./VegBadge";

export function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart();
  const { openProductModal, showToast } = useUI();

  const defaultVariant =
    product.variants.length > 0 ? product.variants[0].label : null;
  const defaultPrice =
    product.variants.length > 0 ? product.variants[0].price : product.price;
  const cartKey = `${product.id}::${defaultVariant || "default"}`;
  const existingItem = items.find((i) => i.key === cartKey);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addItem(product, {
      quantity: 1,
      variantLabel: defaultVariant,
      unitPrice: defaultPrice,
    });
    showToast({
      title: `${product.name} added to cart`,
      description: `₹${defaultPrice}${defaultVariant ? ` • ${defaultVariant}` : ""}`,
      type: "success",
    });
  };

  return (
    <article
      onClick={() => openProductModal(product)}
      className="group relative bg-white/95 rounded-2xl border border-[#D4A143]/35 shadow-sm hover:shadow-lg hover:border-[#D4A143] transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6EAD4]">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="p-1 rounded-md bg-white/90 shadow-xs">
            <VegBadge vegType={product.vegType} />
          </span>
          {product.isSignature && (
            <span className="px-2 py-0.5 rounded-full bg-[#5E0B15]/90 text-[#ECC572] text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Signature
            </span>
          )}
        </div>
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-white text-[#5E0B15] text-xs font-bold">
              Currently Unavailable
            </span>
          </div>
        )}
        <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/65 text-white text-[11px] font-medium">
          <Eye className="w-3 h-3" />
          Details
        </span>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[#3D050C] leading-snug line-clamp-2">
              {product.name}
            </h3>
          </div>

          {product.spiceLevel && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8B1524] mt-1">
              <Flame className="w-3 h-3 text-amber-600" />
              <span className="capitalize">{product.spiceLevel} Spice</span>
            </span>
          )}

          <p className="mt-1 text-xs sm:text-sm text-[#664941] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price + Add to Cart */}
        <div className="pt-2 border-t border-[#D4A143]/20 flex items-center justify-between gap-2">
          <div>
            <p className="text-base sm:text-lg font-bold text-[#5E0B15]">
              ₹{defaultPrice}
            </p>
            {product.variants.length > 0 && (
              <p className="text-[10px] text-[#664941]">
                {product.variants.length} portions
              </p>
            )}
          </div>

          {!product.isAvailable ? (
            <span className="text-xs font-semibold text-neutral-500">
              Unavailable
            </span>
          ) : existingItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center rounded-full border border-[#5E0B15] bg-[#5E0B15] text-[#FDF7EC] shadow-xs"
            >
              <button
                type="button"
                aria-label={`Decrease quantity of ${product.name}`}
                onClick={() =>
                  updateQuantity(existingItem.key, existingItem.quantity - 1)
                }
                className="w-8 h-8 flex items-center justify-center hover:bg-[#4B0710] rounded-l-full cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs sm:text-sm font-bold min-w-[22px] text-center">
                {existingItem.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${product.name}`}
                onClick={() =>
                  updateQuantity(existingItem.key, existingItem.quantity + 1)
                }
                className="w-8 h-8 flex items-center justify-center hover:bg-[#4B0710] rounded-r-full cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-maroon inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#ECC572]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

