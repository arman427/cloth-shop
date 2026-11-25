import type { FooterColumn, NavLink } from "@/types";

export const ANNOUNCEMENT = {
   shipping: "Free shipping on orders over $150. Returns are free for 30 days.",
   season: "Autumn–Winter 26",
   seasonNote: "is in. Lookbook out now.",
} as const;

export const MAIN_NAV: NavLink[] = [
   { label: "New in", href: "/new-in", featured: true },
   { label: "Women", href: "/women" },
   { label: "Men", href: "/men" },
   { label: "Bags", href: "/bags" },
   { label: "Journal", href: "/journal" },
];

export const UTILITY_NAV: NavLink[] = [{ label: "Find a store", href: "/stores" }];

export const FOOTER_COLUMNS: FooterColumn[] = [
   {
      title: "Shop",
      links: [
         { label: "New in", href: "/new-in" },
         { label: "Women", href: "/women" },
         { label: "Men", href: "/men" },
         { label: "Bags", href: "/bags" },
         { label: "Gift cards", href: "/gift-cards" },
      ],
   },
   {
      title: "Help",
      links: [
         { label: "Shipping", href: "/help/shipping" },
         { label: "Returns", href: "/help/returns" },
         { label: "Size guide", href: "/help/size-guide" },
         { label: "Free repairs", href: "/help/repairs" },
         { label: "Contact us", href: "/help/contact" },
      ],
   },
   {
      title: "Vellum",
      links: [
         { label: "The workshop", href: "/workshop" },
         { label: "Fabrics", href: "/fabrics" },
         { label: "Journal", href: "/journal" },
         { label: "Stores", href: "/stores" },
         { label: "Careers", href: "/careers" },
      ],
   },
];

export const PAYMENT_METHODS = ["VISA", "Mastercard", "Apple Pay", "PayPal"] as const;

export const SOCIAL_LINKS: NavLink[] = [
   { label: "Pinterest", href: "https://pinterest.com" },
   { label: "TikTok", href: "https://tiktok.com" },
];
