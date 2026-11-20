import type { Metadata } from "next";
import Link from "next/link";
import { HelpLayout, Prose } from "@/components/content";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/constants/shop";
import { getLocale, getT } from "@/lib/i18n/server";
import { formatPrice } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Shipping") };
}

export default async function ShippingPage() {
   const [t, locale] = await Promise.all([getT(), getLocale()]);

   return (
      <HelpLayout
         title={t("Shipping")}
         description={t("How long delivery takes, what it costs and how to follow your parcel.")}
         current="/help/shipping"
      >
         <Prose>
            <h2>{t("Delivery costs")}</h2>
            <p>
               {t("Orders over {amount} ship free. Below that, standard delivery costs {fee}. The exact amount is shown in your bag before you check out.", {
                  amount: formatPrice(FREE_SHIPPING_THRESHOLD, "USD", locale),
                  fee: formatPrice(SHIPPING_FEE, "USD", locale),
               })}
            </p>

            <h2>{t("How long it takes")}</h2>
            <ul>
               <li>{t("Portugal and Spain: 2 to 3 working days.")}</li>
               <li>{t("Rest of Europe and the United Kingdom: 3 to 5 working days.")}</li>
               <li>{t("United States, Canada and elsewhere: 5 to 8 working days.")}</li>
            </ul>
            <p>
               {t(
                  "Orders placed before 14:00 on a working day leave our Porto workshop the same day when the pieces are in stock.",
               )}
            </p>

            <h2>{t("Tracking")}</h2>
            <p>
               {t(
                  "When your parcel ships we email you a tracking link. You can also see the status of every order on your",
               )}{" "}
               <Link href="/orders">{t("orders page")}</Link> {t("when you are signed in.")}
            </p>

            <h2>{t("Customs and duties")}</h2>
            <p>
               {t(
                  "Deliveries inside the European Union have no extra charges. For other countries, the courier may ask you to pay import duties on delivery.",
               )}
            </p>
         </Prose>
      </HelpLayout>
   );
}
