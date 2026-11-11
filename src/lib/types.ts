export type VegType = "veg" | "non-veg";

export type OrderType = "delivery" | "takeaway";

export type PaymentMethod = "cod" | "pickup" | "upi" | "gateway";

export type PaymentStatus =
  | "pending"
  | "awaiting_verification"
  | "paid"
  | "failed";

export type OrderStatus =
  | "Order Placed"
  | "Order Accepted"
  | "Preparing"
  | "Ready for Pickup"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

export interface ProductVariant {
  label: string;
  price: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  categorySlug: string;
  vegType: VegType;
  imageUrl: string;
  isAvailable: boolean;
  isSignature: boolean;
  variants: ProductVariant[];
  spiceLevel: "mild" | "medium" | "spicy" | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  key: string;
  productId: number;
  slug: string;
  name: string;
  imageUrl: string;
  vegType: VegType;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  instructions?: string;
}

export interface OrderItemSnapshot {
  productId: number;
  name: string;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  instructions?: string;
}

export interface Order {
  id: number;
  orderRef: string;
  customerName: string;
  phone: string;
  email: string;
  orderType: OrderType;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  instructions: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryCharge: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef: string;
  orderStatus: OrderStatus;
  estimatedTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface TableReservation {
  id: number;
  reservationRef: string;
  customerName: string;
  phone: string;
  email: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialRequests: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface BanquetEnquiry {
  id: number;
  enquiryRef: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  requirements: string;
  message: string;
  status: "New" | "Contacted" | "Site Visit Scheduled" | "Booked" | "Closed";
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  tagline: string;
  desktopImage: string;
  mobileImage: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  imageUrl: string;
  iconName: "utensils" | "flame" | "crown" | "bike" | "users";
  actionLabel: string;
  actionHref: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  isSample: boolean;
}

export interface ContactInfo {
  brandName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  primaryPhone: string;
  landline: string;
  email: string;
  whatsappNumber: string;
  openingHours: string;
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
}

export interface DeliveryConfig {
  supportedCity: string;
  supportedPincodes: string[];
  deliveryFee: number;
  freeDeliveryAbove: number;
  taxRatePercent: number;
  deliveryHoursNote: string;
  upiId: string;
  gatewayConfigured: boolean;
}

export interface AboutContent {
  heading: string;
  summary: string;
  extendedStory: string;
  pillars: { title: string; description: string; icon: string }[];
  imageUrl: string;
}

export interface SiteContent {
  heroSlides: HeroSlide[];
  services: ServiceItem[];
  about: AboutContent;
  testimonials: TestimonialItem[];
  contact: ContactInfo;
  deliveryConfig: DeliveryConfig;
}

