import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import {
  deleteProductRecord,
  getProductById,
  updateProductRecord,
} from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const productId = Number(id);
    const existing = getProductById(productId);
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const body = await req.json();
    const name =
      body.name !== undefined ? String(body.name).trim() : existing.name;
    const description =
      body.description !== undefined
        ? String(body.description).trim()
        : existing.description;
    const price =
      body.price !== undefined ? Number(body.price) : existing.price;
    const categorySlug =
      body.categorySlug !== undefined
        ? String(body.categorySlug).trim()
        : existing.categorySlug;
    const vegType =
      body.vegType !== undefined
        ? body.vegType === "veg"
          ? "veg"
          : "non-veg"
        : existing.vegType;
    const imageUrl =
      body.imageUrl !== undefined
        ? String(body.imageUrl).trim()
        : existing.imageUrl;
    const isAvailable =
      body.isAvailable !== undefined
        ? Boolean(body.isAvailable)
        : existing.isAvailable;
    const isSignature =
      body.isSignature !== undefined
        ? Boolean(body.isSignature)
        : existing.isSignature;
    const variants =
      body.variants !== undefined ? body.variants : existing.variants;
    const spiceLevel =
      body.spiceLevel !== undefined ? body.spiceLevel : existing.spiceLevel;

    if (!name || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Invalid name or price." },
        { status: 400 }
      );
    }

    const updated = updateProductRecord(productId, {
      name,
      description,
      price,
      categorySlug,
      vegType,
      imageUrl,
      isAvailable,
      isSignature,
      variants,
      spiceLevel,
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = deleteProductRecord(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
