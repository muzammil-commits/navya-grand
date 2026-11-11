import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  ThermometerSnowflake,
  Droplets,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";

export const metadata: Metadata = {
  title: "Hygiene Standards",
  description:
    "Explore Navya Grand's kitchen hygiene practices, fresh ingredient sourcing, food safety protocols, and spill-proof delivery packaging.",
};

const STANDARDS = [
  {
    icon: Sparkles,
    title: "Daily Kitchen Sanitization",
    description:
      "Stainless-steel prep counters, cooking vessels, and cutting stations are thoroughly cleaned and sanitized before and after every service shift.",
  },
  {
    icon: ShieldCheck,
    title: "Chef & Staff Grooming",
    description:
      "Our culinary and service staff follow strict hand-washing routines and wear clean uniforms, aprons, hair protection, and food-handling gloves where required.",
  },
  {
    icon: ThermometerSnowflake,
    title: "Temperature-Controlled Storage",
    description:
      "Fresh poultry, meats, seafood, dairy, and produce are stored in dedicated, temperature-monitored chillers to preserve natural freshness.",
  },
  {
    icon: Droplets,
    title: "Purified Cooking Water",
    description:
      "RO-purified water is used for cooking, ice preparation, beverage mixing, and washing fresh vegetables and herbs.",
  },
  {
    icon: PackageCheck,
    title: "Food-Grade Tamper-Evident Packaging",
    description:
      "Every online delivery and takeaway order is packed in clean, spill-resistant, food-grade containers sealed at dispatch.",
  },
  {
    icon: CheckCircle2,
    title: "Fresh Spice Grinding & Oil Care",
    description:
      "We prepare fresh spice blends in controlled batches and monitor cooking oils regularly so every dish tastes clean and authentic.",
  },
];

export default function HygieneStandardsPage() {
  return (
    <div>
      <PageHeaderBanner
        eyebrow="Quality & Food Safety"
        title="Our Hygiene Standards"
        description="Cleanliness, fresh ingredients, and disciplined kitchen practices sit at the heart of every meal served at Navya Grand."
        breadcrumbs={[{ label: "Hygiene Standards" }]}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden border-2 border-[#D4A143]/50 shadow-md aspect-[16/10] bg-white">
            <img
              src="/images/hygiene/kitchen-hygiene.png"
              alt="Clean Navya Grand Dining & Service Environment"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-3xl overflow-hidden border-2 border-[#D4A143]/50 shadow-md aspect-[16/10] bg-white">
            <img
              src="/images/hygiene/food-preparation.png"
              alt="Fresh Culinary Preparation and Authentic Biryani Garnish"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STANDARDS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="bg-white/95 rounded-2xl border border-[#D4A143]/40 p-6 shadow-xs space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#5E0B15] text-[#ECC572] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="font-display text-xl font-bold text-[#3D050C]">
                  {item.title}
                </h2>
                <p className="text-sm text-[#664941] leading-relaxed">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#3D050C]">
              Ready to Dine or Order with Confidence?
            </h2>
            <p className="text-sm text-[#664941] mt-1">
              Explore our menu for online ordering or book a table for your next
              family dinner in Guntur.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/order-now"
              className="btn-maroon px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 text-[#ECC572]" />
            </Link>
            <Link
              href="/book-a-table"
              className="btn-gold px-6 py-2.5 rounded-full text-sm font-bold"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

