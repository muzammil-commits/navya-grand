"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowUp,
  ArrowRight,
} from "lucide-react";
import { useUI } from "@/context/UIContext";
import { CartDrawer } from "./CartDrawer";
import { ProductDetailModal } from "./ProductDetailModal";
import { TableBookingForm, BanquetEnquiryForm } from "./ReservationForms";
import type { ContactInfo } from "@/lib/types";

export function GlobalPopups({ contact }: { contact: ContactInfo }) {
  const {
    isBookingOpen,
    closeBookingModal,
    isBanquetOpen,
    closeBanquetModal,
    selectedService,
    closeServiceModal,
    toasts,
    dismissToast,
  } = useUI();

  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 450);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <CartDrawer />
      <ProductDetailModal />

      {/* Table Booking Popup */}
      {isBookingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Book a Table"
        >
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            onClick={closeBookingModal}
          />
          <div className="relative z-10 w-full max-w-xl max-h-[90dvh] overflow-y-auto bg-[#FDF7EC] rounded-3xl border-2 border-[#D4A143]/55 shadow-2xl p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8B1524]">
                  Navya Grand Dining
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D050C]">
                  Book a Table
                </h2>
              </div>
              <button
                type="button"
                onClick={closeBookingModal}
                aria-label="Close booking dialog"
                className="w-9 h-9 rounded-full bg-[#F6EAD4] text-[#5E0B15] hover:bg-[#D4A143]/30 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <TableBookingForm />
          </div>
        </div>
      )}

      {/* Banquet Enquiry Popup */}
      {isBanquetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Banquet Hall Enquiry"
        >
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            onClick={closeBanquetModal}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#FDF7EC] rounded-3xl border-2 border-[#D4A143]/55 shadow-2xl p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8B1524]">
                  Celebrations &amp; Events
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D050C]">
                  Banquet Hall Enquiry
                </h2>
              </div>
              <button
                type="button"
                onClick={closeBanquetModal}
                aria-label="Close banquet enquiry dialog"
                className="w-9 h-9 rounded-full bg-[#F6EAD4] text-[#5E0B15] hover:bg-[#D4A143]/30 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BanquetEnquiryForm />
          </div>
        </div>
      )}

      {/* Service Details Popup */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={selectedService.title}
        >
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            onClick={closeServiceModal}
          />
          <div className="relative z-10 w-full max-w-xl max-h-[90dvh] overflow-y-auto bg-[#FDF7EC] rounded-3xl border-2 border-[#D4A143]/55 shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={closeServiceModal}
              aria-label="Close service details"
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[16/9] w-full bg-[#F6EAD4]">
              <img
                src={selectedService.imageUrl}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D050C]">
                {selectedService.title}
              </h2>
              <p className="text-sm sm:text-base text-[#664941] leading-relaxed">
                {selectedService.fullDescription}
              </p>
              <ul className="space-y-2">
                {selectedService.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-[#3D050C]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#8B1524] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href={selectedService.actionHref}
                  onClick={closeServiceModal}
                  className="btn-maroon inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                >
                  <span>{selectedService.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 text-[#ECC572]" />
                </Link>
                <button
                  type="button"
                  onClick={closeServiceModal}
                  className="px-5 py-2.5 rounded-full border border-[#D4A143] text-[#5E0B15] text-sm font-semibold hover:bg-[#F6EAD4] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div
        aria-live="polite"
        className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm sm:ml-auto"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#4B0710] text-[#F8EEDB] border border-[#D4A143]/60 rounded-2xl px-4 py-3 shadow-xl flex items-start gap-3"
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#ECC572] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#ECC572] mt-0.5">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#F8EEDB]/70 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Floating WhatsApp & Back-to-Top (compact bottom-right so it never blocks forms) */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
        {showBackTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="w-10 h-10 rounded-full bg-[#5E0B15] text-[#ECC572] border border-[#D4A143]/60 shadow-lg hover:bg-[#4B0710] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
        <a
          href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
            "Hello Navya Grand, I would like to enquire about dining / food order."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </>
  );
}

