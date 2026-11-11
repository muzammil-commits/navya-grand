import React from "react";
import type { Metadata } from "next";
import { Clock, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { TableBookingForm } from "@/components/ReservationForms";
import { getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Book a Table",
  description:
    "Reserve a family dining table at Navya Grand, Vidyanagar Main Road, Guntur. Request lunch or dinner seating online.",
};

export const dynamic = "force-dynamic";

export default function BookATablePage() {
  const { contact } = getSiteContent();

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Fine Dining Reservations"
        title="Book a Table"
        description="Request your preferred dining date and time for family dinners, lunches, and special gatherings at Navya Grand."
        breadcrumbs={[{ label: "Book a Table" }]}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-8 shadow-md">
            <h2 className="font-display text-2xl font-bold text-[#3D050C] mb-4">
              Reservation Details
            </h2>
            <TableBookingForm />
          </div>

          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl overflow-hidden border-2 border-[#D4A143]/50 shadow-md aspect-[16/10]">
              <img
                src="/images/spaces/fine-dining.png"
                alt="Navya Grand Fine Dining Table Setting"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 space-y-3 text-sm">
              <h3 className="font-display text-xl font-bold text-[#3D050C]">
                Dining Hours &amp; Location
              </h3>
              <p className="flex items-start gap-2.5 text-[#4A2B24]">
                <Clock className="w-4 h-4 text-[#8B1524] shrink-0 mt-0.5" />
                <span>{contact.openingHours}</span>
              </p>
              <p className="flex items-start gap-2.5 text-[#4A2B24]">
                <MapPin className="w-4 h-4 text-[#8B1524] shrink-0 mt-0.5" />
                <span>
                  {contact.addressLine1}, {contact.addressLine2}, {contact.city}{" "}
                  – {contact.pincode}
                </span>
              </p>
              <p className="flex items-start gap-2.5 text-[#4A2B24]">
                <Phone className="w-4 h-4 text-[#8B1524] shrink-0 mt-0.5" />
                <span>
                  {contact.primaryPhone} | {contact.landline}
                </span>
              </p>
              <div className="pt-2 border-t border-[#D4A143]/25 space-y-1.5 text-xs text-[#664941]">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1524]" />
                  <span>Family AC Dining &amp; Group Tables available</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1524]" />
                  <span>For 40+ guests, please submit a Banquet Enquiry</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

