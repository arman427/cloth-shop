import Link from "next/link";
import type { ReactNode } from "react";
import { Container, PageHeader } from "@/components/ui";
import { HELP_LINKS } from "@/constants/content";
import { getT } from "@/lib/i18n/server";
import { cn } from "@/utils";

interface HelpLayoutProps {
   title: string;
   description: string;
   /** href текущей страницы: подсвечивается в меню слева */
   current: string;
   children: ReactNode;
}

export async function HelpLayout({ title, description, current, children }: HelpLayoutProps) {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={title}
            description={description}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Help"), href: "/help" }, { label: title }]}
         />
         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-20">
               <nav aria-label={t("Help")} className="lg:sticky lg:top-6 lg:self-start">
                  <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                     {HELP_LINKS.map((link) => (
                        <li key={link.href}>
                           <Link
                              href={link.href}
                              aria-current={link.href === current ? "page" : undefined}
                              className={cn(
                                 "block rounded-full px-4 py-2 text-[15px] font-medium transition-colors lg:rounded-xl",
                                 link.href === current ? "bg-ink text-white" : "text-ink-2 hover:bg-ink/5 hover:text-ink",
                              )}
                           >
                               {t(link.label)}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </nav>
               <div className="min-w-0">{children}</div>
            </div>
         </Container>
      </>
   );
}
