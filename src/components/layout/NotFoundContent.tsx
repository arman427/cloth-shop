"use client";

import { Button, Container } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

export function NotFoundContent() {
   const t = useT();

   return (
      <Container className="py-24">
         <h1 className="font-display text-[56px] leading-none uppercase md:text-[88px] ru:text-[44px] ru:md:text-[76px]">{t("Page not found")}</h1>
         <p className="mt-5 max-w-[460px] text-[17px] text-ink-2">
            {t("That page doesn't exist, or the piece has sold out and been taken down.")}
         </p>
         <div className="mt-8 flex flex-wrap gap-3.5">
            <Button href="/new-in">{t("See what's new")}</Button>
            <Button href="/" variant="outline">
               {t("Back to the shop")}
            </Button>
         </div>
      </Container>
   );
}
