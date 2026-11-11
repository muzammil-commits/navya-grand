import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllReservations, getDb } from "@/lib/db";

const ALLOWED = ["Pending", "Confirmed", "Completed", "Cancelled"];

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ reservations: getAllReservations() });
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
        { error: "Invalid reservation ID or status." },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare("UPDATE table_reservations SET status = ? WHERE id = ?").run(
      status,
      id
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/reservations error:", error);
    return NextResponse.json(
      { error: "Failed to update reservation." },
      { status: 500 }
    );
  }
}

