import React from "react";
import type { Metadata } from "next";
import { PageHeaderBanner } from "@/components/PageHeaderBanner";
import { GalleryClient } from "@/components/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos of Navya Grand's signature dishes, fine dining restaurant interior, banquet hall, and culinary preparation in Guntur.",
};

export default function GalleryPage() {
  return (
    <div>
      <PageHeaderBanner
        eyebrow="Visual Tour"
        title="Navya Grand Gallery"
        description="Explore our signature dishes, warm fine dining room, banquet celebrations, and clean culinary spaces."
        breadcrumbs={[{ label: "Gallery" }]}
      />
      <GalleryClient />
    </div>
  );
}

