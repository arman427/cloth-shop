"use server";

/**
 * Поиск заказа гостем: номер заказа + email, с которым его оформляли.
 * Нашли — запоминаем заказ в cookie этого браузера (см. lib/guestOrders.ts) и открываем страницу заказа.
 */
import { redirect } from "next/navigation";
import { rememberGuestOrder } from "@/lib/guestOrders";
import { getT } from "@/lib/i18n/server";
import { retryMessage } from "@/lib/i18n/retryMessage";
import { prisma } from "@/lib/prisma";
import { LIMITS, getClientIp, isBot, rateLimitAll } from "@/lib/security";
import { isValidEmail, readText } from "@/utils";

export interface TrackState {
   ok: boolean;
   errors?: { orderNumber?: string; email?: string; form?: string };
   values?: { orderNumber: string; email: string };
}

/** Одно сообщение на все причины: "нет такого заказа" и "email не тот" не должны отличаться */
const NOT_FOUND = "We couldn't find an order with that number and email. Check both and try again.";

export async function findOrder(_prevState: TrackState, formData: FormData): Promise<TrackState> {
   const t = await getT();
   const values = {
      orderNumber: readText(formData, "orderNumber").slice(0, 60),
      email: readText(formData, "email").toLowerCase(),
   };

   if (isBot(formData)) return { ok: false, errors: { form: t(NOT_FOUND) }, values };

   // Лимит и по IP (против перебора многих номеров), и по номеру (против подбора email к одному заказу)
   const ip = await getClientIp();
   const limit = await rateLimitAll([
      [`orderLookup:ip:${ip}`, LIMITS.orderLookupByIp],
      [`orderLookup:order:${values.orderNumber.toLowerCase()}`, LIMITS.orderLookupByOrder],
   ]);
   if (!limit.ok) return { ok: false, errors: { form: retryMessage(t, limit.retryAfter) }, values };

   const errors: NonNullable<TrackState["errors"]> = {};
   if (!values.orderNumber) errors.orderNumber = t("Enter your order number.");
   if (!isValidEmail(values.email)) errors.email = t("Enter the email address you used at checkout.");
   if (Object.keys(errors).length > 0) return { ok: false, errors, values };

   const order = await prisma.order.findFirst({
      where: { publicId: values.orderNumber, email: values.email },
      select: { publicId: true },
   });
   if (!order) return { ok: false, errors: { form: t(NOT_FOUND) }, values };

   await rememberGuestOrder(order.publicId);
   redirect(`/orders/${order.publicId}`);
}
