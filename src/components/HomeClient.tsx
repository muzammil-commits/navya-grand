"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Utensils,
  Flame,
  Crown,
  Bike,
  Users,
  Gem,
  ShieldCheck,
  Smile,
  Heart,
  Star,
  CalendarCheck,
  Plus,
} from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import type { Category, Product, ServiceItem, SiteContent } from "@/lib/types";

interface HomeClientProps {
  siteContent: SiteContent;
  signatureProducts: Product[];
  categories: Category[];
}

function ServiceIcon({ name }: { name: ServiceItem["iconName"] }) {
  switch (name) {
    case "utensils":
      return <Utensils className="w-6 h-6" />;
    case "flame":
      return <Flame className="w-6 h-6" />;
    case "crown":
      return <Crown className="w-6 h-6" />;
    case "bike":
      return <Bike className="w-6 h-6" />;
    case "users":
      return <Users className="w-6 h-6" />;
  }
}

function PillarIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "gem":
      return <Gem className="w-5 h-5" />;
    case "shield":
      return <ShieldCheck className="w-5 h-5" />;
    case "smile":
      return <Smile className="w-5 h-5" />;
    default:
      return <Heart className="w-5 h-5" />;
  }
}

const SPECIALS_MAP = [
  {
    name: "Biryani",
    slug: "biryani",
    image: "/images/dishes/chicken-biryani.png",
  },
  {
    name: "Andhra Thali",
    slug: "andhra-specials",
    image: "/images/dishes/andhra-thali.png",
  },
  {
    name: "Tandoori",
    slug: "tandoori",
    image: "/images/dishes/tandoori.png",
  },
  {
    name: "Chinese",
    slug: "chinese",
    image: "/images/dishes/chinese.png",
  },
  {
    name: "South Indian",
    slug: "south-indian",
    image: "/images/dishes/south-indian.png",
  },
  {
    name: "Sea Food",
    slug: "seafood",
    image: "/images/dishes/seafood.png",
  },
];

export function HomeClient({
  siteContent,
  signatureProducts,
}: HomeClientProps) {
  const {
    openBookingModal,
    openBanquetModal,
    openServiceModal,
    openProductModal,
    showToast,
  } = useUI();
  const { addItem } = useCart();

  const slides = siteContent.heroSlides;
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const testimonials = siteContent.testimonials;
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const currentSlide = slides[activeSlide] || slides[0];

  const handleQuickAddSignature = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultVariant =
      product.variants.length > 0 ? product.variants[0].label : null;
    const defaultPrice =
      product.variants.length > 0 ? product.variants[0].price : product.price;
    addItem(product, {
      quantity: 1,
      variantLabel: defaultVariant,
      unitPrice: defaultPrice,
    });
    showToast({
      title: `${product.name} added to cart`,
      description: `₹${defaultPrice}`,
      type: "success",
    });
  };

  return (
    <div className="w-full">
      {/* 1. HERO SLIDER */}
      <section
        className="relative w-full overflow-hidden bg-[#2A0408] min-h-[500px] sm:min-h-[540px] md:min-h-[520px] lg:min-h-[580px] flex items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Featured Highlights"
      >
        {/* Background Slides */}
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Desktop Hero Image (image copy 3.png on slide 0) */}
              <img
                src={slide.desktopImage}
                alt={slide.title}
                className="hidden md:block w-full h-full object-cover object-right animate-hero-desktop"
              />
              {/* Mobile-Only Hero Image (image copy 4.png on slide 0) */}
              <img
                src={slide.mobileImage}
                alt={slide.title}
                className="block md:hidden w-full h-full object-cover object-center animate-hero-mobile"
              />
              {/* Warm Gradient Overlay for high-contrast typography */}
              <div
                className="absolute inset-0 md:bg-gradient-to-r md:from-[#260307]/92 md:via-[#3A060C]/65 md:to-transparent bg-gradient-to-b from-[#260307]/88 via-[#3A060C]/55 to-[#260307]/75"
              />
              {/* Subtle warm glow */}
              <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent animate-glow-pulse pointer-events-none" />
            </div>
          );
        })}

        {/* Hero Foreground Copy */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 pb-20 sm:pb-24">
          <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
            <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm uppercase tracking-[0.22em] text-[#ECC572] font-semibold mb-2">
              <span className="hidden sm:inline-block w-8 h-[1px] bg-[#D4A143]" />
              <span>{currentSlide.eyebrow}</span>
              <span className="hidden sm:inline-block w-8 h-[1px] bg-[#D4A143]" />
            </div>

            <h1 className="heading-hero font-display font-bold text-[#F5C66D] drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)]">
              {currentSlide.title}
            </h1>

            <p className="mt-2 sm:mt-3 font-display italic text-base sm:text-xl lg:text-2xl text-[#FDF7EC] drop-shadow-sm">
              {currentSlide.subtitle}
            </p>

            <div className="mt-3 sm:mt-4 inline-block px-3.5 py-1.5 rounded-full bg-[#4B0710]/80 border border-[#D4A143]/50 text-[11px] sm:text-sm text-[#ECC572] font-medium tracking-wide">
              {currentSlide.tagline}
            </div>

            <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                href={currentSlide.ctaPrimaryHref}
                className="btn-gold inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-transform active:scale-95"
              >
                <span>{currentSlide.ctaPrimaryLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {currentSlide.ctaSecondaryHref === "/book-a-table" ? (
                <button
                  type="button"
                  onClick={openBookingModal}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black/45 hover:bg-black/65 text-[#FDF7EC] border border-[#D4A143]/70 text-sm sm:text-base font-semibold backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-[#ECC572]" />
                  <span>{currentSlide.ctaSecondaryLabel}</span>
                </button>
              ) : (
                <Link
                  href={currentSlide.ctaSecondaryHref}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black/45 hover:bg-black/65 text-[#FDF7EC] border border-[#D4A143]/70 text-sm sm:text-base font-semibold backdrop-blur-xs transition-colors"
                >
                  <span>{currentSlide.ctaSecondaryLabel}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveSlide(
                  (prev) => (prev - 1 + slides.length) % slides.length
                )
              }
              aria-label="Previous hero slide"
              className="hidden sm:flex absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 hover:bg-[#5E0B15] text-[#ECC572] border border-[#D4A143]/50 items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveSlide((prev) => (prev + 1) % slides.length)
              }
              aria-label="Next hero slide"
              className="hidden sm:flex absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 hover:bg-[#5E0B15] text-[#ECC572] border border-[#D4A143]/50 items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-9 sm:bottom-11 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === activeSlide
                      ? "w-7 bg-[#ECC572]"
                      : "w-2.5 bg-white/55 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Curved Golden & Cream Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 60"
            className="w-full h-8 sm:h-12 md:h-14 block"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,14 C380,62 1060,62 1440,14 L1440,60 L0,60 Z"
              fill="#D4A143"
            />
            <path
              d="M0,21 C380,68 1060,68 1440,21 L1440,60 L0,60 Z"
              fill="#FDF7EC"
              fillOpacity="0.92"
            />
          </svg>
        </div>
      </section>

      {/* 2. OUR SERVICES */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-7 sm:mb-9">
            <span className="hidden sm:block w-16 md:w-28 h-[1.5px] bg-gradient-to-r from-transparent to-[#D4A143]" />
            <h2 className="heading-section font-display font-bold text-[#5E0B15] text-center">
              Our Services
            </h2>
            <span className="hidden sm:block w-16 md:w-28 h-[1.5px] bg-gradient-to-l from-transparent to-[#D4A143]" />
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {siteContent.services.map((service) => (
              <div
                key={service.id}
                className="group bg-white/90 backdrop-blur-xs rounded-2xl border border-[#D4A143]/40 p-4 sm:p-5 text-center shadow-sm hover:shadow-lg hover:border-[#D4A143] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#5E0B15] text-[#ECC572] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <ServiceIcon name={service.iconName} />
                  </div>
                  <h3 className="mt-3.5 font-display text-base sm:text-lg font-bold text-[#3D050C] leading-snug">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#664941] leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openServiceModal(service)}
                  className="mt-4 inline-flex items-center justify-center gap-1 text-xs font-bold text-[#8B1524] hover:text-[#5E0B15] cursor-pointer"
                >
                  <span>Discover More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT NAVYA GRAND */}
      <section className="py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="bg-white/85 backdrop-blur-xs rounded-3xl border border-[#D4A143]/40 shadow-md p-4 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4A143]/70 shadow-lg aspect-[16/10]">
                <img
                  src={siteContent.about.imageUrl}
                  alt="Navya Grand Fine Dining Restaurant Interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h2 className="heading-section font-display font-bold text-[#3D050C]">
                About{" "}
                <span className="text-[#8B1524]">Navya Grand</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4A2B24] leading-relaxed">
                {siteContent.about.summary}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {siteContent.about.pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/30"
                  >
                    <span className="w-9 h-9 rounded-full bg-[#5E0B15]/10 text-[#8B1524] flex items-center justify-center mb-1.5">
                      <PillarIcon icon={pillar.icon} />
                    </span>
                    <span className="text-xs font-bold text-[#3D050C] leading-tight">
                      {pillar.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="btn-maroon inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-4 h-4 text-[#ECC572]" />
                </Link>
                <Link
                  href="/hygiene-standards"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#5E0B15]/40 text-[#5E0B15] hover:bg-[#F6EAD4] text-sm font-semibold transition-colors"
                >
                  <span>Hygiene Standards</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE FLAVOURS – MAROON WAVE SECTION */}
      <section className="relative my-6 sm:my-10">
        {/* Top Golden Wave */}
        <div className="w-full overflow-hidden leading-none -mb-px">
          <svg
            viewBox="0 0 1440 50"
            className="w-full h-6 sm:h-10 block"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,30 C420,0 1020,55 1440,16 L1440,50 L0,50 Z"
              fill="#D4A143"
            />
            <path
              d="M0,36 C420,8 1020,60 1440,22 L1440,50 L0,50 Z"
              fill="#4B0710"
            />
          </svg>
        </div>

        <div className="maroon-velvet text-[#FDF7EC] py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.26em] text-[#ECC572] font-semibold">
                Signature Flavours
              </p>
              <h2 className="heading-section font-display font-bold text-white">
                A Taste of{" "}
                <span className="text-[#ECC572]">Tradition</span>
              </h2>
              <p className="text-sm sm:text-base text-[#F8EEDB]/90 leading-relaxed max-w-md mx-auto lg:mx-0">
                Authentic Andhra flavours, slow-cooked dum biryanis, and
                hand-ground Guntur spices crafted with care and served with
                pride.
              </p>
              <div className="pt-1">
                <Link
                  href="/menu"
                  className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold"
                >
                  <span>Explore Our Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Center Biryani Feature */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-br from-[#ECC572] via-[#D4A143] to-[#6B0F1A] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <img
                  src="/images/dishes/chicken-biryani.png"
                  alt="Navya Grand Signature Copper Pot Chicken Biryani"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Right Featured Dishes List */}
            <div className="lg:col-span-4 space-y-3">
              {signatureProducts.slice(0, 4).map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => openProductModal(dish)}
                  className="flex items-center justify-between gap-3 p-2.5 pr-3 rounded-full bg-white/10 hover:bg-white/15 border border-[#D4A143]/40 backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#ECC572] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-white truncate">
                        {dish.name}
                      </h3>
                      <p className="text-xs font-bold text-[#ECC572]">
                        ₹{dish.price}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAddSignature(e, dish)}
                    aria-label={`Add ${dish.name} to cart`}
                    className="w-9 h-9 rounded-full bg-[#ECC572] hover:bg-white text-[#4B0710] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Golden Wave */}
        <div className="w-full overflow-hidden leading-none -mt-px">
          <svg
            viewBox="0 0 1440 50"
            className="w-full h-6 sm:h-10 block"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,0 L1440,0 L1440,24 C1020,54 420,4 0,34 Z"
              fill="#4B0710"
            />
            <path
              d="M0,34 C420,4 1020,54 1440,24 L1440,31 C1020,60 420,12 0,41 Z"
              fill="#D4A143"
            />
          </svg>
        </div>
      </section>

      {/* 5. OUR SPECIALS – CATEGORY CARDS */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-7 sm:mb-9">
            <span className="hidden sm:block w-16 md:w-28 h-[1.5px] bg-gradient-to-r from-transparent to-[#D4A143]" />
            <h2 className="heading-section font-display font-bold text-[#5E0B15] text-center">
              Our Specials
            </h2>
            <span className="hidden sm:block w-16 md:w-28 h-[1.5px] bg-gradient-to-l from-transparent to-[#D4A143]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {SPECIALS_MAP.map((cat) => (
              <Link
                key={cat.name}
                href={`/menu?category=${cat.slug}`}
                className="group rounded-2xl overflow-hidden bg-white border border-[#D4A143]/50 shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#F6EAD4]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="bg-[#5E0B15] group-hover:bg-[#7A101D] transition-colors py-2 px-2 text-center">
                  <span className="font-display font-bold text-xs sm:text-sm text-[#ECC572]">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BANQUET HALL PROMOTION */}
      <section className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="maroon-velvet rounded-3xl border-2 border-[#D4A143]/55 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 h-56 sm:h-72 lg:h-full min-h-[260px]">
              <img
                src="/images/spaces/banquet-hall.png"
                alt="Navya Grand Banquet Hall for Weddings and Celebrations"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 p-6 sm:p-10 text-center lg:text-left space-y-4">
              <p className="font-display italic text-sm sm:text-base text-[#ECC572]">
                Celebrate Every Special Moment
              </p>
              <h2 className="heading-section font-display font-bold text-white">
                Banquet Hall
              </h2>
              <p className="text-sm sm:text-base text-[#F8EEDB]/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Perfect venue for Weddings, Receptions, Engagements, Birthdays,
                Corporate Events &amp; Family Celebrations in Guntur with
                custom multi-cuisine catering.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={openBanquetModal}
                  className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold cursor-pointer"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/banquet-hall"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#ECC572]/60 text-[#FDF7EC] hover:bg-white/10 text-sm font-semibold transition-colors"
                >
                  <span>Explore Banquet Hall</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SLIDER */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="hidden sm:block w-16 md:w-28 h-[1.5px] bg-gradient-to-r from-transparent to-[#D4A143]" />
              <h2 className="heading-section font-display font-bold text-[#5E0B15]">
                What Our Customers Say
              </h2>
              <span className="hidden sm:block w-16 md:w-28 h-[1.5px] bg-gradient-to-l from-transparent to-[#D4A143]" />
            </div>
            <p className="text-xs text-[#664941] mt-1">
              Sample guest feedback highlights (configurable via Navya Grand Admin)
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {[0, 1, 2].map((offset) => {
                const item =
                  testimonials[(testimonialIdx + offset) % testimonials.length];
                return (
                  <article
                    key={`${item.id}-${offset}`}
                    className={`bg-white/95 rounded-2xl border border-[#D4A143]/40 p-5 shadow-sm flex flex-col justify-between gap-4 ${
                      offset > 0 ? "hidden md:flex" : "flex"
                    }`}
                  >
                    <p className="text-sm text-[#3D050C] italic leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#D4A143]/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#5E0B15] text-[#ECC572] font-display font-bold flex items-center justify-center shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#3D050C]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#664941]">
                            {item.role}
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-0.5 text-[#D4A143]"
                        aria-label={`${item.rating} out of 5 stars`}
                      >
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {testimonials.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialIdx(
                      (prev) =>
                        (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  aria-label="Previous testimonial"
                  className="w-9 h-9 rounded-full bg-white border border-[#D4A143]/60 text-[#5E0B15] hover:bg-[#F6EAD4] flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {testimonials.map((t, idx) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTestimonialIdx(idx)}
                      aria-label={`View review ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === testimonialIdx
                          ? "w-6 bg-[#5E0B15]"
                          : "w-2 bg-[#D4A143]/60"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialIdx(
                      (prev) => (prev + 1) % testimonials.length
                    )
                  }
                  aria-label="Next testimonial"
                  className="w-9 h-9 rounded-full bg-white border border-[#D4A143]/60 text-[#5E0B15] hover:bg-[#F6EAD4] flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

