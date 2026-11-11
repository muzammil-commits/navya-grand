import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

const SESSION_COOKIE_NAME = "ng_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    "navya-grand-dev-session-secret-set-AUTH_SECRET-in-prod"
  );
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHex] = storedHash.split(":");
  if (!salt || !originalHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(originalHex, "hex");
  if (derived.length !== original.length) return false;
  return crypto.timingSafeEqual(derived, original);
}

function hashToken(rawToken: string): string {
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(rawToken)
    .digest("hex");
}

export interface AdminUserSession {
  userId: number;
  username: string;
  fullName: string;
  role: string;
}

export function createAdminSession(userId: number): {
  rawToken: string;
  expiresAt: string;
} {
  const db = getDb();
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.prepare(
    "DELETE FROM admin_sessions WHERE expires_at <= ?"
  ).run(new Date().toISOString());

  db.prepare(
    "INSERT INTO admin_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  ).run(tokenHash, userId, expiresAt, new Date().toISOString());

  return { rawToken, expiresAt };
}

export function destroyAdminSession(rawToken: string): void {
  const db = getDb();
  const tokenHash = hashToken(rawToken);
  db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(tokenHash);
}

export async function getCurrentAdmin(): Promise<AdminUserSession | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const db = getDb();
  const tokenHash = hashToken(rawToken);
  const row = db
    .prepare(
      `SELECT s.user_id, s.expires_at, u.username, u.full_name, u.role
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
       WHERE s.token_hash = ?`
    )
    .get(tokenHash) as
    | {
        user_id: number;
        expires_at: string;
        username: string;
        full_name: string;
        role: string;
      }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(tokenHash);
    return null;
  }

  return {
    userId: row.user_id,
    username: row.username,
    fullName: row.full_name,
    role: row.role,
  };
}

export { SESSION_COOKIE_NAME, SESSION_TTL_MS };

