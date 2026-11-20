import { getLocale, getT } from "@/lib/i18n/server";
import type { CartSummary } from "@/types";
import { formatPrice } from "@/utils";

type Totals = Pick<CartSummary, "subtotal" | "discount" | "shipping" | "total"> & { promoCode: string | null };

/** Строки с суммами: подытог, скидка, доставка, итог. Используется в корзине, при оформлении и в заказе. */
export async function OrderTotals({ subtotal, discount, shipping, total, promoCode }: Totals) {
   const t = await getT();
   const locale = await getLocale();
   const price = (amount: number) => formatPrice(amount, "USD", locale);

   return (
      <dl className="grid gap-3 text-[15px]">
         <div className="flex justify-between">
            <dt className="text-ink-2">{t("Subtotal")}</dt>
            <dd className="font-semibold">{price(subtotal)}</dd>
         </div>
         {discount > 0 && (
            <div className="flex justify-between">
               <dt className="text-ink-2">{t("Discount")}{promoCode ? ` (${promoCode})` : ""}</dt>
               <dd className="font-semibold text-cobalt">{price(-discount)}</dd>
            </div>
         )}
         <div className="flex justify-between">
            <dt className="text-ink-2">{t("Shipping")}</dt>
            <dd className="font-semibold">{shipping === 0 ? t("Free") : price(shipping)}</dd>
         </div>
         <div className="mt-1 flex justify-between border-t border-line pt-4 text-lg">
            <dt className="font-semibold">{t("Total")}</dt>
            <dd className="font-bold">{price(total)}</dd>
         </div>
      </dl>
   );
}
