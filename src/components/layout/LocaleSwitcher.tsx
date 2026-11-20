"use client";

import { LOCALES, LOCALE_NAMES, LOCALE_SHORT, type Locale } from "@/lib/i18n/config";
import { useLocale, useLocaleSwitch, useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

interface LocaleSwitcherProps {
   className?: string;
   /** Light text on a dark background */
   onDark?: boolean;
}

export function LocaleSwitcher({ className, onDark = false }: LocaleSwitcherProps) {
   const locale = useLocale();
   const t = useT();
   const { switchLocale, switching: pending } = useLocaleSwitch();

   const change = (next: Locale) => {
      if (next === locale || pending) return;
      switchLocale(next);
   };

   return (
      <div
         role="group"
         aria-busy={pending}
         aria-label={t("Language")}
         className={cn(
            "flex shrink-0 items-center rounded-full border p-0.5 text-[11px] leading-none font-semibold",
            onDark ? "border-white/20" : "border-line",
            className,
         )}
      >
         {LOCALES.map((item) => {
            const active = item === locale;
            return (
               <button
                  key={item}
                   type="button"
                   lang={item}
                   disabled={pending}
                  onClick={() => change(item)}
                  aria-pressed={active}
                  aria-label={LOCALE_NAMES[item]}
                  title={LOCALE_NAMES[item]}
                  className={cn(
                     "rounded-full px-2 py-1.5 transition-colors",
                     active
                        ? onDark
                           ? "bg-white text-ink"
                           : "bg-ink text-white"
                        : onDark
                          ? "text-white/70 hover:text-white"
                          : "text-ink-2 hover:text-ink",
                  )}
               >
                  {LOCALE_SHORT[item]}
               </button>
            );
         })}
      </div>
   );
}
