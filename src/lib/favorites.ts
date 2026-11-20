import { cache } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getProductsByIds } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

export interface FavoriteState {
   /** Вошёл ли пользователь. Гость сердечками пользоваться не может: ему открывается окно входа. */
   signedIn: boolean;
   /** Id избранных товаров. Это массив, а не Set, чтобы его можно было передать в клиентский компонент. */
   ids: number[];
}

/** Избранное текущего пользователя. cache(): за один запрос база опрашивается один раз. */
export const getFavoriteState = cache(async (): Promise<FavoriteState> => {
   const user = await getCurrentUser();
   if (!user) return { signedIn: false, ids: [] };

   const rows = await prisma.favorite.findMany({
      where: { userId: user.id },
      select: { productId: true },
   });
   return { signedIn: true, ids: rows.map((row) => row.productId) };
});

/** Избранное для страницы /wishlist: последнее добавленное идёт первым. */
export async function getFavoriteProducts(userId: number): Promise<Product[]> {
   const rows = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { productId: true },
   });
   return getProductsByIds(rows.map((row) => row.productId));
}
