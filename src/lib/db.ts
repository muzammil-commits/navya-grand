import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SITE_CONTENT,
} from "./seed-data";
import type {
  BanquetEnquiry,
  Category,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  SiteContent,
  TableReservation,
} from "./types";

export interface AdminUserRecord {
  id: number;
  username: string;
  passwordHash: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface AdminSessionRecord {
  tokenHash: string;
  userId: number;
  expiresAt: string;
  createdAt: string;
}

export interface ContactMessageRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface StoreData {
  nextIds: {
    category: number;
    product: number;
    order: number;
    reservation: number;
    enquiry: number;
    contact: number;
    adminUser: number;
  };
  categories: Category[];
  products: Product[];
  orders: Order[];
  reservations: TableReservation[];
  enquiries: BanquetEnquiry[];
  contactMessages: ContactMessageRecord[];
  siteContent: SiteContent;
  adminUsers: AdminUserRecord[];
  adminSessions: AdminSessionRecord[];
}

function hashInitialPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function resolveStoreFilePath(): string | null {
  const candidates = process.env.VERCEL
    ? [path.join(os.tmpdir(), "navya-grand-data")]
    : [
        path.join(process.cwd(), "data"),
        path.join(os.tmpdir(), "navya-grand-data"),
      ];

  for (const dir of candidates) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const probe = path.join(dir, ".write-test");
      fs.writeFileSync(probe, "ok");
      fs.unlinkSync(probe);
      return path.join(dir, "navya-grand.store.json");
    } catch {
      // Directory is read-only or unavailable; try next candidate
    }
  }
  return null;
}

function createSeedStore(): StoreData {
  const now = new Date().toISOString();
  const defaultUser = process.env.ADMIN_DEFAULT_USERNAME || "admin";
  const defaultPass =
    process.env.ADMIN_DEFAULT_PASSWORD || "NavyaGrand@2026!";

  const categories: Category[] = INITIAL_CATEGORIES.map((c, idx) => ({
    ...c,
    id: idx + 1,
  }));

  const products: Product[] = INITIAL_PRODUCTS.map((p, idx) => ({
    ...p,
    id: idx + 1,
    createdAt: now,
    updatedAt: now,
  }));

  return {
    nextIds: {
      category: categories.length + 1,
      product: products.length + 1,
      order: 1,
      reservation: 1,
      enquiry: 1,
      contact: 1,
      adminUser: 2,
    },
    categories,
    products,
    orders: [],
    reservations: [],
    enquiries: [],
    contactMessages: [],
    siteContent: {
      heroSlides: INITIAL_SITE_CONTENT.heroSlides,
      services: INITIAL_SITE_CONTENT.services,
      about: INITIAL_SITE_CONTENT.about,
      testimonials: INITIAL_SITE_CONTENT.testimonials,
      contact: INITIAL_SITE_CONTENT.contact,
      deliveryConfig: {
        ...INITIAL_SITE_CONTENT.deliveryConfig,
        gatewayConfigured: Boolean(
          process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
        ),
      },
    },
    adminUsers: [
      {
        id: 1,
        username: defaultUser,
        passwordHash: hashInitialPassword(defaultPass),
        fullName: "Navya Grand Manager",
        role: "superadmin",
        createdAt: now,
      },
    ],
    adminSessions: [],
  };
}

let memoryStore: StoreData | null = null;
let resolvedFilePath: string | null | undefined = undefined;

function getStore(): StoreData {
  if (resolvedFilePath === undefined) {
    resolvedFilePath = resolveStoreFilePath();
  }

  if (!memoryStore) {
    if (resolvedFilePath && fs.existsSync(resolvedFilePath)) {
      try {
        const raw = fs.readFileSync(resolvedFilePath, "utf8");
        const parsed = JSON.parse(raw) as StoreData;
        if (
          parsed &&
          Array.isArray(parsed.categories) &&
          Array.isArray(parsed.products) &&
          parsed.siteContent
        ) {
          memoryStore = parsed;
        }
      } catch (err) {
        console.error("Failed to parse store file, re-seeding:", err);
      }
    }

    if (!memoryStore) {
      memoryStore = createSeedStore();
      persistStore(memoryStore);
    }
  }

  return memoryStore;
}

function persistStore(store: StoreData): void {
  if (resolvedFilePath === undefined) {
    resolvedFilePath = resolveStoreFilePath();
  }
  if (!resolvedFilePath) return;

  try {
    const tmpFile = `${resolvedFilePath}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(store), "utf8");
    fs.renameSync(tmpFile, resolvedFilePath);
  } catch (err) {
    console.error("Store persistence warning:", err);
  }
}

export function getAllCategories(): Category[] {
  const store = getStore();
  return [...store.categories].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.id - b.id
  );
}

export function createCategoryRecord(input: {
  name: string;
  description?: string;
  imageUrl?: string;
}): Category {
  const store = getStore();
  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (store.categories.some((c) => c.slug === slug)) {
    throw new Error("Category already exists");
  }

  const created: Category = {
    id: store.nextIds.category++,
    slug,
    name: input.name,
    description: input.description || "",
    imageUrl: input.imageUrl || "/images/dishes/andhra-thali.png",
    sortOrder: 50,
  };
  store.categories.push(created);
  persistStore(store);
  return created;
}

export function getAllProducts(includeUnavailable = false): Product[] {
  const store = getStore();
  const list = includeUnavailable
    ? store.products
    : store.products.filter((p) => p.isAvailable);
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

export function getProductById(id: number): Product | null {
  const store = getStore();
  return store.products.find((p) => p.id === id) || null;
}

export function getSignatureProducts(): Product[] {
  const store = getStore();
  return store.products
    .filter((p) => p.isSignature && p.isAvailable)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    .slice(0, 6);
}

export function createProductRecord(
  input: Omit<Product, "id" | "slug" | "sortOrder" | "createdAt" | "updatedAt">
): Product {
  const store = getStore();
  let slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (store.products.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const now = new Date().toISOString();
  const created: Product = {
    ...input,
    id: store.nextIds.product++,
    slug,
    sortOrder: 100,
    createdAt: now,
    updatedAt: now,
  };
  store.products.push(created);
  persistStore(store);
  return created;
}

export function updateProductRecord(
  id: number,
  updates: Partial<Omit<Product, "id" | "slug" | "createdAt">>
): Product | null {
  const store = getStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  store.products[idx] = {
    ...store.products[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  persistStore(store);
  return store.products[idx];
}

export function deleteProductRecord(id: number): boolean {
  const store = getStore();
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === before) return false;
  persistStore(store);
  return true;
}

export function getSiteContent(): SiteContent {
  try {
    const store = getStore();
    return {
      ...store.siteContent,
      deliveryConfig: {
        ...store.siteContent.deliveryConfig,
        gatewayConfigured: Boolean(
          process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
        ),
      },
    };
  } catch (err) {
    console.error("getSiteContent fallback:", err);
    return INITIAL_SITE_CONTENT;
  }
}

export function updateSiteContentSection<K extends keyof SiteContent>(
  key: K,
  value: SiteContent[K]
): void {
  const store = getStore();
  store.siteContent = {
    ...store.siteContent,
    [key]: value,
  };
  persistStore(store);
}

export function createOrderRecord(
  input: Omit<Order, "id">
): Order {
  const store = getStore();
  const created: Order = {
    ...input,
    id: store.nextIds.order++,
  };
  store.orders.unshift(created);
  persistStore(store);
  return created;
}

export function getOrderByRef(orderRef: string): Order | null {
  const store = getStore();
  const normalized = orderRef.trim().toUpperCase();
  return (
    store.orders.find((o) => o.orderRef.toUpperCase() === normalized) || null
  );
}

export function getAllOrders(): Order[] {
  const store = getStore();
  return [...store.orders].sort((a, b) => b.id - a.id);
}

export function updateOrderRecord(
  id: number,
  updates: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    estimatedTime?: string;
  }
): Order | null {
  const store = getStore();
  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  store.orders[idx] = {
    ...store.orders[idx],
    ...(updates.orderStatus ? { orderStatus: updates.orderStatus } : {}),
    ...(updates.paymentStatus ? { paymentStatus: updates.paymentStatus } : {}),
    ...(updates.estimatedTime !== undefined
      ? { estimatedTime: updates.estimatedTime }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  persistStore(store);
  return store.orders[idx];
}

export function createReservationRecord(
  input: Omit<TableReservation, "id">
): TableReservation {
  const store = getStore();
  const created: TableReservation = {
    ...input,
    id: store.nextIds.reservation++,
  };
  store.reservations.unshift(created);
  persistStore(store);
  return created;
}

export function getAllReservations(): TableReservation[] {
  const store = getStore();
  return [...store.reservations].sort((a, b) => b.id - a.id);
}

export function updateReservationStatus(
  id: number,
  status: TableReservation["status"]
): boolean {
  const store = getStore();
  const target = store.reservations.find((r) => r.id === id);
  if (!target) return false;
  target.status = status;
  persistStore(store);
  return true;
}

export function createBanquetEnquiryRecord(
  input: Omit<BanquetEnquiry, "id">
): BanquetEnquiry {
  const store = getStore();
  const created: BanquetEnquiry = {
    ...input,
    id: store.nextIds.enquiry++,
  };
  store.enquiries.unshift(created);
  persistStore(store);
  return created;
}

export function getAllBanquetEnquiries(): BanquetEnquiry[] {
  const store = getStore();
  return [...store.enquiries].sort((a, b) => b.id - a.id);
}

export function updateBanquetEnquiryStatus(
  id: number,
  status: BanquetEnquiry["status"]
): boolean {
  const store = getStore();
  const target = store.enquiries.find((e) => e.id === id);
  if (!target) return false;
  target.status = status;
  persistStore(store);
  return true;
}

export function createContactMessageRecord(
  input: Omit<ContactMessageRecord, "id">
): ContactMessageRecord {
  const store = getStore();
  const created: ContactMessageRecord = {
    ...input,
    id: store.nextIds.contact++,
  };
  store.contactMessages.unshift(created);
  persistStore(store);
  return created;
}

export function findAdminByUsername(username: string): AdminUserRecord | null {
  const store = getStore();
  return store.adminUsers.find((u) => u.username === username) || null;
}

export function createAdminSessionRecord(session: AdminSessionRecord): void {
  const store = getStore();
  const now = Date.now();
  store.adminSessions = store.adminSessions.filter(
    (s) => new Date(s.expiresAt).getTime() > now
  );
  store.adminSessions.push(session);
  persistStore(store);
}

export function getAdminSessionWithUser(
  tokenHash: string
): { session: AdminSessionRecord; user: AdminUserRecord } | null {
  const store = getStore();
  const session = store.adminSessions.find((s) => s.tokenHash === tokenHash);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    store.adminSessions = store.adminSessions.filter(
      (s) => s.tokenHash !== tokenHash
    );
    persistStore(store);
    return null;
  }
  const user = store.adminUsers.find((u) => u.id === session.userId);
  if (!user) return null;
  return { session, user };
}

export function deleteAdminSessionByHash(tokenHash: string): void {
  const store = getStore();
  const before = store.adminSessions.length;
  store.adminSessions = store.adminSessions.filter(
    (s) => s.tokenHash !== tokenHash
  );
  if (store.adminSessions.length !== before) {
    persistStore(store);
  }
}

export function generateReference(prefix: string): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${datePart}-${rand}`;
}
