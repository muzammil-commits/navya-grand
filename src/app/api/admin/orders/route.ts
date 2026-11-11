import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllOrders } from "@/lib/db";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: getAllOrders() });
}

