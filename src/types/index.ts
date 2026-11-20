/** Mirrors the enums in prisma/schema.prisma */
export type Size = "XS" | "S" | "M" | "L" | "XL" | "ONE_SIZE";
export type Gender = "WOMEN" | "MEN" | "UNISEX";
export type BadgeKey = "NEW" | "BACK_IN_STOCK";
export type OrderStatus = "NEW" | "PAID" | "SHIPPED" | "CANCELLED";

export type BadgeTone = "cobalt" | "ink";

export interface NavLink {
   label: string;
   href: string;
   /** Marked with the cobalt underline in the header */
   featured?: boolean;
}

export interface FooterColumn {
   title: string;
   links: NavLink[];
}

/* ───────────── Catalog ───────────── */

export interface SizeOption {
   variantId: number;
   size: Size;
   stock: number;
}

/** One colour of a style. Products sharing a styleCode are colourways of each other. */
export interface Colorway {
   slug: string;
   color: string;
   hex: string;
}

export interface Product {
   id: number;
   slug: string;
   name: string;
   description: string | null;
   /** Short material line under the name, e.g. "Boiled wool, navy" */
   material: string | null;
   /** In cents */
   price: number;
   gender: Gender;
   badge: BadgeKey | null;
   color: string;
   colorHex: string;
   /** Empty until real photos are added; the UI shows a placeholder */
   images: string[];
   category: { slug: string; name: string };
   sizes: SizeOption[];
   /** Every colour of this style, including the product itself */
   colorways: Colorway[];
}

export interface Category {
   slug: string;
   name: string;
   description: string | null;
   image: string | null;
   tint: string;
   count: number;
}

/* ───────────── Home content ───────────── */

export interface HeroFact {
   title: string;
   text: string;
   rating?: number;
}

export interface ProcessStep {
   title: string;
   text: string;
}

export interface Review {
   id: number;
   quote: string;
   author: string;
   initials: string;
   purchase: string;
}

export interface RatingSummary {
   average: number;
   total: number;
   /** Count of reviews per star, 5 → 1 */
   breakdown: { stars: number; count: number }[];
}

/* ───────────── Cart & orders ───────────── */

export interface CartLine {
   variantId: number;
   quantity: number;
   /** Stock left for this size; the stepper cannot go above it */
   maxQuantity: number;
   /** False when the size has sold out since it was added */
   available: boolean;
   size: Size;
   unitPrice: number;
   lineTotal: number;
   product: {
      slug: string;
      name: string;
      color: string;
      colorHex: string;
      material: string | null;
      image: string | null;
   };
}

export interface CartSummary {
   lines: CartLine[];
   /** Units in the bag, sold-out lines excluded */
   count: number;
   subtotal: number;
   promoCode: string | null;
   discount: number;
   shipping: number;
   total: number;
   /** How much more to spend for free shipping; 0 when already free */
   freeShippingRemaining: number;
}

export interface OrderLineView {
   id: number;
   quantity: number;
   price: number;
   size: Size;
   name: string;
   color: string;
   slug: string;
   image: string | null;
}

export interface OrderView {
   id: number;
   /** Кому принадлежит заказ. null: заказ оформлен гостем. */
   userId: number | null;
   publicId: string;
   status: OrderStatus;
   createdAt: Date;
   name: string;
   email: string | null;
   phone: string;
   address: string;
   comment: string | null;
   promoCode: string | null;
   discount: number;
   shipping: number;
   totalAmount: number;
   items: OrderLineView[];
}

/* ───────────── Static content pages ───────────── */

export interface JournalPost {
   slug: string;
   title: string;
   excerpt: string;
   date: string;
   readTime: string;
   image?: string;
   body: string[];
}

export interface Store {
   city: string;
   name: string;
   address: string[];
   hours: string[];
   phone: string;
   image?: string;
}

export interface JobOpening {
   title: string;
   team: string;
   location: string;
   type: string;
   summary: string;
}

export interface Fabric {
   name: string;
   origin: string;
   weight: string;
   care: string;
   text: string;
   image?: string;
}

export interface LookbookScene {
   title: string;
   caption: string;
   image?: string;
   href: string;
   cta: string;
}
