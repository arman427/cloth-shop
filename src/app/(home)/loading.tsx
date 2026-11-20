"use client";

import { Container } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

/** Показывается, пока страница ждёт базу или cookie. Один скелет на все страницы магазина. */
export default function Loading() {
   const t = useT();
   return (
      <Container className="py-14" aria-busy="true">
         <p className="sr-only">{t("Loading…")}</p>
         <div className="h-16 w-2/3 max-w-[520px] animate-pulse rounded-xl bg-paper-2 md:h-24" />
         <div className="mt-4 h-5 w-1/2 max-w-[360px] animate-pulse rounded-full bg-paper-2" />
         <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
               <div key={index}>
                  <div className="h-[410px] animate-pulse rounded-card bg-paper-2" />
                  <div className="mt-[18px] h-5 w-2/3 animate-pulse rounded-full bg-paper-2" />
                  <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-paper-2" />
               </div>
            ))}
         </div>
      </Container>
   );
}
