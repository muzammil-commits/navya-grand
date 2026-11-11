"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: "Food & Biryani" | "Restaurant Dining" | "Banquet & Events" | "Hygiene & Prep";
  imageUrl: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Royal Chicken Dum Biryani",
    category: "Food & Biryani",
    imageUrl: "/images/dishes/chicken-biryani.png",
  },
  {
    id: "g2",
    title: "Traditional Mutton Dum Biryani",
    category: "Food & Biryani",
    imageUrl: "/images/dishes/mutton-biryani.png",
  },
  {
    id: "g3",
    title: "Grand Andhra Banana Leaf Thali",
    category: "Food & Biryani",
    imageUrl: "/images/dishes/andhra-thali.png",
  },
  {
    id: "g4",
    title: "Charcoal Tandoori Platter",
    category: "Food & Biryani",
    imageUrl: "/images/dishes/tandoori.png",
  },
  {
    id: "g5",
    title: "Indo-Chinese Wok Specialties",
    category: "Food & Biryani",
    imageUrl: "/images/dishes/chinese.png",
  },
  {
    id: "g6",
    title: "Coastal Andhra Seafood",
    category: "Food & Biryani",
    imageUrl: "/images/dishes/seafood.png",
  },
  {
    id: "g7",
    title: "Main Family Fine Dining Hall",
    category: "Restaurant Dining",
    imageUrl: "/images/spaces/restaurant-interior.png",
  },
  {
    id: "g8",
    title: "Warm Ambient Table Setting",
    category: "Restaurant Dining",
    imageUrl: "/images/spaces/fine-dining.png",
  },
  {
    id: "g9",
    title: "Private Group Dining Zone",
    category: "Restaurant Dining",
    imageUrl: "/images/spaces/private-dining.png",
  },
  {
    id: "g10",
    title: "Navya Grand Banquet Hall",
    category: "Banquet & Events",
    imageUrl: "/images/spaces/banquet-hall.png",
  },
  {
    id: "g11",
    title: "Wedding & Reception Arrangements",
    category: "Banquet & Events",
    imageUrl: "/images/spaces/wedding-arrangements.png",
  },
  {
    id: "g12",
    title: "Fresh Culinary Preparation & Hygiene",
    category: "Hygiene & Prep",
    imageUrl: "/images/hygiene/food-preparation.png",
  },
];

const CATEGORIES = [
  "All",
  "Food & Biryani",
  "Restaurant Dining",
  "Banquet & Events",
  "Hygiene & Prep",
] as const;

export function GalleryClient() {
  const [selectedCat, setSelectedCat] =
    useState<(typeof CATEGORIES)[number]>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const visibleItems =
    selectedCat === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((i) => i.category === selectedCat);

  useEffect(() => {
    if (lightboxIdx === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      else if (e.key === "ArrowRight")
        setLightboxIdx((i) => (i === null ? 0 : (i + 1) % visibleItems.length));
      else if (e.key === "ArrowLeft")
        setLightboxIdx((i) =>
          i === null ? 0 : (i - 1 + visibleItems.length) % visibleItems.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, visibleItems.length]);

  const activeItem =
    lightboxIdx !== null ? visibleItems[lightboxIdx] || null : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCat(cat);
              setLightboxIdx(null);
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
              selectedCat === cat
                ? "bg-[#5E0B15] text-[#ECC572] border-[#5E0B15]"
                : "bg-white text-[#3D050C] border-[#D4A143]/45 hover:bg-[#F6EAD4]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {visibleItems.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxIdx(idx)}
            className="group relative rounded-2xl overflow-hidden border border-[#D4A143]/45 bg-white shadow-sm hover:shadow-xl transition-all text-left cursor-pointer"
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#F6EAD4]">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3.5 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8B1524]">
                  {item.category}
                </p>
                <h3 className="font-display text-base font-bold text-[#3D050C]">
                  {item.title}
                </h3>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#FDF7EC] text-[#5E0B15] flex items-center justify-center shrink-0">
                <ZoomIn className="w-4 h-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Gallery Lightbox */}
      {activeItem && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => setLightboxIdx(null)}
          />
          <div className="relative z-10 w-full max-w-4xl bg-[#2A0408] rounded-3xl border border-[#D4A143]/60 overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close lightbox"
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] max-h-[75dvh] w-full bg-black flex items-center justify-center">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-contain"
              />
              {visibleItems.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setLightboxIdx(
                        (lightboxIdx - 1 + visibleItems.length) %
                          visibleItems.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-[#ECC572] hover:bg-[#5E0B15] flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() =>
                      setLightboxIdx((lightboxIdx + 1) % visibleItems.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-[#ECC572] hover:bg-[#5E0B15] flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3.5 bg-[#4B0710] text-white flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#ECC572]">{activeItem.category}</p>
                <p className="font-display text-lg font-bold">
                  {activeItem.title}
                </p>
              </div>
              <span className="text-xs text-[#F8EEDB]/80">
                {lightboxIdx + 1} / {visibleItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

