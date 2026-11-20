"use client";

import { Stars } from "@/components/ui";
import { useLocale, useT } from "@/providers/LocaleProvider";
import type { RatingSummary as RatingSummaryData } from "@/types";
import { formatNumber } from "@/utils";

interface RatingSummaryProps {
   summary: RatingSummaryData;
}

export function RatingSummary({ summary }: RatingSummaryProps) {
   const t = useT();
   const locale = useLocale();
   const numberLocale = locale === "ru" ? "ru-RU" : "en-US";

   return (
      <div>
         <p className="font-display text-[140px] leading-[0.85]">
            {formatNumber(summary.average, numberLocale)}
            <small className="font-sans text-[22px] font-medium text-ink-3"> / 5</small>
         </p>
         <Stars rating={summary.average} className="mt-[18px] mb-2 block text-xl" />
         <p className="text-ink-2">
            {t("Based on {count} verified reviews", { count: formatNumber(summary.total, numberLocale) })}
         </p>

         <dl className="mt-7 grid max-w-[340px] gap-2.5">
            {summary.breakdown.map((row) => {
               const share = summary.total ? (row.count / summary.total) * 100 : 0;
               return (
                  <div key={row.stars} className="grid grid-cols-[20px_1fr_40px] items-center gap-3 text-[13px] text-ink-2">
                     <dt>
                        <span className="sr-only">{t("{count} stars", { count: row.stars })}</span>
                        <span aria-hidden="true">{row.stars}</span>
                     </dt>
                     <span aria-hidden="true" className="relative h-1.5 overflow-hidden rounded-[3px] bg-paper-2">
                        <span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${share}%` }} />
                     </span>
                     <dd>{formatNumber(row.count, numberLocale)}</dd>
                  </div>
               );
            })}
         </dl>
      </div>
   );
}
