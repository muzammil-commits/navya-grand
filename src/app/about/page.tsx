import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Gem,
  ShieldCheck,
  Smile,
  Heart,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story, hospitality values, and culinary craft of Navya Grand – Multi-Cuisine Restaurant, Fine Dining & Banquet Hall in Vidyanagar, Guntur.",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const { about, contact } = getSiteContent();

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Our Heritage & Hospitality"
        title={about.heading}
        description="Good Food • Great Ambience • Lasting Memories in the heart of Vidyanagar, Guntur."
        breadcrumbs={[{ label: "About Us" }]}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-5 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8B1524]">
              Vidyanagar Main Road, Guntur
            </p>
            <h2 className="heading-section font-display font-bold text-[#3D050C]">
              A Destination for Family Dining &amp; Grand Celebrations
            </h2>
            <p className="text-sm sm:text-base text-[#4A2B24] leading-relaxed">
              {about.summary}
            </p>
            <p className="text-sm sm:text-base text-[#664941] leading-relaxed">
              {about.extendedStory}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="btn-maroon inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#ECC572]" />
                <span>Explore Menu</span>
              </Link>
              <Link
                href="/book-a-table"
                className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold"
              >
                <span>Reserve a Table</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 rounded-2xl overflow-hidden border-2 border-[#D4A143]/60 aspect-[16/9]">
              <img
                src={about.imageUrl}
                alt="Navya Grand Dining Hall"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#D4A143]/40 aspect-[4/3]">
              <img
                src="/images/spaces/fine-dining.png"
                alt="Fine Dining Table Experience"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#D4A143]/40 aspect-[4/3]">
              <img
                src="/images/spaces/private-dining.png"
                alt="Private Dining Gathering Space"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="heading-section font-display font-bold text-[#5E0B15]">
              Our Culinary Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {about.pillars.map((pillar) => {
              const Icon =
                pillar.icon === "gem"
                  ? Gem
                  : pillar.icon === "shield"
                  ? ShieldCheck
                  : pillar.icon === "smile"
                  ? Smile
                  : Heart;
              return (
                <div
                  key={pillar.title}
                  className="bg-white/95 rounded-2xl border border-[#D4A143]/40 p-6 text-center shadow-xs space-y-2.5"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#5E0B15] text-[#ECC572] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#3D050C]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#664941] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Visit CTA */}
        <section className="maroon-velvet text-[#FDF7EC] rounded-3xl border border-[#D4A143]/50 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Visit Navya Grand Today
            </h2>
            <p className="text-sm sm:text-base text-[#F8EEDB]/90">
              {contact.addressLine1}, {contact.addressLine2}, {contact.city} –{" "}
              {contact.pincode}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Link
              href="/order-now"
              className="btn-gold px-6 py-3 rounded-full text-sm font-bold"
            >
              Order Food Online
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full border border-[#ECC572] text-white text-sm font-semibold hover:bg-white/10"
            >
              Contact &amp; Directions
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

