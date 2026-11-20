import Link from "next/link";
import { updateCartLine } from "@/actions/cart";
import { Icon, MediaImage, tintFromHex } from "@/components/ui";
import { SIZE_LABEL } from "@/constants/shop";
import { getLocale, getT } from "@/lib/i18n/server";
import type { CartLine } from "@/types";
import { cn, formatPrice } from "@/utils";

const STEP = "grid size-9 place-items-center rounded-full transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent";

/**
 * Строка корзины. Три кнопки (минус, плюс, убрать) лежат в одной обычной форме:
 * поле variantId скрытое, а какая кнопка нажата, сервер узнаёт по name="intent".
 * Работает и без JavaScript.
 */
export async function CartLineItem({ line }: { line: CartLine }) {
   const t = await getT();
   const locale = await getLocale();
   const { product } = line;
   const href = `/product/${product.slug}`;

   return (
      <li className={cn("grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr]", !line.available && "opacity-80")}>
         <Link href={href} className="block aspect-[4/5] overflow-hidden rounded-xl">
            <MediaImage src={product.image} alt={t(product.name)} tint={tintFromHex(product.colorHex)} sizes="120px" className="size-full" />
         </Link>

         <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-4">
               <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold">
                     <Link href={href} className="hover:text-cobalt">
                        {t(product.name)}
                     </Link>
                  </h3>
                  <p className="text-sm text-ink-3">
                     {t(product.color)} · {t(SIZE_LABEL[line.size])}
                  </p>
               </div>
               <p className="text-[17px] font-bold">{formatPrice(line.available ? line.lineTotal : line.unitPrice, "USD", locale)}</p>
            </div>

            <form action={updateCartLine} className="mt-auto flex items-center justify-between gap-4 pt-4">
               <input type="hidden" name="variantId" value={line.variantId} />

               {line.available ? (
                  <div className="flex items-center rounded-full border border-line" role="group" aria-label={t("Quantity of {name}", { name: t(product.name) })}>
                     <button type="submit" name="intent" value="dec" disabled={line.quantity <= 1} aria-label={t("Decrease quantity")} className={STEP}>
                        <Icon name="minus" className="size-4" />
                     </button>
                     <span className="min-w-8 text-center text-[15px] font-semibold" aria-live="polite">
                        {line.quantity}
                     </span>
                     <button
                        type="submit"
                        name="intent"
                        value="inc"
                        disabled={line.quantity >= line.maxQuantity}
                        aria-label={t("Increase quantity")}
                        className={STEP}
                     >
                        <Icon name="plus" className="size-4" />
                     </button>
                  </div>
               ) : (
                  <p className="text-sm font-semibold text-cobalt">{t("Sold out in this size")}</p>
               )}

               <button
                  type="submit"
                  name="intent"
                  value="remove"
                  className="flex items-center gap-1.5 text-sm font-medium text-ink-2 underline-offset-4 transition-colors hover:text-cobalt hover:underline"
               >
                  <Icon name="trash" className="size-4" />
                  {t("Remove")}
               </button>
            </form>
         </div>
      </li>
   );
}
