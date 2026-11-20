import type { Metadata } from "next";
import { Button, Container, Icon, MediaImage, PageHeader } from "@/components/ui";
import { GIFT_CARD_AMOUNTS } from "@/constants/content";
import { ART } from "@/lib/art";
import { getLocale, getT } from "@/lib/i18n/server";
import { formatPrice } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Gift cards") };
}

const STEPS = [
   "Tell us the amount and who it is for.",
   "We email you a digital card within one working day.",
   "The recipient quotes the code when they order, and we apply the balance.",
];

export default async function GiftCardsPage() {
   const [t, locale] = await Promise.all([getT(), getLocale()]);

   return (
      <>
         <PageHeader
            title={t("Gift cards")}
            description={t("For when you aren't sure of the size. Cards never expire and work on every piece.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Gift cards") }]}
         />
         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
               <MediaImage src={ART.giftCard} alt={t("A Vellum gift card")} label={t("Gift card photo")} tint="#d9d0bc" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] rounded-panel" />

               <div>
                  <h2 className="font-display text-[32px] uppercase">{t("Choose an amount")}</h2>
                  <ul className="mt-5 flex flex-wrap gap-3">
                     {GIFT_CARD_AMOUNTS.map((amount) => (
                        <li key={amount} className="rounded-full border-[1.5px] border-ink px-6 py-3 text-lg font-semibold">
                           {formatPrice(amount, "USD", locale)}
                        </li>
                     ))}
                     <li className="rounded-full border-[1.5px] border-line px-6 py-3 text-lg text-ink-2">{t("Any amount")}</li>
                  </ul>

                  <ul className="mt-10 grid gap-4">
                     {STEPS.map((step) => (
                        <li key={step} className="flex gap-3 text-[16px] text-ink-2">
                           <Icon name="check" className="mt-1 size-5 text-cobalt" />
                           {t(step)}
                        </li>
                     ))}
                  </ul>

                  <Button href="/help/contact?topic=gift-card" className="mt-10">
                     {t("Request a gift card")}
                  </Button>
               </div>
            </div>
         </Container>
      </>
   );
}
