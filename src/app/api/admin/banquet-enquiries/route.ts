import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllBanquetEnquiries, getDb } from "@/lib/db";

const ALLOWED = [
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
    const status = String(body.status || "");
    if (!id || !ALLOWED.includes(status)) {
      return NextResponse.json(
        { error: "Invalid enquiry ID or status." },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare("UPDATE banquet_enquiries SET status = ? WHERE id = ?").run(
      status,
      id
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/banquet-enquiries error:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry." },
      { status: 500 }
    );
  }
}

