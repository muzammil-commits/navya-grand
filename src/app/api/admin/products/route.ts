import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import {
  createProductRecord,
  getAllCategories,
  getAllProducts,
} from "@/lib/db";

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

    const created = createProductRecord({
      name,
      description,
      price,
      categorySlug,
      vegType,
      imageUrl: imageUrl || "/images/dishes/chicken-biryani.png",
      isAvailable,
      isSignature,
      variants,
      spiceLevel,
    });

    return NextResponse.json(
      { id: created.id, slug: created.slug, product: created },
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
