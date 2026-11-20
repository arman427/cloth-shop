"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type FavoriteResult = { ok: true; favorite: boolean } | { ok: false; error: "unauthenticated" | "failed" };

/**
 * Добавить товар в избранное или убрать оттуда.
 * Избранное хранится в базе и привязано к аккаунту, поэтому без входа его нет:
 * тогда возвращаем "unauthenticated", и клиент открывает окно входа.
 */
export async function toggleFavorite(productId: number): Promise<FavoriteResult> {
   const user = await getCurrentUser();
   if (!user) return { ok: false, error: "unauthenticated" };
   if (!Number.isInteger(productId) || productId <= 0) return { ok: false, error: "failed" };

   const key = { userId_productId: { userId: user.id, productId } };
   const existing = await prisma.favorite.findUnique({ where: key, select: { userId: true } });

   try {
      if (existing) await prisma.favorite.delete({ where: key });
      else await prisma.favorite.create({ data: { userId: user.id, productId } });
   } catch (error) {
      console.error("toggleFavorite failed", error);
      return { ok: false, error: "failed" };
   }

   // Перерисовать текущую страницу, чтобы счётчик в шапке и сердечки обновились.
   // refresh(), а не revalidatePath("/", "layout"): тот сбрасывал весь кэш каталога на каждое сердечко.
   refresh();
   return { ok: true, favorite: !existing };
}
