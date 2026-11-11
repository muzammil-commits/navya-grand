import { NextRequest, NextResponse } from "next/server";
import {
  createOrderRecord,
  generateReference,
  getProductById,
  getSiteContent,
} from "@/lib/db";
import type {
  OrderItemSnapshot,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/types";

interface IncomingOrderItem {
  productId: number;
  variantLabel?: string | null;
  quantity: number;
  instructions?: string;
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "").trim();
}

function isValidIndianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerName = String(body.customerName || "").trim();
    const phone = normalizePhone(String(body.phone || ""));
    const email = String(body.email || "").trim();
    const orderType: OrderType =
      body.orderType === "takeaway" ? "takeaway" : "delivery";
    const address = String(body.address || "").trim();
    const landmark = String(body.landmark || "").trim();
    const city = String(body.city || "Guntur").trim();
    const pincode = String(body.pincode || "").trim();
    const instructions = String(body.instructions || "").trim();
    const paymentMethod = String(body.paymentMethod || "") as PaymentMethod;
    const paymentRef = String(body.paymentRef || "").trim();
    const incomingItems: IncomingOrderItem[] = Array.isArray(body.items)
      ? body.items
      : [];

    if (customerName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (incomingItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const siteContent = getSiteContent();
    const deliveryConfig = siteContent.deliveryConfig;

    if (orderType === "delivery") {
      if (address.length < 6) {
        return NextResponse.json(
          { error: "Please enter a complete delivery address." },
          { status: 400 }
        );
      }
      if (!deliveryConfig.supportedPincodes.includes(pincode)) {
        return NextResponse.json(
          {
            error: `Delivery is currently available only in Guntur supported pincodes (${deliveryConfig.supportedPincodes.join(", ")}). You can still choose Restaurant Takeaway.`,
          },
          { status: 400 }
        );
      }
    }

    const allowedMethods: PaymentMethod[] =
      orderType === "delivery"
        ? ["cod", "upi", "gateway"]
        : ["pickup", "upi", "gateway"];

    if (!allowedMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Selected payment method is not supported for this order type." },
        { status: 400 }
      );
    }

    if (paymentMethod === "gateway" && !deliveryConfig.gatewayConfigured) {
      return NextResponse.json(
        {
          error:
            "Online payment gateway is pending merchant key configuration. Please choose Cash on Delivery / Pay at Pickup or UPI Transfer Verification.",
        },
        { status: 400 }
      );
    }

    if (paymentMethod === "upi" && paymentRef.length < 6) {
      return NextResponse.json(
        {
          error:
            "Please enter your UPI transaction / UTR reference number (at least 6 characters) after initiating the transfer, or select Cash on Delivery / Pay at Pickup.",
        },
        { status: 400 }
      );
    }

    const verifiedItems: OrderItemSnapshot[] = [];
    let subtotal = 0;

    for (const item of incomingItems) {
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
        return NextResponse.json(
          { error: "Invalid item quantity requested." },
          { status: 400 }
        );
      }

      const product = getProductById(Number(item.productId));
      if (!product) {
        return NextResponse.json(
          { error: "One or more selected dishes no longer exist." },
          { status: 400 }
        );
      }
      if (!product.isAvailable) {
        return NextResponse.json(
          {
            error: `"${product.name}" is currently unavailable. Please remove it from your cart.`,
          },
          { status: 400 }
        );
      }

      let unitPrice = product.price;
      let resolvedVariant: string | null = null;

      if (item.variantLabel && product.variants.length > 0) {
        const matched = product.variants.find(
          (v) => v.label === item.variantLabel
        );
        if (!matched) {
          return NextResponse.json(
            {
              error: `Selected portion size for "${product.name}" is no longer available.`,
            },
            { status: 400 }
          );
        }
        unitPrice = matched.price;
        resolvedVariant = matched.label;
      }

      const lineTotal = Math.round(unitPrice * qty * 100) / 100;
      subtotal += lineTotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        variantLabel: resolvedVariant,
        unitPrice,
        quantity: qty,
        lineTotal,
        instructions: item.instructions
          ? String(item.instructions).trim().slice(0, 200)
          : undefined,
      });
    }

    const deliveryCharge =
      orderType === "delivery" && subtotal < deliveryConfig.freeDeliveryAbove
        ? deliveryConfig.deliveryFee
        : 0;
    const taxAmount =
      Math.round(((subtotal * deliveryConfig.taxRatePercent) / 100) * 100) /
      100;
    const discountAmount = 0;
    const totalAmount =
      Math.round((subtotal + deliveryCharge + taxAmount - discountAmount) * 100) /
      100;

    let paymentStatus: PaymentStatus = "pending";
    if (paymentMethod === "upi") {
      paymentStatus = "awaiting_verification";
    }

    const orderRef = generateReference("NG");
    const now = new Date().toISOString();
    const estimatedTime =
      orderType === "delivery"
        ? "35–45 mins (subject to kitchen confirmation)"
        : "20–30 mins (subject to kitchen confirmation)";

    const order = createOrderRecord({
      orderRef,
      customerName,
      phone,
      email,
      orderType,
      address:
        orderType === "delivery"
          ? address
          : "Restaurant Counter Pickup (Vidyanagar Main Road, Guntur)",
      landmark,
      city: city || "Guntur",
      pincode: orderType === "delivery" ? pincode : "522007",
      instructions,
      items: verifiedItems,
      subtotal,
      deliveryCharge,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      paymentRef,
      orderStatus: "Order Placed",
      estimatedTime,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Unable to place order right now. Please try again." },
      { status: 500 }
    );
  }
}
