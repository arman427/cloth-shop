"use client";

import { Button, ColorSwatches } from "@/components/ui";
import { useLocale, useT } from "@/providers/LocaleProvider";
import { translateMaterial } from "@/lib/i18n/material";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/utils";

interface HeroProductCardProps {
   product: Product;
   className?: string;
}

/** Плашка с описанием вещи под кадром. key={product.id} в Hero перезапускает fade-in при смене слайда. */
export function HeroProductCard({ product, className }: HeroProductCardProps) {
   const t = useT();
   const locale = useLocale();

   return (
      <div
         className={cn(
            "flex animate-[fade-in_500ms_ease-out] flex-wrap items-center gap-x-[22px] gap-y-4 rounded-[14px] bg-card py-4 pr-4 pl-6 shadow-float sm:flex-nowrap",
            className,
         )}
      >
         <div className="min-w-0 flex-1 basis-full sm:basis-auto">
            <p className="block text-lg font-semibold">{t(product.name)}</p>
            <span className="text-sm text-ink-3">{translateMaterial(product.material, t)}</span>
         </div>
         {product.colorways.length > 1 && (
            <ColorSwatches
               colorways={product.colorways}
               currentSlug={product.slug}
               label={t("{name} colours", { name: t(product.name) })}
            />
         )}
         <p className="px-2 text-[22px] font-bold">{formatPrice(product.price, "USD", locale)}</p>
         <Button size="sm" href={`/product/${product.slug}`} className="ml-auto sm:ml-0">
            {t("Shop this piece")}
         </Button>
      </div>
   );
}
