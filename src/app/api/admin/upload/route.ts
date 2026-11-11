import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Only PNG, JPG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must not exceed 2 MB." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Write to public/images/uploads when writable (local/VPS),
    // otherwise fall back to validated inline data URI on read-only serverless hosts
    if (!process.env.VERCEL) {
      try {
        const uploadDir = path.join(
          process.cwd(),
          "public",
          "images",
          "uploads"
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `dish-${Date.now()}-${crypto.randomBytes(3).toString("hex")}${ext}`;
        fs.writeFileSync(path.join(uploadDir, filename), bytes);
        return NextResponse.json({ url: `/images/uploads/${filename}` });
      } catch {
        // Read-only filesystem fallback below
      }
    }

    const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
    return NextResponse.json({ url: dataUri });
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
