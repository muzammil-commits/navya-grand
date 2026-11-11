import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { MenuCatalogClient } from "@/components/MenuCatalogClient";
import { getAllCategories, getAllProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore the complete Navya Grand Guntur menu: Signature Dum Biryanis, Andhra Specials, Tandoori, Chinese, South Indian, Seafood, Desserts, and Beverages.",
};

export const dynamic = "force-dynamic";

export default function MenuPage() {
  const categories = getAllCategories();
  const products = getAllProducts(true);

  return (
    <div>
      <PageHeaderBanner
        eyebrow="Culinary Catalog"
        title="Our Multi-Cuisine Menu"
        description="Hand-crafted Andhra delicacies, royal dum biryanis, smoky tandoori kebabs, and comforting South Indian classics."
        breadcrumbs={[{ label: "Menu" }]}
      />
      <Suspense fallback={<div className="p-10 text-center">Loading menu...</div>}>
        <MenuCatalogClient categories={categories} products={products} />
      </Suspense>
    </div>
  );
}

