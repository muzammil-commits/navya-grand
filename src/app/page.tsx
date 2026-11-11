import React from "react";
import { HomeClient } from "@/components/HomeClient";
import {
  getAllCategories,
  getSignatureProducts,
  getSiteContent,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const siteContent = getSiteContent();
  const signatureProducts = getSignatureProducts();
  const categories = getAllCategories();

  return (
    <HomeClient
      siteContent={siteContent}
      signatureProducts={signatureProducts}
      categories={categories}
    />
  );
}

