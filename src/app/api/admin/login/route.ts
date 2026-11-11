import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  verifyPassword,
} from "@/lib/auth";
import { findAdminByUsername } from "@/lib/db";

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

    const user = findAdminByUsername(username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const sessionPayload = {
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    };
    const { rawToken } = createAdminSession(sessionPayload);

    const res = NextResponse.json({ user: sessionPayload });
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
