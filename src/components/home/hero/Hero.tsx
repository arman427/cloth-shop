"use client";

import { Button, Container, MediaImage, Stars, tintFromHex } from "@/components/ui";
import { HERO_IMAGES } from "@/constants/home";
import { useCarousel } from "@/hooks";
import { useT } from "@/providers/LocaleProvider";
import type { HeroFact, Product } from "@/types";
import { cn } from "@/utils";
import { HeroProductCard } from "./HeroProductCard";

interface HeroProps {
   products: Product[];
   facts: HeroFact[];
}

/** Метки обрезки по углам кадра: подсказка, что здесь будет фотография */
const CROP = "pointer-events-none absolute size-5 border-cobalt/60";

export function Hero({ products, facts }: HeroProps) {
   const t = useT();
   const { index, goTo } = useCarousel(Math.max(products.length, 1));
   const product = products[index];

   return (
      <section aria-labelledby="hero-title">
         <Container className="grid grid-cols-1 gap-12 pt-10 pb-[72px] md:pt-14 xl:grid-cols-[580px_1fr]">
            {/* Copy */}
            <div className="flex flex-col xl:pt-7">
               <p className="flex items-center gap-3 text-sm font-medium text-ink-2">
                  <span className="size-2 rounded-full bg-cobalt" aria-hidden="true" />
                   {t("New season, Autumn–Winter 26")}
                </p>

               <h1
                  id="hero-title"
                  className="mt-[26px] mb-[34px] font-display text-[56px] leading-[0.9] tracking-[0.005em] uppercase hyphens-manual min-[400px]:text-[64px] sm:text-[104px] xl:text-[140px] ru:text-[48px] ru:min-[400px]:text-[54px] ru:sm:text-[80px] ru:xl:text-[88px]"
               >
                   {/* Строки не запрещаем переносить: русский перевод длиннее и иначе вылезал за экран */}
                   <span className="block">{t("Cut once.")}</span>
                   <span className="block">{t("Worn for")}</span>
                   <span className="relative block w-fit max-w-full">
                      {t("years.")}
                     <svg
                        viewBox="0 0 300 24"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="absolute -bottom-3.5 -left-1.5 h-6 w-[calc(100%+20px)]"
                     >
                        <path d="M2 14 Q80 4 150 12 T298 8" fill="none" stroke="#2C44D8" strokeWidth={5} strokeLinecap="round" />
                     </svg>
                  </span>
               </h1>

               <p className="max-w-[470px] text-[19px] leading-[1.6] text-ink-2">
                   {t(
                      "Clothing for women and men, drafted on paper in our Porto studio and made in small runs from fabrics that get better with wear.",
                   )}
                </p>

                <div className="mt-9 flex flex-wrap gap-3.5">
                   <Button href="/new-in">{t("Shop new season")}</Button>
                   <Button href="/lookbook" variant="outline">
                      {t("See the lookbook")}
                   </Button>
                </div>

               <dl className="mt-12 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-3 sm:gap-0 xl:mt-auto">
                  {facts.map((fact) => (
                     <div key={fact.title} className="pr-4 text-sm leading-[1.45] text-ink-2">
                        <dt className="mb-1 text-[15px] font-semibold text-ink">
                           {t(fact.title)}
                           {fact.rating !== undefined && (
                              <>
                                 {" "}
                                 <Stars rating={fact.rating} className="text-[13px]" />
                              </>
                           )}
                        </dt>
                        <dd>{t(fact.text)}</dd>
                     </div>
                  ))}
               </dl>
            </div>

            {/* Photo frame */}
            <div className="relative xl:h-[760px]">
               <div className="relative aspect-[684/760] overflow-hidden rounded-panel bg-panel bg-blueprint xl:absolute xl:inset-0 xl:aspect-auto">
                  {/* Все слайды лежат друг на друге; активный плавно проявляется, остальные гаснут */}
                  {products.map((item, itemIndex) => (
                     <MediaImage
                        key={item.id}
                        src={HERO_IMAGES[item.slug] ?? item.images[0]}
                        alt={t(item.name)}
                        label={t("Hero photo")}
                        tint={tintFromHex(item.colorHex, 18)}
                        priority={itemIndex === 0}
                        sizes="(min-width: 1280px) 684px, 100vw"
                        className={cn(
                           "absolute inset-8 rounded-card transition-[opacity,scale] duration-700 ease-out",
                           itemIndex === index ? "scale-100 opacity-100" : "pointer-events-none scale-[1.02] opacity-0",
                        )}
                     />
                  ))}

                  <span aria-hidden="true" className={cn(CROP, "top-5 left-5 border-t-[1.5px] border-l-[1.5px]")} />
                  <span aria-hidden="true" className={cn(CROP, "top-5 right-5 border-t-[1.5px] border-r-[1.5px]")} />
                  <span aria-hidden="true" className={cn(CROP, "bottom-5 left-5 border-b-[1.5px] border-l-[1.5px]")} />
                  <span aria-hidden="true" className={cn(CROP, "right-5 bottom-5 border-r-[1.5px] border-b-[1.5px]")} />

                  {product && (
                     <p className="absolute top-7 left-12 z-[1] rounded-full bg-card/90 px-3 py-1 text-[13px] leading-normal font-semibold text-cobalt">
                         {t(product.category.name)}
                      </p>
                  )}

                  {products.length > 1 && (
                     <div className="absolute top-[26px] right-12 z-[1] flex gap-2" role="tablist" aria-label={t("Featured pieces")}>
                        {products.map((item, itemIndex) => (
                           <button
                              key={item.id}
                              type="button"
                              role="tab"
                              aria-selected={itemIndex === index}
                              aria-label={t(item.name)}
                              onClick={() => goTo(itemIndex)}
                              className="flex h-4 items-center"
                           >
                              <span
                                 className={cn(
                                    "h-1 w-7 rounded-xs transition-colors",
                                    itemIndex === index ? "bg-ink" : "bg-ink/15 hover:bg-ink/35",
                                 )}
                              />
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {product && (
                  <HeroProductCard key={product.id} product={product} className="mt-4 xl:absolute xl:inset-x-7 xl:bottom-7 xl:mt-0" />
               )}
            </div>
         </Container>
      </section>
   );
}
