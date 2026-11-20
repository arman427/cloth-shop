"use client";

import { useLocale, useT } from "@/providers/LocaleProvider";
import { cn, formatNumber } from "@/utils";

interface StarsProps {
   rating: number;
   className?: string;
}

/** Five cobalt stars. The rating is exposed to screen readers only. */
export function Stars({ rating, className }: StarsProps) {
   const t = useT();
   const locale = useLocale();
   return (
      <span className={cn("tracking-[2px] text-cobalt", className)} role="img" aria-label={t("Rated {rating} out of 5", { rating: formatNumber(rating, locale) })}>
         ★★★★★
      </span>
   );
}
