/**
 * Данные каталога для seed: категории и фасоны с цветами.
 * Лежат отдельно от seed.ts, чтобы их могли читать и другие скрипты
 * (например scripts/generate-images.ts рисует по ним картинки товаров), не запуская сам seed.
 */

export type Size = "XS" | "S" | "M" | "L" | "XL" | "ONE_SIZE";
export type Gender = "WOMEN" | "MEN" | "UNISEX";
export type Badge = "NEW" | "BACK_IN_STOCK";

/* ───────────── Categories ───────────── */

// Первая по sortOrder показывается на главной крупной тёмной плиткой
export const CATEGORIES = [
   {
      slug: "outerwear",
      name: "Outerwear",
      description: "Coats, jackets and overshirts cut for weather and built to be worn for years.",
      tint: "#14181F",
   },
   {
      slug: "knitwear",
      name: "Knitwear",
      description: "Merino, lambswool and cotton knits, fully fashioned and finished by hand.",
      tint: "#E3D5BE",
   },
   {
      slug: "shirts",
      name: "Shirts & tees",
      description: "Oxfords, linens and heavyweight jersey. The pieces you reach for first.",
      tint: "#D9DEE6",
   },
   {
      slug: "trousers",
      name: "Trousers",
      description: "Pleated, wide and straight cuts in wool, canvas and selvedge denim.",
      tint: "#D8D0C2",
   },
   {
      slug: "bags",
      name: "Bags",
      description: "Vegetable-tanned leather and waxed canvas, made to take on a patina.",
      tint: "#E6D9C3",
   },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

/* ───────────── Products ───────────── */

export interface Colourway {
   color: string;
   hex: string;
   badge?: Badge;
   featured?: boolean;
}

export interface Style {
   /** Основа slug: итоговый slug = `${key}-${цвет}` */
   key: string;
   name: string;
   category: CategorySlug;
   gender: Gender;
   /** Цена в центах: 16900 = $169 */
   price: number;
   fabric: string;
   description: string;
   sizes: Size[];
   colors: Colourway[];
}

export const CLOTHING: Size[] = ["XS", "S", "M", "L", "XL"];
export const ONE: Size[] = ["ONE_SIZE"];

export const STYLES: Style[] = [
   /* Outerwear */
   {
      key: "field-overshirt",
      name: "Field Overshirt",
      category: "outerwear",
      gender: "UNISEX",
      price: 16900,
      fabric: "Waxed cotton",
      description:
         "A shirt-weight jacket in dry-waxed cotton. Four patch pockets, a corduroy collar and a boxy fit that layers over knitwear without bulk.",
      sizes: CLOTHING,
      colors: [
         { color: "Ochre", hex: "#C08A2B", badge: "NEW", featured: true },
         { color: "Olive", hex: "#6B6B3A" },
      ],
   },
   {
      key: "harbour-coat",
      name: "Harbour Coat",
      category: "outerwear",
      gender: "UNISEX",
      price: 38900,
      fabric: "Boiled wool",
      description:
         "A double-breasted coat in dense boiled wool that sheds rain and holds its shape. Fully lined in cotton twill, with horn buttons and deep pockets.",
      sizes: CLOTHING,
      colors: [
         { color: "Navy", hex: "#1F2A44", badge: "NEW", featured: true },
         { color: "Camel", hex: "#B58B5A" },
      ],
   },
   {
      key: "quilted-liner-jacket",
      name: "Quilted Liner Jacket",
      category: "outerwear",
      gender: "WOMEN",
      price: 24900,
      fabric: "Recycled nylon, wool fill",
      description:
         "A light quilted jacket filled with wool for warmth that still breathes. Wear it alone in October or under a coat in January.",
      sizes: CLOTHING,
      colors: [
         { color: "Sand", hex: "#D6C7A8" },
         { color: "Black", hex: "#14181F" },
      ],
   },
   {
      key: "wool-trench",
      name: "Wool Trench",
      category: "outerwear",
      gender: "WOMEN",
      price: 42900,
      fabric: "Wool gabardine",
      description:
         "The classic trench rebuilt in wool gabardine. Storm flap, belted waist and a clean back with no vent fuss.",
      sizes: CLOTHING,
      colors: [{ color: "Stone", hex: "#CFC6B8", badge: "BACK_IN_STOCK" }],
   },
   {
      key: "ripstop-bomber",
      name: "Ripstop Bomber",
      category: "outerwear",
      gender: "MEN",
      price: 21900,
      fabric: "Cotton ripstop",
      description:
         "A bomber in tightly woven cotton ripstop with a ribbed collar and a satin-lined interior. Light enough to wear well into spring.",
      sizes: CLOTHING,
      colors: [
         { color: "Black", hex: "#14181F" },
         { color: "Olive", hex: "#6B6B3A" },
      ],
   },

   /* Knitwear */
   {
      key: "merino-crew",
      name: "Merino Crew",
      category: "knitwear",
      gender: "UNISEX",
      price: 12900,
      fabric: "Extra-fine merino",
      description:
         "Our everyday sweater in extra-fine merino. Fully fashioned with a ribbed collar and cuffs, soft against the skin and easy to wash at home.",
      sizes: CLOTHING,
      colors: [
         { color: "Rust", hex: "#B5532F", badge: "NEW", featured: true },
         { color: "Oat", hex: "#D9CDB4" },
         { color: "Navy", hex: "#1F2A44" },
      ],
   },
   {
      key: "cable-cardigan",
      name: "Cable Cardigan",
      category: "knitwear",
      gender: "WOMEN",
      price: 17900,
      fabric: "Lambswool",
      description:
         "A relaxed cardigan in lambswool with a chunky cable down the front. Horn buttons, deep pockets and a slightly cropped body.",
      sizes: CLOTHING,
      colors: [
         { color: "Cream", hex: "#EFE8D8" },
         { color: "Forest", hex: "#2F4A3A", badge: "NEW" },
      ],
   },
   {
      key: "lambswool-polo",
      name: "Lambswool Polo",
      category: "knitwear",
      gender: "MEN",
      price: 13900,
      fabric: "Lambswool",
      description:
         "A knitted polo with a flat collar and a three-button placket. Smart enough for the office, comfortable enough for the weekend.",
      sizes: CLOTHING,
      colors: [
         { color: "Grey", hex: "#8A8D91" },
         { color: "Burgundy", hex: "#6D2A33" },
      ],
   },
   {
      key: "fine-rollneck",
      name: "Fine Rollneck",
      category: "knitwear",
      gender: "WOMEN",
      price: 14900,
      fabric: "Merino and silk",
      description:
         "A slim rollneck knitted from a merino and silk blend. It has a soft drape and a quiet sheen, and it layers neatly under jackets.",
      sizes: CLOTHING,
      colors: [{ color: "Black", hex: "#14181F" }],
   },

   /* Shirts & tees */
   {
      key: "oxford-shirt",
      name: "Oxford Shirt",
      category: "shirts",
      gender: "MEN",
      price: 9900,
      fabric: "Brushed cotton oxford",
      description:
         "A button-down in brushed oxford cotton that softens with every wash. Roll-back cuffs, a locker loop and a regular fit.",
      sizes: CLOTHING,
      colors: [
         { color: "White", hex: "#F2EFE8" },
         { color: "Sky", hex: "#A9C1D9", badge: "BACK_IN_STOCK" },
      ],
   },
   {
      key: "linen-shirt",
      name: "Relaxed Linen Shirt",
      category: "shirts",
      gender: "WOMEN",
      price: 10900,
      fabric: "Washed linen",
      description:
         "A relaxed shirt in stone-washed European linen. Dropped shoulders, a curved hem and mother-of-pearl buttons.",
      sizes: CLOTHING,
      colors: [
         { color: "White", hex: "#F2EFE8" },
         { color: "Sage", hex: "#A5B09A" },
      ],
   },
   {
      key: "heavy-tee",
      name: "Heavyweight Tee",
      category: "shirts",
      gender: "UNISEX",
      price: 5900,
      fabric: "Organic cotton jersey",
      description:
         "A 280 gsm tee in organic cotton jersey with a tight rib collar. It keeps its shape wash after wash and gets better with wear.",
      sizes: CLOTHING,
      colors: [
         { color: "Black", hex: "#14181F" },
         { color: "White", hex: "#F2EFE8" },
         { color: "Rust", hex: "#B5532F", badge: "NEW" },
      ],
   },
   {
      key: "poplin-blouse",
      name: "Poplin Blouse",
      category: "shirts",
      gender: "WOMEN",
      price: 11900,
      fabric: "Cotton poplin",
      description:
         "A crisp blouse in cotton poplin with a soft pointed collar and a concealed placket. Tuck it in or wear it loose.",
      sizes: CLOTHING,
      colors: [
         { color: "Ecru", hex: "#E8DFCB" },
         { color: "Cobalt", hex: "#1F4FD8", badge: "NEW" },
      ],
   },

   /* Trousers */
   {
      key: "pleated-trouser",
      name: "Pleated Trouser",
      category: "trousers",
      gender: "MEN",
      price: 14900,
      fabric: "Wool twill",
      description:
         "A high-rise trouser in wool twill with a single forward pleat, a tapered leg and side adjusters. Cut to sit cleanly without a belt.",
      sizes: CLOTHING,
      colors: [
         { color: "Charcoal", hex: "#3A3D42" },
         { color: "Stone", hex: "#CFC6B8" },
      ],
   },
   {
      key: "wide-leg-wool",
      name: "Wide-Leg Wool Trouser",
      category: "trousers",
      gender: "WOMEN",
      price: 15900,
      fabric: "Wool crepe",
      description:
         "A full-length trouser in fluid wool crepe with a wide leg and a flat front. It falls straight from the hip and moves well.",
      sizes: CLOTHING,
      colors: [
         { color: "Black", hex: "#14181F" },
         { color: "Camel", hex: "#B58B5A" },
      ],
   },
   {
      key: "canvas-chino",
      name: "Canvas Chino",
      category: "trousers",
      gender: "MEN",
      price: 11900,
      fabric: "Cotton canvas",
      description:
         "A straight chino in garment-washed cotton canvas. Durable, broken in from the first wear, with a mid rise and a clean hem.",
      sizes: CLOTHING,
      colors: [
         { color: "Khaki", hex: "#A89A74" },
         { color: "Navy", hex: "#1F2A44" },
      ],
   },
   {
      key: "selvedge-jean",
      name: "Selvedge Straight Jean",
      category: "trousers",
      gender: "UNISEX",
      price: 12900,
      fabric: "Japanese selvedge denim",
      description:
         "A straight jean in 13 oz Japanese selvedge denim. Rigid at first, then it moulds to you. Copper rivets and a button fly.",
      sizes: CLOTHING,
      colors: [
         { color: "Indigo", hex: "#2B3A55" },
         { color: "Washed", hex: "#7C93B3" },
      ],
   },

   /* Bags */
   {
      key: "everyday-tote",
      name: "Everyday Tote",
      category: "bags",
      gender: "UNISEX",
      price: 18900,
      fabric: "Vegetable-tanned leather",
      description:
         "A structured tote in vegetable-tanned leather with a zipped inner pocket. It fits a 14-inch laptop and darkens beautifully with use.",
      sizes: ONE,
      colors: [
         { color: "Tan", hex: "#B58B5A", badge: "BACK_IN_STOCK" },
         { color: "Black", hex: "#14181F" },
      ],
   },
   {
      key: "leather-crossbody",
      name: "Leather Crossbody",
      category: "bags",
      gender: "WOMEN",
      price: 15900,
      fabric: "Smooth calfskin",
      description:
         "A small crossbody in smooth calfskin with an adjustable strap and a magnetic flap. Holds a phone, a wallet and keys.",
      sizes: ONE,
      colors: [
         { color: "Rust", hex: "#B5532F", badge: "NEW" },
         { color: "Black", hex: "#14181F" },
      ],
   },
   {
      key: "waxed-weekender",
      name: "Waxed Weekender",
      category: "bags",
      gender: "UNISEX",
      price: 28900,
      fabric: "Waxed canvas, leather trim",
      description:
         "A roomy weekender in waxed canvas with leather handles and a detachable shoulder strap. Water-resistant and built for the overhead bin.",
      sizes: ONE,
      colors: [
         { color: "Olive", hex: "#6B6B3A" },
         { color: "Navy", hex: "#1F2A44" },
      ],
   },
   {
      key: "card-holder",
      name: "Card Holder",
      category: "bags",
      gender: "UNISEX",
      price: 6500,
      fabric: "Vegetable-tanned leather",
      description:
         "A slim card holder with four slots and a centre pocket for folded notes. Hand-stitched, and no thicker than a pencil.",
      sizes: ONE,
      colors: [
         { color: "Black", hex: "#14181F" },
         { color: "Tan", hex: "#B58B5A" },
      ],
   },
];
