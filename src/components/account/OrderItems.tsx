import Link from "next/link";
import { MediaImage } from "@/components/ui";
import { SIZE_LABEL } from "@/constants/shop";
import { getLocale, getT } from "@/lib/i18n/server";
import type { OrderLineView } from "@/types";
import { formatPrice } from "@/utils";

/** Список вещей в заказе. Цена здесь та, что была в момент покупки (OrderItem.price). */
export async function OrderItems({ items }: { items: OrderLineView[] }) {
   const t = await getT();
   const locale = await getLocale();

   return (
      <ul className="divide-y divide-line border-y border-line">
         {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 py-4">
               <MediaImage src={item.image} alt={t(item.name)} label="" sizes="64px" className="aspect-[4/5] rounded-lg" />
               <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">
                     <Link href={`/product/${item.slug}`} className="hover:text-cobalt">
                        {t(item.name)}
                     </Link>
                  </p>
                  <p className="text-[13px] text-ink-3">
                     {t(item.color)} · {t(SIZE_LABEL[item.size])} · {t("Qty {quantity}", { quantity: item.quantity })}
                  </p>
               </div>
               <p className="text-[15px] font-semibold">{formatPrice(item.price * item.quantity, "USD", locale)}</p>
            </li>
         ))}
      </ul>
   );
}
