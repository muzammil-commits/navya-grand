import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { MenuCatalogClient } from "@/components/MenuCatalogClient";
import { getAllCategories, getAllProducts, getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Order Food Online",
  description:
    "Order fresh Andhra Biryani, curries, tandoori, and tiffins online from Navya Grand, Vidyanagar Main Road, Guntur.",
};

export const dynamic = "force-dynamic";

export default function OrderNowPage() {
  const categories = getAllCategories();
  const products = getAllProducts(false);
  const { deliveryConfig } = getSiteContent();

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Online Food Ordering"
        title="Order Fresh from Navya Grand"
        description={`Local delivery across Guntur (${deliveryConfig.supportedPincodes.slice(0, 5).join(", ")}...) & express counter takeaway at Vidyanagar Main Road.`}
        breadcrumbs={[{ label: "Order Now" }]}
      />
      <Suspense fallback={<div className="p-10 text-center">Loading dishes...</div>}>
        <MenuCatalogClient
          categories={categories}
          products={products}
          orderMode
        />
      </Suspense>
    </div>
  );
}

