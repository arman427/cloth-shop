"use client";

import { Button, Container } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
   const t = useT();

   return (
      <Container className="py-24">
         <h1 className="font-display text-[56px] leading-none uppercase md:text-[88px] ru:text-[44px] ru:md:text-[76px]">{t("Something went wrong")}</h1>
         <p className="mt-5 max-w-[460px] text-[17px] text-ink-2">
            {t("The page didn't load. Try again, and if it keeps happening, come back in a few minutes.")}
         </p>
         <div className="mt-8 flex flex-wrap gap-3.5">
            <Button onClick={reset}>{t("Try again")}</Button>
            <Button href="/" variant="outline">
               {t("Back to the shop")}
            </Button>
         </div>
      </Container>
   );
}
