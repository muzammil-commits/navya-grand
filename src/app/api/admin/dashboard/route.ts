import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import {
  getAllBanquetEnquiries,
  getAllOrders,
  getAllProducts,
  getAllReservations,
} from "@/lib/db";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = getAllOrders();
    const reservations = getAllReservations();
    const enquiries = getAllBanquetEnquiries();
    const products = getAllProducts(true);

    const todayPrefix = new Date().toISOString().slice(0, 10);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) =>
      [
        "Order Placed",
        "Order Accepted",
        "Preparing",
        "Ready for Pickup",
        "Out for Delivery",
      ].includes(o.orderStatus)
    ).length;
    const completedOrders = orders.filter(
      (o) => o.orderStatus === "Delivered"
    ).length;
    const todayOrders = orders.filter((o) =>
      o.createdAt.startsWith(todayPrefix)
    ).length;
    const paidRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((acc, o) => acc + o.totalAmount, 0);

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        todayOrders,
        paidRevenue,
        totalProducts: products.length,
        pendingReservations: reservations.filter((r) => r.status === "Pending")
          .length,
        newEnquiries: enquiries.filter((e) => e.status === "New").length,
      },
      recentOrders: orders.slice(0, 10),
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics." },
      { status: 500 }
    );
  }
}

