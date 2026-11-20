import type { BadgeKey, BadgeTone, OrderStatus, Size } from "@/types";

/** Display order for sizes everywhere (cards, filters, tables) */
export const SIZE_ORDER: Size[] = ["XS", "S", "M", "L", "XL", "ONE_SIZE"];

export const SIZE_LABEL: Record<Size, string> = {
   XS: "XS",
   S: "S",
   M: "M",
   L: "L",
   XL: "XL",
   ONE_SIZE: "One size",
};

/** Sizes offered in the catalog filter (one-size bags are not filtered by size) */
export const FILTER_SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

export const BADGES: Record<BadgeKey, { label: string; tone: BadgeTone }> = {
   NEW: { label: "New", tone: "cobalt" },
   BACK_IN_STOCK: { label: "Back in stock", tone: "ink" },
};

/* ───────────── Money (everything in cents) ───────────── */

export const FREE_SHIPPING_THRESHOLD = 15000;
export const SHIPPING_FEE = 900;
export const MAX_LINE_QUANTITY = 10;

/** Promo codes: code → share taken off the subtotal */
export const PROMO_CODES: Record<string, { rate: number; label: string }> = {
   VELLUM15: { rate: 0.15, label: "15% off your first order" },
};

/* ───────────── Catalog filters ───────────── */

export const SORT_OPTIONS = [
   { value: "newest", label: "Newest first" },
   { value: "price-asc", label: "Price: low to high" },
   { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** Price filter buckets in cents. `max: null` means no upper limit. */
export const PRICE_BUCKETS = [
   { value: "any", label: "Any price", min: 0, max: null },
   { value: "under-100", label: "Under $100", min: 0, max: 10000 },
   { value: "100-250", label: "$100 to $250", min: 10000, max: 25000 },
   { value: "over-250", label: "Over $250", min: 25000, max: null },
] as const;

export type PriceBucketValue = (typeof PRICE_BUCKETS)[number]["value"];

export const CATALOG_PAGE_SIZE = 48;


/* ───────────── Orders ───────────── */

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
   NEW: "Received",
   PAID: "Paid",
   SHIPPED: "Shipped",
   CANCELLED: "Cancelled",
};
