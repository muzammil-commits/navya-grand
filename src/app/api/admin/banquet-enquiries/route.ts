import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllBanquetEnquiries, updateBanquetEnquiryStatus } from "@/lib/db";
import type { BanquetEnquiry } from "@/lib/types";

const ALLOWED: BanquetEnquiry["status"][] = [
  "New",
  "Contacted",
  "Site Visit Scheduled",
  "Booked",
  "Closed",
];

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ enquiries: getAllBanquetEnquiries() });
}

export async function PATCH(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = Number(body.id);
    const status = String(body.status || "") as BanquetEnquiry["status"];
    if (!id || !ALLOWED.includes(status)) {
      return NextResponse.json(
        { error: "Invalid enquiry ID or status." },
        { status: 400 }
      );
    }

    updateBanquetEnquiryStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/banquet-enquiries error:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry." },
      { status: 500 }
    );
  }
}
