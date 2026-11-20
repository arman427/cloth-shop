"use client";

import Link from "next/link";
import { useT } from "@/providers/LocaleProvider";
import type { Colorway } from "@/types";
import { cn } from "@/utils";

interface ColorSwatchesProps {
   colorways: Colorway[];
   /** slug текущего цвета: он обводится */
   currentSlug: string;
   size?: "sm" | "md";
   label: string;
   className?: string;
}

const SIZES = {
   sm: "size-4",
   md: "size-[22px]",
} as const;

/** Каждый цвет фасона это отдельный товар, поэтому кружок ведёт на его страницу. */
export function ColorSwatches({ colorways, currentSlug, size = "md", label, className }: ColorSwatchesProps) {
   const t = useT();
   return (
      <ul aria-label={label} className={cn("flex gap-2", className)}>
         {colorways.map((colorway) => {
            const current = colorway.slug === currentSlug;
            return (
               <li key={colorway.slug}>
                  <Link
                     href={`/product/${colorway.slug}`}
                     aria-label={t(colorway.color)}
                     aria-current={current ? "true" : undefined}
                     title={t(colorway.color)}
                     style={{ backgroundColor: colorway.hex }}
                     className={cn(
                        "block rounded-full shadow-swatch outline-offset-3",
                        SIZES[size],
                        current
                           ? "outline-[1.5px] outline-ink outline-solid"
                           : "hover:outline-[1.5px] hover:outline-ink/30 hover:outline-solid",
                     )}
                  />
               </li>
            );
         })}
      </ul>
   );
}
