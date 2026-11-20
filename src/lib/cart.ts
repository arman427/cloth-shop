/**
 * Корзина лежит в httpOnly cookie "cart" как JSON: [{ variantId, quantity }].
 * В cookie только id размера (ProductVariant) и количество, а цены и остатки каждый
 * раз берутся из базы. Подменить цену в cookie невозможно, потому что мы её не храним.
 *
 * Менять cookie можно только из Server Actions (см. actions/cart.ts),
 * а читать её можно в любом серверном компоненте.
 *
 * Корзина доступна только вошедшему пользователю: у гостя она всегда пустая,
 * а Server Actions корзины отказывают без входа.
 */
import { cookies } from "next/headers";
import { cache } from "react";
import { FREE_SHIPPING_THRESHOLD, MAX_LINE_QUANTITY, PROMO_CODES, SHIPPING_FEE } from "@/constants/shop";
import { productImages } from "@/lib/art";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import type { CartLine, CartSummary } from "@/types";

const CART_COOKIE = "cart";
const PROMO_COOKIE = "promo";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export interface CartCookieLine {
   variantId: number;
   quantity: number;
}

const cookieOptions = () => ({
   httpOnly: true,
   secure: process.env.NODE_ENV === "production",
   sameSite: "lax" as const,
   path: "/",
   maxAge: THIRTY_DAYS,
});

/* ───────────── cookie ⇄ lines ───────────── */

/** Читает cookie и проверяет каждую строку: cookie приходит от клиента, ей нельзя верить. */
export async function readCartLines(): Promise<CartCookieLine[]> {
   const raw = (await cookies()).get(CART_COOKIE)?.value;
   if (!raw) return [];

   try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const lines: CartCookieLine[] = [];
      for (const item of parsed as Partial<CartCookieLine>[]) {
         const variantId = Number(item?.variantId);
         const quantity = Number(item?.quantity);
         if (Number.isInteger(variantId) && variantId > 0 && Number.isInteger(quantity) && quantity > 0) {
            lines.push({ variantId, quantity: Math.min(quantity, MAX_LINE_QUANTITY) });
         }
      }
      return lines;
   } catch {
      return [];
   }
}

/** Только для Server Actions. */
export async function writeCartLines(lines: CartCookieLine[]) {
   const jar = await cookies();
   if (lines.length === 0) jar.delete(CART_COOKIE);
   else jar.set(CART_COOKIE, JSON.stringify(lines), cookieOptions());
}

/* ───────────── promo code ───────────── */

/** Код действует только на первый заказ: у вошедшего пользователя заказов быть не должно. */
export async function isPromoAllowed(userId: number | null): Promise<boolean> {
   if (!userId) return true; // гостя проверить нечем
   const previousOrders = await prisma.order.count({ where: { userId } });
   return previousOrders === 0;
}

export async function setPromoCookie(code: string | null) {
   const jar = await cookies();
   if (code) jar.set(PROMO_COOKIE, code, cookieOptions());
   else jar.delete(PROMO_COOKIE);
}

async function readValidPromo(): Promise<string | null> {
   const code = (await cookies()).get(PROMO_COOKIE)?.value?.toUpperCase();
   if (!code || !PROMO_CODES[code]) return null;

   const user = await getCurrentUser();
   if (!user) return null;
   return (await isPromoAllowed(user.id)) ? code : null;
}

/* ───────────── cart with prices ───────────── */

/**
 * Строки корзины: cookie + актуальные цены и остатки из базы. Гостю всегда пустой список, без запросов к базе.
 * cache(): за один запрос база опрашивается один раз, сколько бы компонентов ни спросили.
 */
const getCartLines = cache(async (): Promise<CartLine[]> => {
   const user = await getCurrentUser();
   if (!user) return [];

   const cookieLines = await readCartLines();
   const ids = cookieLines.map((line) => line.variantId);

   const variants = ids.length
      ? await prisma.productVariant.findMany({
           where: { id: { in: ids } },
           include: {
              product: { select: { slug: true, name: true, color: true, colorHex: true, material: true, price: true, images: true } },
           },
        })
      : [];
   const byId = new Map(variants.map((variant) => [variant.id, variant]));

   const lines: CartLine[] = [];
   for (const cookieLine of cookieLines) {
      const variant = byId.get(cookieLine.variantId);
      if (!variant) continue; // размер удалили из каталога

      const available = variant.stock > 0;
      // Если остаток уменьшился, показываем не больше, чем есть
      const quantity = available ? Math.min(cookieLine.quantity, variant.stock) : cookieLine.quantity;

      lines.push({
         variantId: variant.id,
         quantity,
         maxQuantity: Math.min(variant.stock, MAX_LINE_QUANTITY),
         available,
         size: variant.size,
         unitPrice: variant.product.price,
         lineTotal: available ? variant.product.price * quantity : 0,
         product: {
            slug: variant.product.slug,
            name: variant.product.name,
            color: variant.product.color,
            colorHex: variant.product.colorHex,
            material: variant.product.material,
            image: productImages(variant.product.slug, variant.product.images)[0] ?? null,
         },
      });
   }

   return lines;
});

const countPieces = (lines: CartLine[]) => lines.reduce((sum, line) => sum + (line.available ? line.quantity : 0), 0);

/**
 * Корзина для страниц корзины и оформления заказа.
 * Строки и проверка промокода (есть ли у пользователя заказы) идут в базу параллельно, а не друг за другом.
 */
export const getCart = cache(async (): Promise<CartSummary> => {
   const [lines, promoCode] = await Promise.all([getCartLines(), readValidPromo()]);

   const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
   const count = countPieces(lines);

   const discount = promoCode ? Math.round(subtotal * PROMO_CODES[promoCode].rate) : 0;
   const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

   return {
      lines,
      count,
      subtotal,
      promoCode,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
   };
});

/**
 * Число штук для значка в шапке. Считаем по корзине из базы, а не по cookie: после смены каталога
 * в cookie могут остаться размеры, которых уже нет, и значок показывал бы лишнее.
 * Промокод для значка не нужен, поэтому лишний запрос количества заказов здесь не делаем.
 */
export const getCartCount = cache(async (): Promise<number> => countPieces(await getCartLines()));
