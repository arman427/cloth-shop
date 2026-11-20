import type { Metadata } from "next";
import Link from "next/link";
import { Container, Icon, PageHeader, type IconName } from "@/components/ui";
import { HELP_LINKS } from "@/constants/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Help") };
}

const ICONS: IconName[] = ["truck", "returns", "ruler", "scissors", "mail"];

export default async function HelpPage() {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={t("Help")}
            description={t("Answers about delivery, returns, sizing and repairs. Can't find yours? Write to us.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Help") }]}
         />
         <Container className="pb-24">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {HELP_LINKS.map((link, index) => (
                  <li key={link.href}>
                     <Link
                        href={link.href}
                        className="group flex h-full flex-col gap-4 rounded-card bg-card p-7 transition-shadow hover:shadow-float"
                     >
                        <Icon name={ICONS[index]} className="size-7" />
                        <span>
                           <span className="block text-xl font-semibold">{t(link.label)}</span>
                           <span className="mt-1 block text-[15px] text-ink-2">{t(link.description)}</span>
                        </span>
                        <Icon name="arrowRight" className="mt-auto size-5 transition-transform group-hover:translate-x-1" />
                     </Link>
                  </li>
               ))}
            </ul>
         </Container>
      </>
   );
}
