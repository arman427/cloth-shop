"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { addToCart, type CartResult } from "@/actions/cart";
import { Badge, ColorSwatches, Icon, MediaImage, tintFromHex } from "@/components/ui";
import { BADGES, SIZE_LABEL } from "@/constants/shop";
import { useAuthDialog, useRequireSignIn, useTemporaryFlag } from "@/hooks";
import { useLocale, useT } from "@/providers/LocaleProvider";
import { translateMaterial } from "@/lib/i18n/material";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/utils";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProps {
   product: Product;
   priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
   const t = useT();
   const requireSignIn = useRequireSignIn();
   const { openAuth } = useAuthDialog();
   const locale = useLocale();
   const onlySize = product.sizes.length === 1 ? product.sizes[0] : null;
   const allSoldOut = product.sizes.every((option) => option.stock === 0);

   const [variantId, setVariantId] = useState<number | null>(onlySize && onlySize.stock > 0 ? onlySize.variantId : null);
   const [message, setMessage] = useState<Extract<CartResult, { ok: false }> | null>(null);
   const [added, flashAdded] = useTemporaryFlag();
   const [pending, startTransition] = useTransition();

   const addToBag = () => {
      // Гость не может класть вещи в корзину: сразу окно входа
      if (!requireSignIn()) return;
      if (!variantId) {
         setMessage({ ok: false, error: "Choose a size first" });
         return;
      }
      setMessage(null);
      startTransition(async () => {
         const result = await addToCart(variantId);
         if (result.ok) flashAdded();
         else if (result.unauthenticated) openAuth("login");
         else setMessage(result);
      });
   };

   const reveal =
      "transition duration-200 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100";

   const badge = product.badge ? BADGES[product.badge] : null;

   return (
      <article className="group">
         <div className="relative h-[410px] overflow-hidden rounded-card bg-card">
            <Link href={`/product/${product.slug}`} aria-label={t(product.name)} className="absolute inset-0">
               <MediaImage
                  src={product.images[0]}
                  alt={t(product.name)}
                  tint={tintFromHex(product.colorHex)}
                  priority={priority}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="size-full"
               />
            </Link>

            {badge && (
               <Badge tone={badge.tone} className="absolute top-4 left-4">
                   {t(badge.label)}
                </Badge>
            )}

            <FavoriteButton
               productId={product.id}
               name={product.name}
               className="absolute top-4 right-4"
            />

            {!onlySize && !allSoldOut && (
               <div
                  role="radiogroup"
                   aria-label={t("{name} size", { name: t(product.name) })}
                  className={cn("absolute inset-x-4 bottom-[72px] flex justify-center gap-1.5", reveal)}
               >
                  {product.sizes.map((option) => (
                     <button
                        key={option.variantId}
                        type="button"
                        role="radio"
                        aria-checked={variantId === option.variantId}
                        disabled={option.stock === 0}
                        onClick={() => {
                           setVariantId(option.variantId);
                           setMessage(null);
                        }}
                        className={cn(
                           "rounded-lg px-[11px] py-1.5 text-[13px] leading-[1.55] font-semibold transition-colors",
                           option.stock === 0 && "cursor-not-allowed bg-white text-[#B9BDC3] line-through",
                           option.stock > 0 && variantId === option.variantId && "bg-ink text-white",
                           option.stock > 0 && variantId !== option.variantId && "bg-white hover:bg-paper-2",
                           message && variantId === null && option.stock > 0 && "ring-1 ring-cobalt",
                        )}
                     >
                        {t(SIZE_LABEL[option.size])}
                     </button>
                  ))}
               </div>
            )}

            <button
               type="button"
               onClick={addToBag}
               disabled={allSoldOut || pending}
               aria-live="polite"
               className={cn(
                  "absolute inset-x-4 bottom-4 flex h-[46px] items-center justify-center gap-2.5 rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/60",
                  !allSoldOut && reveal,
               )}
            >
               <Icon name={added ? "check" : "bag"} className="size-[18px]" />
               <span className="truncate">
                    {t(allSoldOut ? "Sold out" : pending ? "Adding…" : added ? "Added to bag" : (message?.error ?? "Add to bag"), message?.vars)}
               </span>
            </button>
         </div>

         <div className="mt-[18px] flex items-start justify-between gap-4">
            <div>
               <h3 className="block text-[17px] font-semibold">
                  <Link href={`/product/${product.slug}`} className="hover:text-cobalt">
                     {t(product.name)}
                  </Link>
               </h3>
               <p className="text-sm leading-[1.55rem] text-ink-3">
                  {translateMaterial(product.material, t)}
               </p>
            </div>
            <p className="text-[17px] font-bold">{formatPrice(product.price, "USD", locale)}</p>
         </div>

         {product.colorways.length > 1 && (
            <ColorSwatches
               colorways={product.colorways}
               currentSlug={product.slug}
               size="sm"
               label={t("{name} colours", { name: t(product.name) })}
               className="mt-3"
            />
         )}
      </article>
   );
}
