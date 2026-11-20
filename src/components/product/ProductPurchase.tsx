"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { addToCart, type CartResult } from "@/actions/cart";
import { Button, Icon } from "@/components/ui";
import { SIZE_LABEL } from "@/constants/shop";
import { useAuthDialog, useRequireSignIn, useTemporaryFlag } from "@/hooks";
import { useT } from "@/providers/LocaleProvider";
import type { Product } from "@/types";
import { cn } from "@/utils";
import { FavoriteButton } from "./FavoriteButton";

interface ProductPurchaseProps {
   product: Product;
}

export function ProductPurchase({ product }: ProductPurchaseProps) {
   const t = useT();
   const requireSignIn = useRequireSignIn();
   const { openAuth } = useAuthDialog();
   const onlySize = product.sizes.length === 1 ? product.sizes[0] : null;
   const allSoldOut = product.sizes.every((option) => option.stock === 0);

   const [variantId, setVariantId] = useState<number | null>(onlySize && onlySize.stock > 0 ? onlySize.variantId : null);
   const [error, setError] = useState<Extract<CartResult, { ok: false }> | null>(null);
   const [added, flashAdded] = useTemporaryFlag();
   const [pending, startTransition] = useTransition();

   const selected = product.sizes.find((option) => option.variantId === variantId);

   const addToBag = () => {
      // Гость не может класть вещи в корзину: сразу окно входа
      if (!requireSignIn()) return;
      if (!variantId) {
         setError({ ok: false, error: "Choose a size first." });
         return;
      }
      setError(null);
      startTransition(async () => {
         const result = await addToCart(variantId);
         if (result.ok) flashAdded();
         else if (result.unauthenticated) openAuth("login");
         else setError(result);
      });
   };

   return (
      <div>
         {!onlySize && (
            <fieldset>
               <legend className="mb-3 flex w-full items-center justify-between text-[15px] font-semibold">
                   {t("Size")}
                   <Link href="/help/size-guide" className="flex items-center gap-1.5 text-sm font-medium text-ink-2 underline underline-offset-4 hover:text-cobalt">
                      <Icon name="ruler" className="size-4" />
                      {t("Size guide")}
                   </Link>
                </legend>
                <div role="radiogroup" aria-label={t("Size")} className="flex flex-wrap gap-2.5">
                  {product.sizes.map((option) => (
                     <button
                        key={option.variantId}
                        type="button"
                        role="radio"
                        aria-checked={variantId === option.variantId}
                        disabled={option.stock === 0}
                        onClick={() => {
                           setVariantId(option.variantId);
                           setError(null);
                        }}
                        className={cn(
                           "grid h-12 min-w-14 place-items-center rounded-full border-[1.5px] px-4 text-[15px] font-semibold transition-colors",
                           option.stock === 0 && "cursor-not-allowed border-line text-ink-3/60 line-through",
                           option.stock > 0 && variantId === option.variantId && "border-ink bg-ink text-white",
                           option.stock > 0 && variantId !== option.variantId && "border-line hover:border-ink",
                           error && variantId === null && option.stock > 0 && "border-cobalt",
                        )}
                     >
                        {t(SIZE_LABEL[option.size])}
                     </button>
                  ))}
               </div>
            </fieldset>
         )}

         <p className="mt-3 min-h-6 text-sm" aria-live="polite">
            {error ? (
                <span className="text-cobalt">{t(error.error, error.vars)}</span>
            ) : selected && selected.stock <= 3 ? (
               <span className="text-ink-2">{t("Only {count} left in this size.", { count: selected.stock })}</span>
            ) : allSoldOut ? (
               <span className="text-ink-2">{t("This colour is sold out for now.")}</span>
            ) : null}
         </p>

         <div className="mt-4 flex gap-3">
            <Button onClick={addToBag} disabled={allSoldOut || pending} className="flex-1">
               <Icon name={added ? "check" : "bag"} className="size-5" />
               {t(allSoldOut ? "Sold out" : pending ? "Adding…" : added ? "Added to bag" : "Add to bag")}
            </Button>
            <FavoriteButton
               productId={product.id}
               name={product.name}
               variant="outline"
            />
         </div>

         {added && (
            <p className="mt-4 text-sm text-ink-2">
               {t("Added.")}{" "}
               <Link href="/cart" className="font-semibold text-ink underline underline-offset-4 hover:text-cobalt">
                   {t("View your bag")}
                </Link>
            </p>
         )}
      </div>
   );
}
