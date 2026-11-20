/**
 * Чтение каталога из базы. Страницы получают товары только через эти функции,
 * а наружу они отдают уже собранные объекты Product из "@/types".
 *
 * Каталог одинаков для всех посетителей, поэтому каждая функция закэширована ("use cache").
 * База в Neon далеко, и каждый запрос к ней стоит сотни миллисекунд: без кэша страница товара
 * делала четыре запроса подряд на каждом переходе. Остатки в кэше могут отставать на минуту,
 * но это только витрина: корзина и оформление заказа всегда читают остатки из базы заново.
 * После заказа кэш сбрасывается через updateTag(CATALOG_TAG) (см. actions/checkout.ts).
 */
import { cacheLife, cacheTag } from "next/cache";
import { CATALOG_PAGE_SIZE, PRICE_BUCKETS, SIZE_ORDER, type PriceBucketValue, type SortValue } from "@/constants/shop";
import { categoryImage, productImages } from "@/lib/art";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { Category, Colorway, Gender, Product, Size } from "@/types";

/** Тег всех кэшированных данных каталога */
export const CATALOG_TAG = "catalog";

/* ───────────── Product rows → Product ───────────── */

/** Что мы берём из базы для карточки товара */
const productInclude = {
   category: { select: { slug: true, name: true } },
   variants: { select: { id: true, size: true, stock: true } },
} as const;

interface ProductRow {
   id: number;
   slug: string;
   name: string;
   description: string | null;
   material: string | null;
   price: number;
   gender: Gender;
   badge: "NEW" | "BACK_IN_STOCK" | null;
   color: string;
   colorHex: string;
   images: string[];
   styleCode: string | null;
   category: { slug: string; name: string };
   variants: { id: number; size: Size; stock: number }[];
}

function mapProduct(row: ProductRow, colorways?: Colorway[]): Product {
   return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      material: row.material,
      price: row.price,
      gender: row.gender,
      badge: row.badge,
      color: row.color,
      colorHex: row.colorHex,
      // Нет своих фото в базе: векторные картинки из public/images (см. lib/art.ts)
      images: productImages(row.slug, row.images),
      category: row.category,
      sizes: [...row.variants]
         .sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size))
         .map((variant) => ({ variantId: variant.id, size: variant.size, stock: variant.stock })),
      colorways: colorways ?? [{ slug: row.slug, color: row.color, hex: row.colorHex }],
   };
}

/** Одним запросом достаёт все цвета тех же фасонов и собирает Product[] */
async function toProducts(rows: ProductRow[]): Promise<Product[]> {
   const styleCodes = [...new Set(rows.map((row) => row.styleCode).filter((code): code is string => Boolean(code)))];

   const siblings = styleCodes.length
      ? await prisma.product.findMany({
           where: { styleCode: { in: styleCodes } },
           select: { styleCode: true, slug: true, color: true, colorHex: true },
           orderBy: { id: "asc" },
        })
      : [];

   const byStyle = new Map<string, Colorway[]>();
   for (const sibling of siblings) {
      if (!sibling.styleCode) continue;
      const list = byStyle.get(sibling.styleCode) ?? [];
      list.push({ slug: sibling.slug, color: sibling.color, hex: sibling.colorHex });
      byStyle.set(sibling.styleCode, list);
   }

   return rows.map((row) => mapProduct(row, row.styleCode ? byStyle.get(row.styleCode) : undefined));
}

/* ───────────── Home page ───────────── */

export async function getFeaturedProducts(): Promise<Product[]> {
   "use cache";
   cacheLife("minutes");
   cacheTag(CATALOG_TAG);

   const rows = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { id: "asc" },
      take: 3,
      include: productInclude,
   });
   return toProducts(rows);
}

/** Newest first. Ties (seed creates everything at once) are broken by id. */
export async function getNewArrivals(limit = 8): Promise<Product[]> {
   "use cache";
   cacheLife("minutes");
   cacheTag(CATALOG_TAG);

   const rows = await prisma.product.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit * 4,
      include: productInclude,
   });

   // Один цвет от каждого фасона, иначе новинки состоят из одной вещи в разных цветах
   const seenStyles = new Set<string>();
   const picked = rows.filter((row) => {
      const style = row.styleCode ?? row.slug;
      if (seenStyles.has(style)) return false;
      seenStyles.add(style);
      return true;
   });

   return toProducts(picked.slice(0, limit));
}

/* ───────────── Categories ───────────── */

export async function getCategories(): Promise<Category[]> {
   // Категории почти не меняются: держим результат в кэше, чтобы не ходить за ними в базу на каждом переходе
   "use cache";
   cacheLife("minutes");
   cacheTag(CATALOG_TAG);

   const rows = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
   });

   return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description,
      image: categoryImage(row.slug, row.image),
      tint: row.tint,
      count: row._count.products,
   }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
   const categories = await getCategories();
   return categories.find((category) => category.slug === slug) ?? null;
}

/* ───────────── Catalog with filters ───────────── */

export interface CatalogQuery {
   categories?: string[];
   /** Категории, которых в выдаче быть не должно (страница "All clothing" без сумок) */
   excludeCategories?: string[];
   /** Women's page shows women's and unisex pieces, and the same for men */
   gender?: "WOMEN" | "MEN";
   sizes?: Size[];
   colors?: string[];
   price?: PriceBucketValue;
   sort?: SortValue;
   search?: string;
   limit?: number;
}

type ProductWhere = Prisma.ProductWhereInput;

function buildWhere(query: CatalogQuery): ProductWhere {
   const where: ProductWhere = {};

   if (query.categories?.length || query.excludeCategories?.length) {
      where.category = {
         slug: {
            ...(query.categories?.length ? { in: query.categories } : {}),
            ...(query.excludeCategories?.length ? { notIn: query.excludeCategories } : {}),
         },
      };
   }
   if (query.gender) where.gender = { in: [query.gender, "UNISEX"] };
   // Размер считается подходящим, только если он есть в наличии
   if (query.sizes?.length) where.variants = { some: { size: { in: query.sizes }, stock: { gt: 0 } } };
   if (query.colors?.length) where.color = { in: query.colors };

   const bucket = PRICE_BUCKETS.find((item) => item.value === query.price);
   if (bucket && bucket.value !== "any") {
      where.price = bucket.max === null ? { gte: bucket.min } : { gte: bucket.min, lt: bucket.max };
   }

   const search = query.search?.trim();
   if (search) {
      where.OR = [
         { name: { contains: search, mode: "insensitive" } },
         { color: { contains: search, mode: "insensitive" } },
         { material: { contains: search, mode: "insensitive" } },
         { description: { contains: search, mode: "insensitive" } },
         { category: { name: { contains: search, mode: "insensitive" } } },
      ];
   }

   return where;
}

function buildOrderBy(sort: SortValue | undefined) {
   if (sort === "price-asc") return [{ price: "asc" as const }, { id: "asc" as const }];
   if (sort === "price-desc") return [{ price: "desc" as const }, { id: "asc" as const }];
   return [{ createdAt: "desc" as const }, { id: "desc" as const }];
}

export async function getCatalog(query: CatalogQuery): Promise<{ products: Product[]; total: number }> {
   // Кэш на каждую комбинацию фильтров: повторный выбор тех же фильтров не идёт в базу.
   // Через 30 секунд кэш считается устаревшим, и список обновится (остатки, новые товары).
   "use cache";
   cacheLife({ stale: 30, revalidate: 30, expire: 300 });
   cacheTag(CATALOG_TAG);

   const where = buildWhere(query);

   const [rows, total] = await Promise.all([
      prisma.product.findMany({
         where,
         orderBy: buildOrderBy(query.sort),
         take: query.limit ?? CATALOG_PAGE_SIZE,
         include: productInclude,
      }),
      prisma.product.count({ where }),
   ]);

   return { products: await toProducts(rows), total };
}

/** Данные для боковой панели фильтров */
export async function getCatalogFacets(): Promise<{
   categories: Category[];
   colors: { name: string; hex: string }[];
}> {
   "use cache";
   cacheLife("minutes");
   cacheTag(CATALOG_TAG);

   const [categories, colorRows] = await Promise.all([
      getCategories(),
      prisma.product.findMany({ select: { color: true, colorHex: true }, orderBy: { color: "asc" } }),
   ]);

   const colors = new Map<string, string>();
   for (const row of colorRows) if (!colors.has(row.color)) colors.set(row.color, row.colorHex);

   return { categories, colors: [...colors].map(([name, hex]) => ({ name, hex })) };
}

/* ───────────── Single product ───────────── */

export async function getProductBySlug(slug: string): Promise<Product | null> {
   "use cache";
   cacheLife("minutes");
   cacheTag(CATALOG_TAG);

   const row = await prisma.product.findUnique({ where: { slug }, include: productInclude });
   if (!row) return null;
   const [product] = await toProducts([row]);
   return product;
}

/** Other styles from the same category (other colours of the same style are skipped) */
export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
   "use cache";
   cacheLife("minutes");
   cacheTag(CATALOG_TAG);

   const product = await getProductBySlug(slug);
   if (!product) return [];

   const rows = await prisma.product.findMany({
      where: { category: { slug: product.category.slug }, NOT: { id: product.id } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit * 3,
      include: productInclude,
   });

   const sameStyle = new Set(product.colorways.map((colorway) => colorway.slug));
   const seenStyles = new Set<string>();
   const picked: ProductRow[] = [];

   for (const row of rows) {
      if (sameStyle.has(row.slug)) continue;
      const style = row.styleCode ?? row.slug;
      if (seenStyles.has(style)) continue; // one card per style
      seenStyles.add(style);
      picked.push(row);
      if (picked.length === limit) break;
   }

   return toProducts(picked);
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
   "use cache";
   cacheLife("minutes");
   cacheTag(CATALOG_TAG);

   if (ids.length === 0) return [];
   const rows = await prisma.product.findMany({ where: { id: { in: ids } }, include: productInclude });
   const products = await toProducts(rows);
   // Сохраняем порядок, в котором пришли id (последнее добавленное в избранное идёт первым)
   return ids.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product));
}
