import { Button, Container } from "@/components/ui";
import { getT } from "@/lib/i18n/server";
import type { ProcessStep } from "@/types";
import { PatternPieces } from "./PatternPieces";

interface ProcessSectionProps {
   steps: ProcessStep[];
}

export async function ProcessSection({ steps }: ProcessSectionProps) {
   const t = await getT();

   return (
      <section aria-labelledby="process-title">
         <Container>
            <div className="grid grid-cols-1 gap-16 overflow-hidden rounded-block bg-ink px-6 py-14 text-white md:px-12 md:py-20 xl:grid-cols-[1fr_640px] xl:px-[72px] xl:py-[88px]">
               <div>
                  <h2 id="process-title" className="font-display text-[52px] leading-[0.95] uppercase md:text-[84px] ru:text-[40px] ru:md:text-[68px]">
                     {t("Every piece starts as a paper pattern")}
                  </h2>
                  <p className="mt-6 mb-12 max-w-[470px] text-lg text-mute-1">
                     {t(
                        "We draft each pattern by hand, cut it in small batches and finish it in the same Porto workshop. It takes longer. It also lasts longer.",
                     )}
                  </p>

                  <ol className="border-t border-line-inverse">
                     {steps.map((step, index) => (
                        <li key={step.title} className="grid grid-cols-[64px_1fr] border-b border-line-inverse py-6">
                           <span aria-hidden="true" className="font-display text-[28px] leading-[1.1] text-cobalt-soft">
                              {index + 1}
                           </span>
                           <div>
                              <h3 className="mb-1.5 text-[19px] font-semibold">{t(step.title)}</h3>
                              <p className="max-w-[440px] text-[15px] text-mute-2">{t(step.text)}</p>
                           </div>
                        </li>
                     ))}
                  </ol>

                  <Button href="/workshop" variant="light" className="mt-10">
                     {t("Visit the workshop")}
                  </Button>
               </div>

               <div className="relative aspect-square self-center overflow-hidden rounded-[18px] bg-panel-dark bg-blueprint-dark xl:aspect-auto xl:h-[640px]">
                  {/* Векторное лекало Harbour Coat: подписи переводятся вместе с сайтом */}
                  <div className="absolute inset-0 p-4 sm:p-8">
                     <PatternPieces />
                  </div>
               </div>
            </div>
         </Container>
      </section>
   );
}
