import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  verifyPassword,
} from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db
      .prepare(
        "SELECT id, username, password_hash, full_name, role FROM admin_users WHERE username = ?"
      )
      .get(username) as
      | {
          id: number;
          username: string;
          password_hash: string;
          full_name: string;
          role: string;
        }
      | undefined;

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const { rawToken } = createAdminSession(user.id);
    const res = NextResponse.json({
      user: {
        userId: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
    });

    res.cookies.set(SESSION_COOKIE_NAME, rawToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
    });

    return res;
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json(
      { error: "Authentication failed." },
      { status: 500 }
    );
  }
}

