import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroyAdminSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (rawToken) {
      destroyAdminSession(rawToken);
    }
    const res = NextResponse.json({ success: true });
    res.cookies.delete(SESSION_COOKIE_NAME);
    return res;
  } catch (error) {
    console.error("POST /api/admin/logout error:", error);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}

