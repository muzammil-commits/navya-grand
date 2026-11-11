import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllCategories, getAllProducts, getDb } from "@/lib/db";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    categories: getAllCategories(),
    products: getAllProducts(true),
  });
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
    const price = Number(body.price);
    const categorySlug = String(body.categorySlug || "").trim();
    const vegType = body.vegType === "veg" ? "veg" : "non-veg";
    const imageUrl = String(body.imageUrl || "").trim();
    const isAvailable = body.isAvailable !== false;
    const isSignature = Boolean(body.isSignature);
    const spiceLevel = body.spiceLevel || null;
    const variants = Array.isArray(body.variants) ? body.variants : [];

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Dish name is required." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Valid positive price is required." },
        { status: 400 }
      );
    }
    if (!categorySlug) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 }
      );
    }

    const db = getDb();
    let slug = slugify(name);
    const existing = db
      .prepare("SELECT id FROM products WHERE slug = ?")
      .get(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const now = new Date().toISOString();
    const result = db
      .prepare(
        `INSERT INTO products (
          slug, name, description, price, category_slug, veg_type,
          image_url, is_available, is_signature, variants_json, spice_level,
          sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        slug,
        name,
        description,
        price,
        categorySlug,
        vegType,
        imageUrl || "/images/dishes/chicken-biryani.png",
        isAvailable ? 1 : 0,
        isSignature ? 1 : 0,
        JSON.stringify(variants),
        spiceLevel,
        100,
        now,
        now
      );

    return NextResponse.json(
      { id: Number(result.lastInsertRowid), slug },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}

