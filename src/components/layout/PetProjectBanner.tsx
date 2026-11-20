"use client";

import { Container } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

/** Клиентский компонент: переводится через контекст и не читает cookie на сервере, поэтому шапка остаётся статичной. */
export function PetProjectBanner() {
   const t = useT();

   return (
      <div role="note" className="bg-cobalt text-white">
         <Container className="py-2 text-center text-[13px] leading-snug font-medium">
            <b className="font-bold">{t("VELLUM is a pet project.")}</b>{" "}
            {t("The products, prices and orders are not real: nothing here can be bought or shipped.")}
         </Container>
      </div>
   );
}
