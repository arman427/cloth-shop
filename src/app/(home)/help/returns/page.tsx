import type { Metadata } from "next";
import Link from "next/link";
import { HelpLayout, Prose } from "@/components/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Returns") };
}

export default async function ReturnsPage() {
   const t = await getT();

   return (
      <HelpLayout
         title={t("Returns")}
         description={t("Changed your mind or got the size wrong? Send it back within 30 days, for free.")}
         current="/help/returns"
      >
         <Prose>
            <h2>{t("How to return")}</h2>
            <ul>
               <li>{t("Return pieces within 30 days of delivery, unworn and with the tags attached.")}</li>
               <li>
                  <Link href="/help/contact">{t("Write to us")}</Link> {t("with your order number, and we send you a prepaid label.")}
               </li>
               <li>{t("Pack the pieces in the original bag or any sturdy box, attach the label and drop it at a courier point.")}</li>
            </ul>

            <h2>{t("Refunds")}</h2>
            <p>
               {t(
                  "We refund the price of the pieces to the original payment method within five working days of receiving the parcel. If you paid on delivery, we send the refund by bank transfer.",
               )}
            </p>

            <h2>{t("Exchanges")}</h2>
            <p>
               {t(
                  "Need a different size? Tell us which one, and we send it as soon as the returned piece arrives, or earlier if you ask us to hold a size for you.",
               )}
            </p>

            <h2>{t("What we can't take back")}</h2>
            <p>
               {t(
                  "Gift cards, and pieces that have been worn, washed or altered. If something has gone wrong with the piece itself, tell us and we will repair or replace it.",
               )}
            </p>
         </Prose>
      </HelpLayout>
   );
}
