"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Calendar, Users } from "lucide-react";

const TIME_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
];

const EVENT_TYPES = [
  "Wedding Reception",
  "Engagement Ceremony",
  "Birthday Celebration",
  "Anniversary Dinner",
  "Corporate Conference / Dinner",
  "Family Get-Together",
  "Other Event",
];

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TableBookingForm({
  onSuccess,
}: {
  onSuccess?: (ref: string) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reservationDate, setReservationDate] = useState(getTodayIso());
  const [reservationTime, setReservationTime] = useState("07:30 PM");
  const [guestCount, setGuestCount] = useState(4);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<{
    ref: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          reservationDate,
          reservationTime,
          guestCount: Number(guestCount),
          specialRequests,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit reservation.");
      } else {
        setSuccessData({
          ref: data.reservation.reservationRef,
          message: data.message,
        });
        onSuccess?.(data.reservation.reservationRef);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
        <h3 className="font-display text-2xl font-bold text-emerald-950">
          Reservation Request Received
        </h3>
        <p className="text-sm font-semibold text-emerald-900">
          Reference: <span className="font-mono">{successData.ref}</span>
        </p>
        <p className="text-sm text-emerald-800">{successData.message}</p>
        <button
          type="button"
          onClick={() => {
            setSuccessData(null);
            setCustomerName("");
            setPhone("");
            setEmail("");
            setSpecialRequests("");
          }}
          className="btn-maroon px-5 py-2 rounded-full text-sm font-semibold cursor-pointer"
        >
          Make Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Date *
          </label>
          <input
            type="date"
            required
            min={getTodayIso()}
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Preferred Time *
          </label>
          <select
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Guests (1–40) *
          </label>
          <input
            type="number"
            required
            min={1}
            max={40}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
          Email (Optional)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
          Special Requests
        </label>
        <textarea
          rows={2}
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Birthday table setup, high chair, family booth preference..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
        />
      </div>

      <p className="text-xs text-[#664941]">
        Note: Submitting this form sends a reservation request. Table
        availability is confirmed by our hospitality desk via call.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="btn-maroon w-full py-3 px-6 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Request...</span>
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 text-[#ECC572]" />
            <span>Request Table Reservation</span>
          </>
        )}
      </button>
    </form>
  );
}

export function BanquetEnquiryForm({
  onSuccess,
}: {
  onSuccess?: (ref: string) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [eventDate, setEventDate] = useState(getTodayIso());
  const [guestCount, setGuestCount] = useState(150);
  const [requirements, setRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<{
    ref: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/banquet-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          eventType,
          eventDate,
          guestCount: Number(guestCount),
          requirements,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit banquet enquiry.");
      } else {
        setSuccessData({
          ref: data.enquiry.enquiryRef,
          message: data.message,
        });
        onSuccess?.(data.enquiry.enquiryRef);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
        <h3 className="font-display text-2xl font-bold text-emerald-950">
          Banquet Enquiry Submitted
        </h3>
        <p className="text-sm font-semibold text-emerald-900">
          Enquiry Ref: <span className="font-mono">{successData.ref}</span>
        </p>
        <p className="text-sm text-emerald-800">{successData.message}</p>
        <button
          type="button"
          onClick={() => {
            setSuccessData(null);
            setCustomerName("");
            setPhone("");
            setEmail("");
            setRequirements("");
            setMessage("");
          }}
          className="btn-maroon px-5 py-2 rounded-full text-sm font-semibold cursor-pointer"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Contact Name *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Event Type *
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          >
            {EVENT_TYPES.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Event Date *
          </label>
          <input
            type="date"
            required
            min={getTodayIso()}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Expected Guests *
          </label>
          <input
            type="number"
            required
            min={15}
            max={2000}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
            Catering / Setup Requirements
          </label>
          <input
            type="text"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Veg/Non-Veg Buffet, Stage Decor, AV..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E0B15] mb-1">
          Additional Notes
        </label>
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your event schedule, preferred time slot (morning/evening), or menu preferences..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4A143]/50 text-base sm:text-sm text-[#2B1410] focus:outline-none focus:ring-2 focus:ring-[#6B0F1A]"
        />
      </div>

      <p className="text-xs text-[#664941]">
        Hall availability and final quotes are confirmed by our Banquet Events
        Coordinator after reviewing your event date and requirements.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold w-full py-3 px-6 rounded-full text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Enquiry...</span>
          </>
        ) : (
          <>
            <Users className="w-4 h-4" />
            <span>Submit Banquet Enquiry</span>
          </>
        )}
      </button>
    </form>
  );
}

