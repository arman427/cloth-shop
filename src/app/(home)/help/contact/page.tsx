import type { Metadata } from "next";
import { ContactForm, HelpLayout } from "@/components/content";
import { Icon } from "@/components/ui";
import type { SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Contact us") };
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
   const { topic } = await searchParams;
   const t = await getT();

   return (
      <HelpLayout
         title={t("Contact us")}
         description={t("Write to us and we reply within one working day.")}
         current="/help/contact"
      >
         <ContactForm defaultTopic={typeof topic === "string" ? topic : undefined} />

         <ul className="mt-12 grid max-w-[620px] gap-4 border-t border-line pt-8 text-[15px] text-ink-2">
            <li className="flex items-center gap-3">
               <Icon name="mail" className="size-5" />
               hello@vellum.example
            </li>
            <li className="flex items-center gap-3">
               <Icon name="phone" className="size-5" />
               +351 22 000 0148, {t("Mon to Fri, 9:00 to 17:00 (Lisbon time)")}
            </li>
            <li className="flex items-center gap-3">
               <Icon name="pin" className="size-5" />
               Rua das Flores 148, {t("4050-262 Porto")}, {t("Portugal")}
            </li>
         </ul>
      </HelpLayout>
   );
}
