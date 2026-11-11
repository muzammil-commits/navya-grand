import React from "react";
import type { Metadata } from "next";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { CheckoutClient } from "@/components/CheckoutClient";
import { getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your food order with Navya Grand, Vidyanagar, Guntur. Delivery across supported Guntur pincodes or quick takeaway.",
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const { deliveryConfig, contact } = getSiteContent();

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Secure Checkout"
        title="Complete Your Order"
        description="Review your dishes, select Home Delivery or Restaurant Takeaway, and confirm your payment option."
        breadcrumbs={[
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <CheckoutClient deliveryConfig={deliveryConfig} contact={contact} />
    </div>
  );
}

