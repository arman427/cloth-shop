"use server";

import { MAX_LINE_QUANTITY, PROMO_CODES } from "@/constants/shop";
import { getCurrentUser } from "@/lib/auth/session";
import { isPromoAllowed, readCartLines, setPromoCookie, writeCartLines } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { readInt, readText } from "@/utils";

export type CartResult =
   | { ok: true }
   | { ok: false; error: string; vars?: { count: number }; unauthenticated?: true };

/**
 * Добавить размер в корзину. Вызывается из кнопок "Add to bag" на клиенте.
 * Только для вошедших: кнопка у гостя сама открывает окно входа, но Server Action можно вызвать
 * и в обход интерфейса, поэтому вход проверяем здесь, на сервере.
 */
export async function addToCart(variantId: number, quantity = 1): Promise<CartResult> {
   const user = await getCurrentUser();
   if (!user) return { ok: false, error: "Sign in to add pieces to your bag.", unauthenticated: true };

   if (!Number.isInteger(variantId) || variantId <= 0) return { ok: false, error: "Choose a size first." };
   const wanted = Math.min(Math.max(Math.trunc(quantity) || 1, 1), MAX_LINE_QUANTITY);

   const variant = await prisma.productVariant.findUnique({ where: { id: variantId }, select: { stock: true } });
   if (!variant) return { ok: false, error: "This piece is no longer available." };
   if (variant.stock <= 0) return { ok: false, error: "Sold out in this size." };

   const lines = await readCartLines();
   const existing = lines.find((line) => line.variantId === variantId);
   const limit = Math.min(variant.stock, MAX_LINE_QUANTITY);
   const next = Math.min((existing?.quantity ?? 0) + wanted, limit);

   if (existing && next === existing.quantity) {
      return { ok: false, error: "Only {count} in stock, and they're already in your bag.", vars: { count: limit } };
   }

   if (existing) existing.quantity = next;
   else lines.push({ variantId, quantity: next });

   await writeCartLines(lines);
   return { ok: true };
}

/**
 * Изменить строку в корзине. Используется как action у обычных <form> на странице корзины:
 * форма шлёт скрытое поле variantId и кнопку с name="intent" (inc, dec или remove).
 */
export async function updateCartLine(formData: FormData): Promise<void> {
   if (!(await getCurrentUser())) return;

   const variantId = readInt(formData, "variantId");
   const intent = readText(formData, "intent");
   if (!variantId) return;

   const lines = await readCartLines();
   const line = lines.find((item) => item.variantId === variantId);
   if (!line) return;

   if (intent === "remove") {
      await writeCartLines(lines.filter((item) => item.variantId !== variantId));
      return;
   }

   if (intent === "dec") line.quantity -= 1;
   if (intent === "inc") {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId }, select: { stock: true } });
      const limit = Math.min(variant?.stock ?? 0, MAX_LINE_QUANTITY);
      line.quantity = Math.min(line.quantity + 1, limit);
   }

   await writeCartLines(lines.filter((item) => item.quantity > 0));
}

/* ───────────── Promo code ───────────── */

export interface PromoState {
   ok: boolean;
   error?: string;
}

export async function applyPromo(_prevState: PromoState, formData: FormData): Promise<PromoState> {
   const code = readText(formData, "code").toUpperCase();
   if (!code) return { ok: false, error: "Enter a promo code." };
   if (!PROMO_CODES[code]) return { ok: false, error: "That code isn't valid." };

   const user = await getCurrentUser();
   if (!user) return { ok: false, error: "Sign in to use a promo code." };
   if (!(await isPromoAllowed(user.id))) {
      return { ok: false, error: "This code is for first orders only." };
   }

   await setPromoCookie(code);
   return { ok: true };
}

export async function removePromo(): Promise<void> {
   await setPromoCookie(null);
}
