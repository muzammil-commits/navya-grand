import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, getAllProducts, getSignatureProducts } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category")?.trim() || "";
    const vegType = searchParams.get("vegType")?.trim() || "";
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const signatureOnly = searchParams.get("signature") === "true";
    const sort = searchParams.get("sort")?.trim() || "default";

    const categories = getAllCategories();

    if (signatureOnly) {
      const signature = getSignatureProducts();
      return NextResponse.json({ categories, products: signature });
    }

    let products = getAllProducts(false);

    if (category && category !== "all") {
      products = products.filter((p) => p.categorySlug === category);
    }

    if (vegType === "veg" || vegType === "non-veg") {
      products = products.filter((p) => p.vegType === vegType);
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.categorySlug.toLowerCase().includes(search)
      );
    }

    if (sort === "price-asc") {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sort === "name-asc") {
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    }

    return NextResponse.json({ categories, products });
  } catch (error) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json(
      { error: "Failed to load menu catalog." },
      { status: 500 }
    );
  }
}

