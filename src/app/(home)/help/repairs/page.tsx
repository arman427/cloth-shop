import type { Metadata } from "next";
import Link from "next/link";
import { HelpLayout, Prose } from "@/components/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Free repairs") };
}

export default async function RepairsPage() {
   const t = await getT();

   return (
      <HelpLayout
         title={t("Free repairs")}
         description={t("We mend every Vellum piece for as long as you own it.")}
         current="/help/repairs"
      >
         <Prose>
            <h2>{t("What we repair")}</h2>
            <ul>
               <li>{t("Loose or lost buttons, and broken zips.")}</li>
               <li>{t("Open seams, worn cuffs and torn pockets.")}</li>
               <li>{t("Holes in knitwear, which we darn by hand.")}</li>
               <li>{t("Tired linings and re-waxing for waxed cotton.")}</li>
            </ul>

            <h2>{t("How it works")}</h2>
            <ul>
               <li>
                  <Link href="/help/contact">{t("Tell us")}</Link> {t("what needs fixing and attach a photo.")}
               </li>
               <li>{t("We send a prepaid label, and you post the piece to the Porto workshop.")}</li>
               <li>{t("Our team mends it, usually within ten working days, and posts it back to you at no cost.")}</li>
            </ul>

            <h2>{t("What if it can't be fixed?")}</h2>
            <p>
               {t(
                  "Rarely, damage is beyond repair. In that case we offer a credit towards a replacement, and we recycle the old piece through a textile partner.",
               )}
            </p>
         </Prose>
      </HelpLayout>
   );
}
