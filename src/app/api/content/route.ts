import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/db";

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json(
      { error: "Failed to load site content." },
      { status: 500 }
    );
  }
}

