"use client";

import { useState } from "react";
import { MediaImage } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

interface ProductGalleryProps {
   name: string;
   images: string[];
   tint: string;
}

/** Подписи для заглушек: пока нет фото, галерея показывает четыре пустых кадра */
const PLACEHOLDER_LABELS = ["Front", "Back", "Detail", "On model"];

export function ProductGallery({ name, images, tint }: ProductGalleryProps) {
   const t = useT();
   const slots: (string | null)[] = images.length > 0 ? images : PLACEHOLDER_LABELS.map(() => null);
   const [active, setActive] = useState(0);

   return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[88px_1fr]">
         {/* Миниатюры: слева на десктопе, под фото на телефоне */}
         <ul className="order-2 flex gap-3 lg:order-1 lg:flex-col">
            {slots.map((src, index) => (
               <li key={index} className="w-[72px] lg:w-full">
                  <button
                     type="button"
                     onClick={() => setActive(index)}
                      aria-label={t("Show view {index} of {total}", { index: index + 1, total: slots.length })}
                     aria-current={index === active}
                     className={cn(
                        "block aspect-[4/5] w-full overflow-hidden rounded-xl outline-offset-2 transition-opacity",
                        index === active ? "outline-[1.5px] outline-ink outline-solid" : "opacity-70 hover:opacity-100",
                     )}
                  >
                     <MediaImage
                        src={src}
                        alt={t("{name}, view {index}", { name: t(name), index: index + 1 })}
                        label={images.length ? undefined : t(PLACEHOLDER_LABELS[index])}
                        tint={tint}
                        sizes="88px"
                        className="size-full"
                     />
                  </button>
               </li>
            ))}
         </ul>

         <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-card lg:order-2">
            {slots.map((src, index) => (
               <MediaImage
                  key={index}
                  src={src}
                   alt={t("{name}, view {index}", { name: t(name), index: index + 1 })}
                   label={images.length ? undefined : t("{label} photo", { label: t(PLACEHOLDER_LABELS[index]) })}
                  tint={tint}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={cn(
                     "absolute inset-0 transition-opacity duration-500",
                     index === active ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
               />
            ))}
         </div>
      </div>
   );
}
