"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Mail,
  ShoppingBag,
  UtensilsCrossed,
  MapPin,
  PackageSearch,
} from "lucide-react";
import { NavyaLogo } from "./NavyaLogo";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import type { ContactInfo } from "@/lib/types";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Hygiene Standards", href: "/hygiene-standards" },
  { label: "Banquet Hall", href: "/banquet-hall" },
  { label: "Menu", href: "/menu" },
  { label: "Book a Table", href: "/book-a-table" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ contact }: { contact: ContactInfo }) {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const { openCart } = useUI();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Info Bar */}
      <div className="bg-[#4B0710] text-[#F8EEDB] text-[11px] sm:text-xs border-b border-[#D4A143]/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 min-w-0">
            <a
              href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1 hover:text-[#ECC572] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-[#D4A143] shrink-0" />
              <span>{contact.primaryPhone}</span>
            </a>
            <span className="hidden md:inline text-[#D4A143]/50">|</span>
            <a
              href={`tel:${contact.landline.replace(/\s+/g, "")}`}
              className="hidden md:inline-flex items-center gap-1 hover:text-[#ECC572] transition-colors whitespace-nowrap"
            >
              <span>{contact.landline}</span>
            </a>
            <span className="hidden sm:inline text-[#D4A143]/50">|</span>
            <a
              href={`mailto:${contact.email}`}
              className="hidden sm:inline-flex items-center gap-1 hover:text-[#ECC572] transition-colors truncate"
            >
              <Mail className="w-3 h-3 text-[#D4A143] shrink-0" />
              <span className="truncate">{contact.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/order-tracking"
              className="inline-flex items-center gap-1 text-[#ECC572] hover:text-white transition-colors font-medium whitespace-nowrap"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <a
              href={contact.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 hover:text-[#ECC572] transition-colors"
            >
              <MapPin className="w-3 h-3 text-[#D4A143]" />
              <span>Vidyanagar, Guntur</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#FDF7EC]/95 backdrop-blur-md border-b border-[#D4A143]/35">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-15 sm:h-[72px] flex items-center justify-between gap-1.5 sm:gap-2">
          <Link
            href="/"
            className="shrink-0 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B0F1A] rounded-lg"
            aria-label="Navya Grand Home"
          >
            <NavyaLogo variant="dark" compact />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden xl:flex items-center gap-1"
          >
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "text-[#6B0F1A] bg-[#D4A143]/20 font-semibold"
                      : "text-[#3B1814] hover:text-[#6B0F1A] hover:bg-[#D4A143]/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart, Order Now & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open shopping cart with ${itemCount} items`}
              className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D4A143]/50 bg-white/80 text-[#5E0B15] hover:bg-[#F6EAD4] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {hydrated && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 rounded-full bg-[#6B0F1A] text-[#ECC572] text-[10px] font-bold flex items-center justify-center border border-[#FDF7EC]">
                  {itemCount}
                </span>
              )}
            </button>

            <Link
              href="/order-now"
              className="btn-maroon inline-flex items-center gap-1 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-semibold transition-transform active:scale-95 whitespace-nowrap"
            >
              <UtensilsCrossed className="hidden min-[360px]:inline w-3.5 h-3.5 text-[#ECC572] shrink-0" />
              <span>Order Now</span>
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-[#D4A143]/40 bg-white/80 text-[#5E0B15] hover:bg-[#F6EAD4] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Slide-in Navigation Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed top-0 right-0 bottom-0 w-[min(86vw,340px)] bg-[#FDF7EC] border-l-2 border-[#D4A143]/50 shadow-2xl flex flex-col">
            <div className="px-4 py-3.5 bg-[#4B0710] text-[#F8EEDB] flex items-center justify-between border-b border-[#D4A143]/40">
              <NavyaLogo variant="light" compact />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-[#ECC572] hover:bg-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {NAV_LINKS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                      active
                        ? "bg-[#5E0B15] text-[#ECC572] font-semibold shadow-sm"
                        : "text-[#2B1410] hover:bg-[#F6EAD4]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-[#ECC572]" />
                    )}
                  </Link>
                );
              })}

              <div className="my-3 ornate-line" />

              <Link
                href="/order-now"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-semibold bg-[#D4A143]/25 text-[#5E0B15] hover:bg-[#D4A143]/35"
              >
                <span>Order Food Online</span>
                <UtensilsCrossed className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium text-[#2B1410] hover:bg-[#F6EAD4]"
              >
                <span>View Cart ({itemCount})</span>
                <ShoppingBag className="w-4 h-4 text-[#6B0F1A]" />
              </Link>
              <Link
                href="/order-tracking"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium text-[#2B1410] hover:bg-[#F6EAD4]"
              >
                <span>Track Your Order</span>
                <PackageSearch className="w-4 h-4 text-[#6B0F1A]" />
              </Link>
            </div>

            <div className="p-4 bg-[#4B0710] text-[#F8EEDB] text-xs space-y-2 border-t border-[#D4A143]/40">
              <p className="font-semibold text-[#ECC572]">
                {contact.addressLine1}, {contact.addressLine2}
              </p>
              <p>
                {contact.city} – {contact.pincode}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
                  className="underline hover:text-[#ECC572]"
                >
                  {contact.primaryPhone}
                </a>
                <a
                  href={`https://wa.me/${contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-300 hover:text-emerald-200"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

