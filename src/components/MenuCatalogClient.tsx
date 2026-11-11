"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/context/CartContext";

interface MenuCatalogClientProps {
  categories: Category[];
  products: Product[];
  orderMode?: boolean;
}

export function MenuCatalogClient({
  categories,
  products,
  orderMode = false,
}: MenuCatalogClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "name-asc"
  >("default");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { itemCount, subtotal, hydrated } = useCart();

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 5);
  }, [products, searchQuery]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = products.filter((p) => {
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }
      if (vegFilter !== "all" && p.vegType !== vegFilter) {
        return false;
      }
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedCategory, vegFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    vegFilter !== "all" ||
    searchQuery.trim() !== "" ||
    sortBy !== "default";

  const clearFilters = () => {
    setSelectedCategory("all");
    setVegFilter("all");
    setSearchQuery("");
    setSortBy("default");
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 sm:pb-12">
      {/* Search + Filter Controls */}
      <div className="bg-white/95 rounded-2xl border border-[#D4A143]/40 shadow-sm p-3.5 sm:p-5 space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input with Live Suggestions */}
          <div className="md:col-span-6 relative">
            <label htmlFor="menu-search" className="sr-only">
              Search dishes
            </label>
            <Search className="w-4 h-4 text-[#8B1524] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="menu-search"
              type="text"
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Search Chicken Biryani, Andhra Fry, Dosa..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#664941] hover:text-[#5E0B15] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white rounded-xl border border-[#D4A143]/50 shadow-xl overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseDown={() => {
                      setSearchQuery(s.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#FDF7EC] flex items-center justify-between gap-2 text-sm cursor-pointer border-b last:border-b-0 border-[#D4A143]/15"
                  >
                    <span className="font-medium text-[#3D050C] truncate">
                      {s.name}
                    </span>
                    <span className="text-xs font-bold text-[#5E0B15] shrink-0">
                      ₹{s.price}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Veg / Non-Veg Toggle */}
          <div className="md:col-span-3 flex items-center gap-1.5 bg-[#FDF7EC] p-1 rounded-xl border border-[#D4A143]/40">
            {(
              [
                { key: "all", label: "All" },
                { key: "veg", label: "Veg" },
                { key: "non-veg", label: "Non-Veg" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setVegFilter(opt.key)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  vegFilter === opt.key
                    ? "bg-[#5E0B15] text-[#ECC572] shadow-xs"
                    : "text-[#3D050C] hover:bg-white/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#8B1524] shrink-0" />
            <select
              aria-label="Sort menu items"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as typeof sortBy)
              }
              className="w-full py-2.5 px-3 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#5E0B15] text-[#ECC572] border-[#5E0B15]"
                : "bg-[#FDF7EC] text-[#3D050C] border-[#D4A143]/45 hover:bg-[#F6EAD4]"
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => {
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                  active
                    ? "bg-[#5E0B15] text-[#ECC572] border-[#5E0B15]"
                    : "bg-[#FDF7EC] text-[#3D050C] border-[#D4A143]/45 hover:bg-[#F6EAD4]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-[#664941]">
          <span>
            Showing <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "dish" : "dishes"}
            {orderMode ? " available for online ordering" : ""}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[#8B1524] font-semibold hover:underline cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-10 text-center space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-[#8B1524] mx-auto opacity-75" />
          <h3 className="font-display text-2xl font-bold text-[#3D050C]">
            No dishes match your filters
          </h3>
          <p className="text-sm text-[#664941] max-w-md mx-auto">
            Try clearing your search or switching category / veg filters to
            explore our full Navya Grand menu.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-maroon px-6 py-2.5 rounded-full text-sm font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[375px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Sticky Order Summary Bar when Cart has items */}
      {hydrated && itemCount > 0 && (
        <div className="fixed bottom-3 left-3 right-16 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-full sm:max-w-lg z-30">
          <div className="bg-[#4B0710] text-white rounded-2xl border border-[#D4A143] shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <ShoppingBag className="w-5 h-5 text-[#ECC572] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate">
                  {itemCount} {itemCount === 1 ? "Item" : "Items"} • ₹{subtotal}
                </p>
                <p className="text-[11px] text-[#ECC572] truncate">
                  Ready for checkout
                </p>
              </div>
            </div>
            <Link
              href="/checkout"
              className="btn-gold px-4 py-2 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-1 shrink-0"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

