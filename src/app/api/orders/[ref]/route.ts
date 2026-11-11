import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getOrderByRef } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const { searchParams } = new URL(req.url);
    const phone = (searchParams.get("phone") || "").replace(/\D/g, "");

    const order = getOrderByRef(ref);
    if (!order) {
      return NextResponse.json(
        { error: "Order reference not found." },
        { status: 404 }
      );
    }

    const admin = await getCurrentAdmin();
    const orderDigits = order.phone.replace(/\D/g, "");
    const phoneMatches =
      phone.length >= 4 && orderDigits.endsWith(phone.slice(-10));

    if (!admin && !phoneMatches) {
      return NextResponse.json(
        {
          error:
            "Please provide the mobile number used when placing this order to view full tracking details.",
          requiresPhone: true,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("GET /api/orders/[ref] error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order details." },
      { status: 500 }
    );
  }
}

