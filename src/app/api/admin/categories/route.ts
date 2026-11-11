import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllCategories, getDb } from "@/lib/db";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ categories: getAllCategories() });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const imageUrl = String(body.imageUrl || "/images/dishes/andhra-thali.png").trim();
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const db = getDb();
    db.prepare(
      "INSERT INTO categories (slug, name, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?)"
    ).run(slug, name, description, imageUrl, 50);

    return NextResponse.json({ categories: getAllCategories() }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { error: "Failed to create category (it may already exist)." },
      { status: 400 }
    );
  }
}

