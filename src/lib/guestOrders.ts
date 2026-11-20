/**
 * Доступ гостя к своим заказам.
 *
 * У гостя нет аккаунта, поэтому заказ нужно как-то привязать к нему. Привязываем к браузеру:
 * в httpOnly-cookie "guest_orders" лежит список номеров заказов, которые этот браузер вправе видеть.
 * Номер попадает туда в двух случаях:
 *  1. гость только что оформил заказ (actions/checkout.ts);
 *  2. гость нашёл заказ на странице /orders/track по номеру и email (actions/orders.ts).
 *
 * Сама по себе ссылка /orders/<номер> заказ не открывает: страница проверяет эту cookie
 * или вход владельца (см. getOrderForViewer в lib/orders.ts).
 */
import { cookies } from "next/headers";

export const GUEST_ORDERS_COOKIE = "guest_orders";
const MAX_REMEMBERED = 10;
const DAYS = 30;

/** Номера заказов — это cuid: латинские буквы и цифры. Всё остальное из cookie выбрасываем. */
const ORDER_ID = /^[a-z0-9]{10,40}$/i;

/** Заказы, которые этот браузер вправе видеть. Читать можно где угодно на сервере. */
export async function getGuestOrderIds(): Promise<string[]> {
   const raw = (await cookies()).get(GUEST_ORDERS_COOKIE)?.value ?? "";
   return raw
      .split(",")
      .filter((id) => ORDER_ID.test(id))
      .slice(0, MAX_REMEMBERED);
}

/** Запомнить заказ в этом браузере. Писать cookie можно только из Server Action. */
export async function rememberGuestOrder(publicId: string) {
   const ids = [publicId, ...(await getGuestOrderIds()).filter((id) => id !== publicId)].slice(0, MAX_REMEMBERED);

   (await cookies()).set(GUEST_ORDERS_COOKIE, ids.join(","), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DAYS * 24 * 60 * 60,
   });
}
