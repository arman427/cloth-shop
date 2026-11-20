import type { Metadata } from "next";
import { Button, Container, MediaImage, PageHeader } from "@/components/ui";
import { PROCESS_STEPS } from "@/constants/home";
import { WORKSHOP_FIGURES } from "@/constants/content";
import { ART } from "@/lib/art";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("The workshop") };
}

export default async function WorkshopPage() {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={t("The workshop")}
            description={t("Everything we sell is drafted, cut and finished under one roof in Porto.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("The workshop") }]}
         />

         <Container className="pb-20">
            <MediaImage
               src={ART.workshop}
               alt={t("The Vellum workshop in Porto")}
               label={t("Workshop photo")}
               tint="#d9d0bc"
               priority
               sizes="(min-width: 1376px) 1312px, 100vw"
               className="aspect-[16/8] rounded-panel"
            />
            <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
               {WORKSHOP_FIGURES.map((figure) => (
                  <div key={figure.label} className="border-t border-line pt-5">
                     <dt className="font-display text-[64px] leading-none">{figure.value}</dt>
                     <dd className="mt-2 text-ink-2">{t(figure.label)}</dd>
                  </div>
               ))}
            </dl>
         </Container>

         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
               <h2 className="font-display text-[44px] leading-[0.98] uppercase md:text-[64px] ru:text-[38px] ru:md:text-[56px]">
                  {t("Every piece starts as a paper pattern")}
               </h2>
               <ol className="border-t border-line">
                  {PROCESS_STEPS.map((step, index) => (
                     <li key={step.title} className="grid grid-cols-[64px_1fr] border-b border-line py-7">
                        <span aria-hidden="true" className="font-display text-[28px] leading-[1.1] text-cobalt">
                           {index + 1}
                        </span>
                        <div>
                           <h3 className="mb-1.5 text-xl font-semibold">{t(step.title)}</h3>
                           <p className="max-w-[460px] text-[16px] text-ink-2">{t(step.text)}</p>
                        </div>
                     </li>
                  ))}
               </ol>
            </div>
         </Container>

         <Container className="pb-24">
            <div className="flex flex-col items-start gap-6 rounded-block bg-ink p-8 text-white md:flex-row md:items-center md:justify-between md:p-14">
               <div>
                  <h2 className="font-display text-[40px] leading-none uppercase md:text-[56px]">
                     {t("Visit us in Porto")}
                  </h2>
                  <p className="mt-3 max-w-[460px] text-mute-1">
                     {t("Our store sits next to the cutting room. Come and see where your clothes are made.")}
                  </p>
               </div>
               <Button href="/stores" variant="light">
                  {t("Find a store")}
               </Button>
            </div>
         </Container>
      </>
   );
}
