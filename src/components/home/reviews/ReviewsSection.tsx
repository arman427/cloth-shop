"use client";

import { useEffect, useState } from "react";
import { Container, Icon } from "@/components/ui";
import { useCarousel } from "@/hooks";
import { useT } from "@/providers/LocaleProvider";
import type { RatingSummary as RatingSummaryData, Review } from "@/types";
import { cn } from "@/utils";
import { RatingSummary } from "./RatingSummary";

interface ReviewsSectionProps {
   summary: RatingSummaryData;
   reviews: Review[];
}

const NAV_BUTTON =
   "grid size-12 place-items-center rounded-full border-[1.5px] border-ink transition-colors";

/** Через сколько миллисекунд отзыв сменяется сам, если на блок не наведён курсор */
const AUTO_ADVANCE_MS = 7000;

export function ReviewsSection({ summary, reviews }: ReviewsSectionProps) {
   const t = useT();
   const { index, next, prev, goTo } = useCarousel(reviews.length);
   const [paused, setPaused] = useState(false);

   // Автопрокрутка. Любое действие пользователя (index меняется) перезапускает таймер.
   useEffect(() => {
      if (paused || reviews.length < 2) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const timer = window.setTimeout(next, AUTO_ADVANCE_MS);
      return () => window.clearTimeout(timer);
   }, [index, paused, next, reviews.length]);

   return (
      <section aria-labelledby="reviews-title" className="pb-24">
         <Container>
            <div className="grid grid-cols-1 items-start gap-14 border-t border-line pt-[72px] lg:grid-cols-[1fr_1.6fr] lg:gap-20">
               <h2 id="reviews-title" className="sr-only">
                  {t("Customer reviews")}
               </h2>
               <RatingSummary summary={summary} />

               <div
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
               >
                  {/*
                     Все отзывы лежат в одной ячейке сетки, поэтому высота блока равна самому длинному отзыву
                     и страница не прыгает. Активный отзыв проявляется и выезжает на место, а соседние уходят
                     влево (предыдущий) или стоят справа (следующий), так что направление движения читается.
                  */}
                  <div className="relative overflow-x-clip">
                     <div className="grid">
                        {reviews.map((review, reviewIndex) => {
                           const offset =
                              (reviewIndex - index + reviews.length) %
                              reviews.length;
                           const active = offset === 0;
                           return (
                              <figure
                                 key={review.id}
                                 aria-hidden={!active}
                                 className={cn(
                                    "col-start-1 row-start-1 transition-[opacity,translate,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                    active &&
                                       "translate-x-0 opacity-100 blur-0",
                                    !active &&
                                       "pointer-events-none opacity-0 blur-[3px]",
                                    !active &&
                                       (offset === 1
                                          ? "translate-x-10"
                                          : "-translate-x-10"),
                                 )}
                              >
                                 <blockquote className="text-[28px] leading-[1.25] font-medium tracking-[-0.015em] md:text-[40px]">
                                    “{t(review.quote)}”
                                 </blockquote>
                                 <figcaption className="mt-9 flex items-center gap-4 sm:pr-[120px]">
                                    <span
                                       aria-hidden="true"
                                       className="grid size-[52px] shrink-0 place-items-center rounded-full bg-oat font-bold"
                                    >
                                       {review.initials}
                                    </span>
                                    <span>
                                       <b className="block font-bold">
                                          {t(review.author)}
                                       </b>
                                       <span className="text-sm text-ink-3">
                                          {t(review.purchase)}
                                       </span>
                                    </span>
                                 </figcaption>
                              </figure>
                           );
                        })}
                     </div>

                     <div className="mt-6 flex items-center gap-2.5 sm:absolute sm:right-0 sm:bottom-0 sm:mt-0">
                        <button
                           type="button"
                           onClick={prev}
                           aria-label={t("Previous review")}
                           className={cn(
                              NAV_BUTTON,
                              "hover:bg-ink hover:text-white",
                           )}
                        >
                           <Icon name="chevronLeft" className="size-[18px]" />
                        </button>
                        <button
                           type="button"
                           onClick={next}
                           aria-label={t("Next review")}
                           className={cn(
                              NAV_BUTTON,
                              "hover:bg-ink hover:text-white",
                           )}
                        >
                           <Icon name="chevronRight" className="size-[18px]" />
                        </button>
                     </div>
                  </div>

                  {/* Полоски показывают, какой отзыв сейчас, и позволяют перейти к любому */}
                  <div
                     className="mt-8 flex gap-2"
                     role="group"
                     aria-label={t("Choose a review")}
                  >
                     {reviews.map((review, reviewIndex) => (
                        <button
                           key={review.id}
                           type="button"
                           onClick={() => goTo(reviewIndex)}
                           aria-label={t("Show review {current} of {total}", {
                              current: reviewIndex + 1,
                              total: reviews.length,
                           })}
                           aria-current={reviewIndex === index}
                           className="flex h-4 items-center"
                        >
                           <span
                              className={cn(
                                 "h-1 rounded-xs transition-[width,background-color] duration-500",
                                 reviewIndex === index
                                    ? "w-10 bg-ink"
                                    : "w-5 bg-ink/15 hover:bg-ink/35",
                              )}
                           />
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </Container>
      </section>
   );
}
