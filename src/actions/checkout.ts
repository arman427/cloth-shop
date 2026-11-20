"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email";
import { getCart, setPromoCookie, writeCartLines } from "@/lib/cart";
import { CATALOG_TAG } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { LIMITS, getClientIp, isBot, rateLimit } from "@/lib/security";
import { getT } from "@/lib/i18n/server";
import { isValidEmail, readText } from "@/utils";

export interface CheckoutState {
   ok: boolean;
   retryAfter?: number;
   soldOutProduct?: string;
   errors?: { name?: string; email?: string; phone?: string; address?: string; form?: string };
   values?: { name: string; email: string; phone: string; address: string; comment: string };
}

class OutOfStockError extends Error {
   constructor(public productName: string) {
      super(`Out of stock: ${productName}`);
   }
}

export async function placeOrder(_prevState: CheckoutState, formData: FormData): Promise<CheckoutState> {
   const values = {
      name: readText(formData, "name"),
      email: readText(formData, "email").toLowerCase(),
      phone: readText(formData, "phone"),
      address: readText(formData, "address"),
      comment: readText(formData, "comment").slice(0, 500),
   };

   // Заказ оформляется только из аккаунта: корзина гостя всегда пуста, но Server Action можно вызвать и напрямую
   const user = await getCurrentUser();
   if (!user) return { ok: false, errors: { form: "Sign in to place an order." }, values };

   // Защита: бот получает "пустую корзину" и ничего не создаёт; остальным лимит заказов с одного IP
   if (isBot(formData)) return { ok: false, errors: { form: "Your bag is empty." }, values };
   const limit = await rateLimit(`checkout:ip:${await getClientIp()}`, LIMITS.checkoutByIp);
   if (!limit.ok) return { ok: false, retryAfter: limit.retryAfter, values };

   const errors: NonNullable<CheckoutState["errors"]> = {};
   if (values.name.length < 2) errors.name = "Enter your full name.";
   if (!isValidEmail(values.email)) errors.email = "Enter an email address like name@example.com.";
   if (values.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number we can reach you on.";
   if (values.address.length < 8) errors.address = "Enter the full delivery address.";
   if (Object.keys(errors).length > 0) return { ok: false, errors, values };

   // Все суммы считаем заново на сервере: цены и остатки берутся из базы, а не из браузера
   const cart = await getCart();
   const items = cart.lines.filter((line) => line.available);

   if (items.length === 0) return { ok: false, errors: { form: "Your bag is empty." }, values };
   if (cart.lines.some((line) => !line.available)) {
      return { ok: false, errors: { form: "Some pieces in your bag have sold out. Remove them to continue." }, values };
   }

   let publicId: string;

   try {
      // Транзакция: либо списываем остатки и создаём заказ, либо не делаем ничего
      const order = await prisma.$transaction(async (tx) => {
         for (const line of items) {
            // Условие stock >= quantity проверяется в самой базе: два покупателя
            // не смогут купить последнюю штуку одновременно.
            const updated = await tx.productVariant.updateMany({
               where: { id: line.variantId, stock: { gte: line.quantity } },
               data: { stock: { decrement: line.quantity } },
            });
            if (updated.count !== 1) throw new OutOfStockError(line.product.name);
         }

         return tx.order.create({
            data: {
               userId: user.id,
               name: values.name,
               email: values.email,
               phone: values.phone,
               address: values.address,
               comment: values.comment || null,
               shipping: cart.shipping,
               discount: cart.discount,
               promoCode: cart.promoCode,
               totalAmount: cart.total,
               items: {
                  create: items.map((line) => ({
                     variantId: line.variantId,
                     quantity: line.quantity,
                     price: line.unitPrice,
                  })),
               },
            },
            select: { publicId: true },
         });
      });
      publicId = order.publicId;
   } catch (error) {
      if (error instanceof OutOfStockError) {
         return {
            ok: false,
            soldOutProduct: error.productName,
            values,
         };
      }
      console.error("placeOrder failed", error);
      return { ok: false, errors: { form: "Something went wrong and your order was not placed. Please try again." }, values };
   }

   await writeCartLines([]);
   await setPromoCookie(null);
   // Остатки изменились: сбрасываем кэш каталога, чтобы витрина не показывала проданные размеры
   updateTag(CATALOG_TAG);

   // Письмо с номером заказа. Если оно не ушло, заказ всё равно оформлен: ошибку просто не показываем.
   const t = await getT();
   await sendEmail({
      to: values.email,
      subject: t("Your VELLUM order"),
      text: [
         t("Thanks, {name}. We've received your order.", { name: values.name }),
         "",
         t("Order number: {id}", { id: publicId }),
         t("Keep it: with this email address it lets you find your order on the Find your order page."),
         "",
         t("VELLUM is a portfolio project. Nothing in it is real, and nothing will be shipped."),
      ].join("\n"),
   });

   // redirect() работает через исключение, поэтому стоит вне try/catch
   redirect(`/orders/${publicId}`);
}
