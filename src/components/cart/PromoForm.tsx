"use client";

import { useActionState } from "react";
import { applyPromo, removePromo, type PromoState } from "@/actions/cart";
import { PROMO_CODES } from "@/constants/shop";
import { Icon } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

const initialState: PromoState = { ok: false };

export function PromoForm({ appliedCode }: { appliedCode: string | null }) {
   const t = useT();
   const [state, formAction, pending] = useActionState(applyPromo, initialState);

   if (appliedCode) {
      return (
         <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-ink/25 bg-card px-4 py-3 text-sm">
            <span className="flex items-center gap-2">
               <Icon name="check" className="size-4 text-cobalt" />
               <b className="tracking-[0.06em]">{appliedCode}</b>
               <span className="text-ink-2">{t(PROMO_CODES[appliedCode]?.label)}</span>
            </span>
            <form action={removePromo}>
               <button type="submit" className="font-semibold underline underline-offset-4 hover:text-cobalt">
                  {t("Remove")}
               </button>
            </form>
         </div>
      );
   }

   return (
      <form action={formAction} className="flex flex-col gap-2">
         <label htmlFor="promo-code" className="text-sm font-semibold">
            {t("Promo code")}
         </label>
         <div className="flex gap-2">
            <input
               id="promo-code"
               name="code"
               autoComplete="off"
               placeholder="VELLUM15"
               aria-invalid={state.error ? true : undefined}
               aria-describedby={state.error ? "promo-error" : undefined}
               className="h-12 min-w-0 flex-1 rounded-full border border-line bg-card px-5 text-[15px] uppercase outline-none placeholder:normal-case placeholder:text-ink-3 hover:border-ink/30 focus:border-ink"
            />
            <button
               type="submit"
               disabled={pending}
               className="h-12 rounded-full border-[1.5px] border-ink px-6 text-[15px] font-semibold transition-colors hover:bg-ink hover:text-white disabled:opacity-50"
            >
               {pending ? t("Checking…") : t("Apply")}
            </button>
         </div>
         {state.error && (
            <p id="promo-error" className="text-[13px] text-cobalt">
               {t(state.error)}
            </p>
         )}
      </form>
   );
}
