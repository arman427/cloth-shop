"use client";

import { Icon } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

interface SearchFieldProps {
   className?: string;
}

/** Plain GET form so search works before hydration. */
export function SearchField({ className }: SearchFieldProps) {
   const t = useT();

   return (
      <form
         role="search"
         action="/search"
         className={cn(
            "flex h-11 w-[260px] items-center gap-2.5 rounded-full border border-line bg-card px-[18px] text-ink-3 hover:border-ink/40 duration-300",
            "focus-within:border-ink/40",
            className,
         )}
      >
         <Icon name="search" className="size-[18px]" />
         <label htmlFor="site-search" className="sr-only">
            {t("Search the shop")}
         </label>
         <input
            id="site-search"
            name="q"
            type="search"
            placeholder={t("Search jackets, knitwear…")}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
         />
      </form>
   );
}
