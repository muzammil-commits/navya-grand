import { NextRequest, NextResponse } from "next/server";
import { createBanquetEnquiryRecord, generateReference } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerName = String(body.customerName || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const eventType = String(body.eventType || "").trim();
    const eventDate = String(body.eventDate || "").trim();
    const guestCount = Number(body.guestCount);
    const requirements = String(body.requirements || "").trim();
    const message = String(body.message || "").trim();

    if (customerName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!eventType) {
      return NextResponse.json(
        { error: "Please select an event type." },
        { status: 400 }
      );
    }

    if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      return NextResponse.json(
        { error: "Please select a valid event date." },
        { status: 400 }
      );
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (eventDate < todayStr) {
      return NextResponse.json(
        { error: "Event date cannot be in the past." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(guestCount) || guestCount < 15 || guestCount > 2000) {
      return NextResponse.json(
        { error: "Expected guest count must be between 15 and 2000." },
        { status: 400 }
      );
    }

    const enquiryRef = generateReference("BNQ");
    const now = new Date().toISOString();

    const enquiry = createBanquetEnquiryRecord({
      enquiryRef,
      customerName,
      phone,
      email,
      eventType,
      eventDate,
      guestCount,
      requirements,
      message,
      status: "New",
      createdAt: now,
    });

    return NextResponse.json(
      {
        enquiry,
        message:
          "Banquet enquiry submitted. Our events coordinator will contact you to confirm hall availability and custom menu packages.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/banquet-enquiries error:", error);
    return NextResponse.json(
      { error: "Unable to submit banquet enquiry right now." },
      { status: 500 }
    );
  }
}
