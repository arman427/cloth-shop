"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

interface SearchFieldProps {
   className?: string;
}

/** Plain GET form so search works before hydration. */
export function SearchField({ className }: SearchFieldProps) {
   const t = useT();
   const [value, setValue] = useState("");
   const inputRef = useRef<HTMLInputElement>(null);

   const clear = () => {
      setValue("");
      inputRef.current?.focus();
   };

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
         <button
            type="submit"
            aria-label={t("Search the shop")}
            className="shrink-0 cursor-pointer"
         >
            <Icon
               name="search"
               className="size-[18px] duration-200 hover:scale-110"
            />
         </button>
         <label htmlFor="site-search" className="sr-only">
            {t("Search the shop")}
         </label>
         <input
            ref={inputRef}
            id="site-search"
            name="q"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t("Search jackets, knitwear…")}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:appearance-none"
         />
         {value && (
            <button
               type="button"
               onClick={clear}
               aria-label={t("Clear search")}
               className="shrink-0 cursor-pointer"
            >
               <Icon
                  name="x"
                  className="size-4 duration-200 hover:scale-110 hover:text-ink"
               />
            </button>
         )}
      </form>
   );
}
