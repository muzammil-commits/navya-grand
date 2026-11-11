import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getSiteContent, updateSiteContentSection } from "@/lib/db";
import type { SiteContent } from "@/lib/types";

const ALLOWED_KEYS: (keyof SiteContent)[] = [
  "heroSlides",
  "services",
  "about",
  "testimonials",
  "contact",
  "deliveryConfig",
];

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getSiteContent());
}

export async function PATCH(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const key = body.key as keyof SiteContent;
    if (!ALLOWED_KEYS.includes(key) || body.value === undefined) {
      return NextResponse.json(
        { error: "Invalid site content section key." },
        { status: 400 }
      );
    }

    updateSiteContentSection(key, body.value);
    return NextResponse.json({ content: getSiteContent() });
  } catch (error) {
    console.error("PATCH /api/admin/content error:", error);
    return NextResponse.json(
      { error: "Failed to update site content." },
      { status: 500 }
    );
  }
}

