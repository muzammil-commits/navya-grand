import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SITE_CONTENT,
} from "./seed-data";
import type {
  BanquetEnquiry,
  Category,
  Order,
  OrderItemSnapshot,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  ProductVariant,
  SiteContent,
  TableReservation,
} from "./types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "navya-grand.db");

let dbInstance: DatabaseSync | null = null;
let initialized = false;

function hashInitialPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    dbInstance = new DatabaseSync(DB_PATH);
    dbInstance.exec("PRAGMA journal_mode = WAL;");
    dbInstance.exec("PRAGMA foreign_keys = ON;");
  }

  if (!initialized) {
    initializeSchema(dbInstance);
    seedIfEmpty(dbInstance);
    initialized = true;
  }

  return dbInstance;
}

function initializeSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      category_slug TEXT NOT NULL,
      veg_type TEXT NOT NULL CHECK (veg_type IN ('veg', 'non-veg')),
      image_url TEXT NOT NULL DEFAULT '',
      is_available INTEGER NOT NULL DEFAULT 1,
      is_signature INTEGER NOT NULL DEFAULT 0,
      variants_json TEXT NOT NULL DEFAULT '[]',
      spice_level TEXT DEFAULT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_ref TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'takeaway')),
      address TEXT NOT NULL DEFAULT '',
      landmark TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT 'Guntur',
      pincode TEXT NOT NULL DEFAULT '',
      instructions TEXT NOT NULL DEFAULT '',
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      delivery_charge REAL NOT NULL DEFAULT 0,
      tax_amount REAL NOT NULL DEFAULT 0,
      discount_amount REAL NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      payment_ref TEXT NOT NULL DEFAULT '',
      order_status TEXT NOT NULL,
      estimated_time TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS table_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_ref TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      guest_count INTEGER NOT NULL,
      special_requests TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS banquet_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_ref TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      event_type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      guest_count INTEGER NOT NULL,
      requirements TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'New',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL DEFAULT 'Navya Grand Admin',
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );
  `);
}

function seedIfEmpty(db: DatabaseSync): void {
  const now = new Date().toISOString();

  const catCount = (
    db.prepare("SELECT COUNT(*) as count FROM categories").get() as {
      count: number;
    }
  ).count;

  if (catCount === 0) {
    const insertCat = db.prepare(
      "INSERT INTO categories (slug, name, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?)"
    );
    for (const c of INITIAL_CATEGORIES) {
      insertCat.run(c.slug, c.name, c.description, c.imageUrl, c.sortOrder);
    }
  }

  const prodCount = (
    db.prepare("SELECT COUNT(*) as count FROM products").get() as {
      count: number;
    }
  ).count;

  if (prodCount === 0) {
    const insertProd = db.prepare(
      `INSERT INTO products (
        slug, name, description, price, category_slug, veg_type,
        image_url, is_available, is_signature, variants_json, spice_level,
        sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const p of INITIAL_PRODUCTS) {
      insertProd.run(
        p.slug,
        p.name,
        p.description,
        p.price,
        p.categorySlug,
        p.vegType,
        p.imageUrl,
        p.isAvailable ? 1 : 0,
        p.isSignature ? 1 : 0,
        JSON.stringify(p.variants),
        p.spiceLevel,
        p.sortOrder,
        now,
        now
      );
    }
  }

  const contentCount = (
    db.prepare("SELECT COUNT(*) as count FROM site_content").get() as {
      count: number;
    }
  ).count;

  if (contentCount === 0) {
    const insertContent = db.prepare(
      "INSERT INTO site_content (key, value_json, updated_at) VALUES (?, ?, ?)"
    );
    const entries: [keyof SiteContent, unknown][] = [
      ["heroSlides", INITIAL_SITE_CONTENT.heroSlides],
      ["services", INITIAL_SITE_CONTENT.services],
      ["about", INITIAL_SITE_CONTENT.about],
      ["testimonials", INITIAL_SITE_CONTENT.testimonials],
      ["contact", INITIAL_SITE_CONTENT.contact],
      ["deliveryConfig", INITIAL_SITE_CONTENT.deliveryConfig],
    ];
    for (const [k, v] of entries) {
      insertContent.run(k, JSON.stringify(v), now);
    }
  }

  const adminCount = (
    db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as {
      count: number;
    }
  ).count;

  if (adminCount === 0) {
    const defaultUser = process.env.ADMIN_DEFAULT_USERNAME || "admin";
    const defaultPass =
      process.env.ADMIN_DEFAULT_PASSWORD || "NavyaGrand@2026!";
    db.prepare(
      "INSERT INTO admin_users (username, password_hash, full_name, role, created_at) VALUES (?, ?, ?, ?, ?)"
    ).run(
      defaultUser,
      hashInitialPassword(defaultPass),
      "Navya Grand Manager",
      "superadmin",
      now
    );
  }
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description || ""),
    imageUrl: String(row.image_url || ""),
    sortOrder: Number(row.sort_order || 0),
  };
}

function mapProduct(row: Record<string, unknown>): Product {
  let variants: ProductVariant[] = [];
  try {
    variants = JSON.parse(String(row.variants_json || "[]"));
  } catch {
    variants = [];
  }
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description || ""),
    price: Number(row.price),
    categorySlug: String(row.category_slug),
    vegType: row.veg_type === "veg" ? "veg" : "non-veg",
    imageUrl: String(row.image_url || ""),
    isAvailable: Boolean(row.is_available),
    isSignature: Boolean(row.is_signature),
    variants,
    spiceLevel: (row.spice_level as Product["spiceLevel"]) || null,
    sortOrder: Number(row.sort_order || 0),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  let items: OrderItemSnapshot[] = [];
  try {
    items = JSON.parse(String(row.items_json || "[]"));
  } catch {
    items = [];
  }
  return {
    id: Number(row.id),
    orderRef: String(row.order_ref),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    email: String(row.email || ""),
    orderType: row.order_type === "takeaway" ? "takeaway" : "delivery",
    address: String(row.address || ""),
    landmark: String(row.landmark || ""),
    city: String(row.city || "Guntur"),
    pincode: String(row.pincode || ""),
    instructions: String(row.instructions || ""),
    items,
    subtotal: Number(row.subtotal),
    deliveryCharge: Number(row.delivery_charge),
    taxAmount: Number(row.tax_amount),
    discountAmount: Number(row.discount_amount),
    totalAmount: Number(row.total_amount),
    paymentMethod: String(row.payment_method) as PaymentMethod,
    paymentStatus: String(row.payment_status) as PaymentStatus,
    paymentRef: String(row.payment_ref || ""),
    orderStatus: String(row.order_status) as OrderStatus,
    estimatedTime: String(row.estimated_time || ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapReservation(row: Record<string, unknown>): TableReservation {
  return {
    id: Number(row.id),
    reservationRef: String(row.reservation_ref),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    email: String(row.email || ""),
    reservationDate: String(row.reservation_date),
    reservationTime: String(row.reservation_time),
    guestCount: Number(row.guest_count),
    specialRequests: String(row.special_requests || ""),
    status: String(row.status) as TableReservation["status"],
    createdAt: String(row.created_at),
  };
}

function mapEnquiry(row: Record<string, unknown>): BanquetEnquiry {
  return {
    id: Number(row.id),
    enquiryRef: String(row.enquiry_ref),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    email: String(row.email || ""),
    eventType: String(row.event_type),
    eventDate: String(row.event_date),
    guestCount: Number(row.guest_count),
    requirements: String(row.requirements || ""),
    message: String(row.message || ""),
    status: String(row.status) as BanquetEnquiry["status"],
    createdAt: String(row.created_at),
  };
}

export function getAllCategories(): Category[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM categories ORDER BY sort_order ASC, id ASC")
    .all() as Record<string, unknown>[];
  return rows.map(mapCategory);
}

export function getAllProducts(includeUnavailable = false): Product[] {
  const db = getDb();
  const sql = includeUnavailable
    ? "SELECT * FROM products ORDER BY sort_order ASC, id ASC"
    : "SELECT * FROM products WHERE is_available = 1 ORDER BY sort_order ASC, id ASC";
  const rows = db.prepare(sql).all() as Record<string, unknown>[];
  return rows.map(mapProduct);
}

export function getProductById(id: number): Product | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? mapProduct(row) : null;
}

export function getSignatureProducts(): Product[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM products WHERE is_signature = 1 AND is_available = 1 ORDER BY sort_order ASC, id ASC LIMIT 6"
    )
    .all() as Record<string, unknown>[];
  return rows.map(mapProduct);
}

export function getSiteContent(): SiteContent {
  const db = getDb();
  const rows = db
    .prepare("SELECT key, value_json FROM site_content")
    .all() as { key: string; value_json: string }[];

  const result: SiteContent = {
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
  };

  for (const row of rows) {
    try {
      const parsed = JSON.parse(row.value_json);
      if (row.key === "heroSlides") result.heroSlides = parsed;
      else if (row.key === "services") result.services = parsed;
      else if (row.key === "about") result.about = parsed;
      else if (row.key === "testimonials") result.testimonials = parsed;
      else if (row.key === "contact") result.contact = parsed;
      else if (row.key === "deliveryConfig") {
        result.deliveryConfig = {
          ...parsed,
          gatewayConfigured: Boolean(
            process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
          ),
        };
      }
    } catch {
      // ignore malformed JSON and fall back to defaults
    }
  }

  return result;
}

export function updateSiteContentSection<K extends keyof SiteContent>(
  key: K,
  value: SiteContent[K]
): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO site_content (key, value_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
  ).run(key, JSON.stringify(value), now);
}

export function getOrderByRef(orderRef: string): Order | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM orders WHERE UPPER(order_ref) = UPPER(?)")
    .get(orderRef.trim()) as Record<string, unknown> | undefined;
  return row ? mapOrder(row) : null;
}

export function getAllOrders(): Order[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM orders ORDER BY id DESC")
    .all() as Record<string, unknown>[];
  return rows.map(mapOrder);
}

export function getAllReservations(): TableReservation[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM table_reservations ORDER BY id DESC")
    .all() as Record<string, unknown>[];
  return rows.map(mapReservation);
}

export function getAllBanquetEnquiries(): BanquetEnquiry[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM banquet_enquiries ORDER BY id DESC")
    .all() as Record<string, unknown>[];
  return rows.map(mapEnquiry);
}

export function generateReference(prefix: string): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${datePart}-${rand}`;
}

