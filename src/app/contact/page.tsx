import React from "react";
import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Navigation,
} from "lucide-react";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { ContactFormClient } from "@/components/ContactFormClient";
import { getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Visit Navya Grand at Bolla's Mansion, Beside Don Bosco, Vidyanagar Main Road, Guntur – 522007. Call +91 8500212200 or 0863-2222100.",
};

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const { contact } = getSiteContent();

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Visit or Reach Out"
        title="Contact Navya Grand"
        description="We look forward to welcoming you in Vidyanagar, Guntur for dining, takeaway, or celebrations."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="font-display text-2xl font-bold text-[#3D050C]">
                Restaurant Address
              </h2>

              <div className="space-y-3 text-sm text-[#4A2B24]">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#8B1524] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#3D050C]">
                      {contact.brandName}
                    </strong>
                    <br />
                    {contact.addressLine1}
                    <br />
                    {contact.addressLine2}
                    <br />
                    {contact.city} – {contact.pincode}
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#8B1524] shrink-0" />
                  <span>
                    <a
                      href={`tel:${contact.primaryPhone.replace(/\s+/g, "")}`}
                      className="font-semibold hover:text-[#5E0B15]"
                    >
                      {contact.primaryPhone}
                    </a>
                    {" | "}
                    <a
                      href={`tel:${contact.landline.replace(/\s+/g, "")}`}
                      className="font-semibold hover:text-[#5E0B15]"
                    >
                      {contact.landline}
                    </a>
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#8B1524] shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-[#5E0B15] break-all"
                  >
                    {contact.email}
                  </a>
                </p>

                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#8B1524] shrink-0" />
                  <span>{contact.openingHours}</span>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
                    "Hello Navya Grand, I have an enquiry."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={contact.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-7 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-[#3D050C] mb-4">
              Send Us a Message
            </h2>
            <ContactFormClient />
          </div>
        </div>

        {/* Map Embed */}
        <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-3 shadow-sm overflow-hidden">
          <iframe
            title="Navya Grand Location Map – Vidyanagar Main Road, Guntur"
            src={contact.mapEmbedUrl}
            className="w-full h-72 sm:h-96 rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

