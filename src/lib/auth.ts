import crypto from "node:crypto";
import { cookies } from "next/headers";

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

export interface AdminUserSession {
  userId: number;
  username: string;
  fullName: string;
  role: string;
}

interface SignedPayload extends AdminUserSession {
  exp: number;
}

function signPayload(payload: SignedPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", getAuthSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

function verifySignedToken(token: string): SignedPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, providedSig] = parts;
  if (!encoded || !providedSig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getAuthSecret())
    .update(encoded)
    .digest("base64url");

  const a = Buffer.from(providedSig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as SignedPayload;
    if (!parsed || typeof parsed.exp !== "number" || parsed.exp <= Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function createAdminSession(user: AdminUserSession): {
  rawToken: string;
  expiresAt: string;
} {
  const exp = Date.now() + SESSION_TTL_MS;
  const rawToken = signPayload({ ...user, exp });
  return { rawToken, expiresAt: new Date(exp).toISOString() };
}

export function destroyAdminSession(_rawToken: string): void {
  // Stateless signed tokens are cleared by deleting the HTTP-only cookie
}

export async function getCurrentAdmin(): Promise<AdminUserSession | null> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!rawToken) return null;

    const parsed = verifySignedToken(rawToken);
    if (!parsed) return null;

    return {
      userId: parsed.userId,
      username: parsed.username,
      fullName: parsed.fullName,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME, SESSION_TTL_MS };
