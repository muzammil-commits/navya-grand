import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

const ALLOWED_ORDER_STATUSES: OrderStatus[] = [
  "Order Placed",
  "Order Accepted",
  "Preparing",
  "Ready for Pickup",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const ALLOWED_PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "awaiting_verification",
  "paid",
  "failed",
];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const orderStatus = body.orderStatus as OrderStatus | undefined;
    const paymentStatus = body.paymentStatus as PaymentStatus | undefined;
    const estimatedTime =
      body.estimatedTime !== undefined ? String(body.estimatedTime) : undefined;

    if (orderStatus && !ALLOWED_ORDER_STATUSES.includes(orderStatus)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }
    if (paymentStatus && !ALLOWED_PAYMENT_STATUSES.includes(paymentStatus)) {
      return NextResponse.json(
        { error: "Invalid payment status." },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = db
      .prepare("SELECT id, order_status, payment_status, estimated_time FROM orders WHERE id = ?")
      .get(Number(id)) as
      | {
          id: number;
          order_status: string;
          payment_status: string;
          estimated_time: string;
        }
      | undefined;

    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    db.prepare(
      "UPDATE orders SET order_status = ?, payment_status = ?, estimated_time = ?, updated_at = ? WHERE id = ?"
    ).run(
      orderStatus || existing.order_status,
      paymentStatus || existing.payment_status,
      estimatedTime !== undefined ? estimatedTime : existing.estimated_time,
      new Date().toISOString(),
      Number(id)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update order." },
      { status: 500 }
    );
  }
}

