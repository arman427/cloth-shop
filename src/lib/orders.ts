import { productImages } from "@/lib/art";
import { getCurrentUser } from "@/lib/auth/session";
import { getGuestOrderIds } from "@/lib/guestOrders";
import { prisma } from "@/lib/prisma";
import type { OrderStatus, OrderView, Size } from "@/types";

const orderInclude = {
   items: {
      orderBy: { id: "asc" as const },
      include: {
         variant: {
            select: {
               size: true,
               product: { select: { name: true, slug: true, color: true, images: true } },
            },
         },
      },
   },
};

interface OrderRow {
   id: number;
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
   items: {
      id: number;
      quantity: number;
      price: number;
      variant: { size: Size; product: { name: string; slug: string; color: string; images: string[] } };
   }[];
}

function mapOrder(row: OrderRow): OrderView {
   return {
      id: row.id,
      userId: row.userId,
      publicId: row.publicId,
      status: row.status,
      createdAt: row.createdAt,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      comment: row.comment,
      promoCode: row.promoCode,
      discount: row.discount,
      shipping: row.shipping,
      totalAmount: row.totalAmount,
      items: row.items.map((item) => ({
         id: item.id,
         quantity: item.quantity,
         price: item.price,
         size: item.variant.size,
         name: item.variant.product.name,
         color: item.variant.product.color,
         slug: item.variant.product.slug,
         image: productImages(item.variant.product.slug, item.variant.product.images)[0] ?? null,
      })),
   };
}

export async function getOrdersForUser(userId: number): Promise<OrderView[]> {
   const rows = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: orderInclude,
   });
   return rows.map(mapOrder);
}

/** Заказ по публичному id. Сам по себе id доступа не даёт: для показа заказа используйте getOrderForViewer. */
export async function getOrderByPublicId(publicId: string): Promise<OrderView | null> {
   const row = await prisma.order.findUnique({ where: { publicId }, include: orderInclude });
   return row ? mapOrder(row) : null;
}

/**
 * Заказ, который можно показать ЭТОМУ посетителю, иначе null. Заказ видят:
 *  - владелец, если он вошёл в аккаунт;
 *  - гость, оформивший этот заказ в этом браузере, или нашедший его по номеру и email
 *    (оба случая запоминает cookie, см. lib/guestOrders.ts).
 * Одной ссылки с id недостаточно, поэтому пересланная ссылка чужому человеку ничего не покажет.
 */
export async function getOrderForViewer(publicId: string): Promise<OrderView | null> {
   const [order, user, guestOrderIds] = await Promise.all([getOrderByPublicId(publicId), getCurrentUser(), getGuestOrderIds()]);
   if (!order) return null;

   const isOwner = user !== null && order.userId === user.id;
   const isGuestOwner = guestOrderIds.includes(order.publicId);
   return isOwner || isGuestOwner ? order : null;
}
