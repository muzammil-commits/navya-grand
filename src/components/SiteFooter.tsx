import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Navigation,
  Clock,
} from "lucide-react";
import { NavyaLogo } from "./NavyaLogo";
import type { ContactInfo } from "@/lib/types";

export function SiteFooter({ contact }: { contact: ContactInfo }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 text-[#F8EEDB]">
      {/* Curved Golden Top Wave */}
      <div className="w-full overflow-hidden leading-none -mb-px">
        <svg
          viewBox="0 0 1440 70"
          className="w-full h-8 sm:h-12 md:h-14 block"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,45 C360,0 1080,85 1440,25 L1440,70 L0,70 Z"
            fill="#D4A143"
          />
          <path
            d="M0,52 C360,8 1080,90 1440,32 L1440,70 L0,70 Z"
            fill="#4B0710"
          />
        </svg>
      </div>

      <div className="bg-[#4B0710] pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
            {/* Brand & Tagline */}
            <div className="lg:col-span-3 space-y-4">
              <Link href="/" className="inline-block">
                <NavyaLogo variant="light" />
              </Link>
              <p className="text-sm text-[#F8EEDB]/85 leading-relaxed">
                Good Food • Great Ambience • Lasting Memories.
              </p>
              <p className="text-xs text-[#ECC572]/90 inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{contact.openingHours}</span>
              </p>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="font-display text-lg font-bold text-[#ECC572] mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "/about" },
                  { label: "Hygiene Standards", href: "/hygiene-standards" },
                  { label: "Menu", href: "/menu" },
                  { label: "Gallery", href: "/gallery" },
                  { label: "Contact Us", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#F8EEDB]/85 hover:text-[#ECC572] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Services */}
            <div className="lg:col-span-2">
              <h3 className="font-display text-lg font-bold text-[#ECC572] mb-3">
                Our Services
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Fine Dining", href: "/book-a-table" },
                  { label: "Banquet Hall", href: "/banquet-hall" },
                  { label: "Order Online", href: "/order-now" },
                  { label: "Shopping Cart", href: "/cart" },
                  { label: "Track Order", href: "/order-tracking" },
                  { label: "Admin Portal", href: "/admin" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#F8EEDB]/85 hover:text-[#ECC572] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-display text-lg font-bold text-[#ECC572]">
                Contact Us
              </h3>
              <div className="space-y-2.5 text-sm text-[#F8EEDB]/90">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ECC572] shrink-0 mt-0.5" />
                  <span>
                    {contact.addressLine1},<br />
                    {contact.addressLine2},<br />
                    {contact.city} – {contact.pincode}
                  </span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#ECC572] shrink-0" />
                  <span>
                    <a
                      href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
                      className="hover:text-[#ECC572]"
                    >
                      {contact.primaryPhone}
                    </a>
                    {" | "}
                    <a
                      href={`tel:${contact.landline.replace(/\s+/g, "")}`}
                      className="hover:text-[#ECC572]"
                    >
                      {contact.landline}
                    </a>
                  </span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#ECC572] shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-[#ECC572] break-all"
                  >
                    {contact.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Get In Touch CTAs */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display text-lg font-bold text-[#ECC572]">
                Get In Touch
              </h3>
              <div className="flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
                    "Hello Navya Grand, I would like to enquire about dining / ordering."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={contact.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>Find Us on Map</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#D4A143]/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#F8EEDB]/75 text-center sm:text-left">
            <p>© {year} Navya Grand, Guntur. All Rights Reserved.</p>
            <p>Multi-Cuisine Restaurant, Fine Dining &amp; Banquet Hall</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

