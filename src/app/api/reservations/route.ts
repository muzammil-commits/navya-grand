import { NextRequest, NextResponse } from "next/server";
import { generateReference, getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerName = String(body.customerName || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const reservationDate = String(body.reservationDate || "").trim();
    const reservationTime = String(body.reservationTime || "").trim();
    const guestCount = Number(body.guestCount);
    const specialRequests = String(body.specialRequests || "").trim();

    if (customerName.length < 2) {
      return NextResponse.json(
        { error: "Please provide your full name." },
        { status: 400 }
      );
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!reservationDate || !/^\d{4}-\d{2}-\d{2}$/.test(reservationDate)) {
      return NextResponse.json(
        { error: "Please select a valid reservation date." },
        { status: 400 }
      );
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (reservationDate < todayStr) {
      return NextResponse.json(
        { error: "Reservation date cannot be in the past." },
        { status: 400 }
      );
    }

    if (!reservationTime) {
      return NextResponse.json(
        { error: "Please choose a preferred dining time." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 40) {
      return NextResponse.json(
        { error: "Guest count must be between 1 and 40 for table reservations. For larger events, please submit a Banquet Enquiry." },
        { status: 400 }
      );
    }

    const reservationRef = generateReference("TBL");
    const now = new Date().toISOString();

    const db = getDb();
    db.prepare(
      `INSERT INTO table_reservations (
        reservation_ref, customer_name, phone, email,
        reservation_date, reservation_time, guest_count,
        special_requests, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      reservationRef,
      customerName,
      phone,
      email,
      reservationDate,
      reservationTime,
      guestCount,
      specialRequests,
      "Pending",
      now
    );

    return NextResponse.json(
      {
        reservation: {
          reservationRef,
          customerName,
          reservationDate,
          reservationTime,
          guestCount,
          status: "Pending",
          createdAt: now,
        },
        message:
          "Reservation request received. Our hospitality desk will call you shortly to confirm table availability.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reservations error:", error);
    return NextResponse.json(
      { error: "Unable to submit table reservation request." },
      { status: 500 }
    );
  }
}

