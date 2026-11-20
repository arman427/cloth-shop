import { Button, Container, MediaImage } from "@/components/ui";
import { ART } from "@/lib/art";
import { getT } from "@/lib/i18n/server";

/**
 * Два баннера-подборки. На телефоне картинка стоит под кнопкой и не наезжает на текст,
 * с md — как раньше, в правом нижнем углу карточки.
 */
export async function EditorialBanners() {
   const t = await getT();

   return (
      <section aria-label={t("Featured edits")} className="py-24">
         <Container className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
            <article className="relative flex flex-col overflow-hidden rounded-panel bg-clay p-7 sm:p-8 md:h-[560px] md:p-11">
               <h2 className="relative z-[2] font-display text-[56px] leading-[0.92] uppercase md:text-[72px] ru:text-[46px] ru:md:text-[62px]">
                  {t("The winter")}
                  <br />
                  {t("coat edit")}
               </h2>
               <p className="relative z-[2] mt-[18px] mb-7 max-w-[330px] text-[17px]">
                  {t("Six coats in boiled wool and melton, cut long enough to cover a blazer and roomy enough for a knit.")}
               </p>
               <Button href="/shop/outerwear" className="relative z-[2] self-start">
                  {t("Shop coats")}
               </Button>
               <MediaImage
                  src={ART.coatEdit}
                  alt={t("The winter coat edit")}
                  tint="transparent"
                  sizes="(min-width: 768px) 260px, 70vw"
                  className="absolute z-[1] aspect-[250/330] w-[min(100%,260px)] max-md:relative max-md:mx-auto max-md:mt-8 md:right-8 md:bottom-8 md:h-[330px] md:w-[250px]"
               />
               <p className="relative z-[2] mt-8 flex flex-wrap items-center gap-3.5 text-sm font-medium md:mt-auto md:max-w-[calc(100%-280px)]">
                  {t("First order?")}
                  <b className="rounded-lg border-[1.5px] border-dashed border-ink/20 bg-card px-3.5 py-2 text-[15px] font-bold tracking-[0.06em]">
                     VELLUM15
                  </b>
                  {t("takes 15% off.")}
               </p>
            </article>

            <article className="relative flex flex-col overflow-hidden rounded-panel bg-olive p-7 text-white sm:p-8 md:h-[560px] md:p-11">
               <h2 className="relative z-[2] font-display text-[56px] leading-[0.92] uppercase md:text-[72px] ru:text-[46px] ru:md:text-[62px]">
                  {t("Knits in")}
                  <br />
                  {t("pure merino")}
               </h2>
               <p className="relative z-[2] mt-[18px] mb-7 max-w-[300px] text-[17px] text-[#E4E6DA] md:max-w-[250px]">
                  {t("Spun in Biella, knitted in Barcelos. Machine washable on wool cycle.")}
               </p>
               <Button href="/shop/knitwear" variant="light" className="relative z-[2] self-start">
                  {t("Shop knitwear")}
               </Button>
               <MediaImage
                  src={ART.knitEdit}
                  alt={t("Knits in pure merino")}
                  tone="dark"
                  tint="transparent"
                  sizes="(min-width: 768px) 260px, 70vw"
                  className="absolute z-[1] aspect-[250/330] w-[min(100%,260px)] max-md:relative max-md:mx-auto max-md:mt-8 md:right-8 md:bottom-8 md:h-[330px] md:w-[250px]"
               />
            </article>
         </Container>
      </section>
   );
}
