import React from "react";
import type { Metadata } from "next";
import {
  Crown,
  Users,
  Utensils,
  Sparkles,
  Music,
  CheckCircle2,
} from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { BanquetEnquiryForm } from "@/components/ReservationForms";

export const metadata: Metadata = {
  title: "Banquet Hall & Events",
  description:
    "Host weddings, receptions, engagements, birthday parties, and corporate events at Navya Grand Banquet Hall in Vidyanagar, Guntur.",
};

const EVENT_HIGHLIGHTS = [
  {
    icon: Crown,
    title: "Weddings & Receptions",
    desc: "Grand banquet seating, floral stage arrangements, and traditional Andhra wedding feasts.",
  },
  {
    icon: Users,
    title: "Birthdays & Family Functions",
    desc: "Warm, customizable celebrations for naming ceremonies, anniversaries, and milestone birthdays.",
  },
  {
    icon: Music,
    title: "Corporate Conferences & Dinners",
    desc: "Air-conditioned hall with presentation-friendly layout, buffet dining, and attentive hospitality.",
  },
  {
    icon: Utensils,
    title: "Custom Catering Menus",
    desc: "Tailored Pure Veg, Andhra Non-Veg, Biryani & Multi-Cuisine buffet packages curated by our chefs.",
  },
];

export default function BanquetHallPage() {
  return (
    <div>
      <PageHeaderBanner
        eyebrow="Celebrate Every Special Moment"
        title="Navya Grand Banquet Hall"
        description="An elegant venue in Vidyanagar, Guntur for weddings, receptions, engagements, birthdays, and corporate events."
        breadcrumbs={[{ label: "Banquet Hall" }]}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border-2 border-[#D4A143]/60 shadow-lg min-h-[260px]">
            <img
              src="/images/spaces/banquet-hall.png"
              alt="Navya Grand Banquet Hall Interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border-2 border-[#D4A143]/60 shadow-lg min-h-[240px]">
            <img
              src="/images/spaces/wedding-arrangements.png"
              alt="Wedding & Reception Celebration Setup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Event Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EVENT_HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white/95 rounded-2xl border border-[#D4A143]/40 p-5 space-y-2.5 shadow-xs"
              >
                <div className="w-11 h-11 rounded-full bg-[#5E0B15] text-[#ECC572] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-display text-lg font-bold text-[#3D050C]">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#664941] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Enquiry Section */}
        <section
          id="enquire"
          className="bg-white/95 rounded-3xl border-2 border-[#D4A143]/50 p-5 sm:p-8 lg:p-10 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF7EC] border border-[#D4A143]/50 text-xs font-bold text-[#8B1524]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Banquet Booking Enquiry</span>
            </div>
            <h2 className="heading-section font-display font-bold text-[#3D050C]">
              Plan Your Event with Us
            </h2>
            <p className="text-sm text-[#664941] leading-relaxed">
              Share your event date, expected guest count, and catering
              preferences. Our events coordinator will reach out with available
              slots and tailored menu options.
            </p>
            <ul className="space-y-2 text-sm text-[#3D050C]">
              {[
                "Centralized AC Banquet Space in Vidyanagar",
                "Customizable Veg & Non-Veg Feast Packages",
                "Flexible Seating Layouts & Stage Coordination",
                "Dedicated Hospitality & Banquet Staff",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8B1524] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <BanquetEnquiryForm />
          </div>
        </section>
      </div>
    </div>
  );
}

