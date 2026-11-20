import { FREE_SHIPPING_THRESHOLD } from "@/constants/shop";
import { getLocale, getT } from "@/lib/i18n/server";
import { formatPrice } from "@/utils";

export async function FreeShippingBar({ subtotal, remaining }: { subtotal: number; remaining: number }) {
   const t = await getT();
   const locale = await getLocale();
   const share = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

   return (
      <div>
         <p className="mb-2.5 text-sm text-ink-2">
            {remaining > 0 ? (
               t("Add {amount} more for free shipping.", { amount: formatPrice(remaining, "USD", locale) })
            ) : (
               <b className="text-ink">{t("Your order ships free.")}</b>
            )}
         </p>
         <div className="h-1.5 overflow-hidden rounded-[3px] bg-paper-2" role="presentation">
            <div className="h-full rounded-[3px] bg-cobalt transition-[width] duration-500" style={{ width: `${share}%` }} />
         </div>
      </div>
   );
}
