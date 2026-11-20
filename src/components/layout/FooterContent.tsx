"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import {
   FOOTER_COLUMNS,
   PAYMENT_METHODS,
   SOCIAL_LINKS,
} from "@/constants/navigation";
import { useT } from "@/providers/LocaleProvider";
import { NewsletterForm } from "./NewsletterForm";

/** Клиентская часть подвала: переводится через контекст и не читает cookie на сервере, поэтому оболочка страницы остаётся статичной. Год приходит с сервера (см. Footer.tsx). */
export function FooterContent({ year }: { year: number }) {
   const t = useT();

   return (
      <footer className="overflow-hidden bg-ink pt-20 text-white">
         <Container>
            <div className="grid grid-cols-1 gap-12 border-b border-line-inverse pb-16 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
               <div className="md:col-span-3 lg:col-span-1">
                  <h2 className="font-display text-[40px] leading-none uppercase">
                     {t("Get new pieces first")}
                  </h2>
                  <p className="mt-3.5 mb-[22px] max-w-[380px] text-mute-2">
                     {t("One email when a new run drops. Nothing else.")}
                  </p>
                  <NewsletterForm />
               </div>

               {FOOTER_COLUMNS.map((column) => (
                  <nav key={column.title} aria-label={t(column.title)}>
                     <h3 className="mb-[18px] text-[15px] font-semibold">
                        {t(column.title)}
                     </h3>
                     <ul className="grid gap-2.5 text-[15px] text-mute-2">
                        {column.links.map((link) => (
                           <li key={link.href}>
                              <Link
                                 href={link.href}
                                 className="duration-500 pb-px relative hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-white after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                              >
                                 {t(link.label)}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </nav>
               ))}
            </div>

            <div className="flex flex-col gap-4 py-6 text-sm text-mute-3 md:flex-row md:items-center md:justify-between">
               <span>{t("© {year} Vellum Atelier, Porto", { year })}</span>
               <ul
                  className="flex flex-wrap gap-2"
                  aria-label={t("Payment methods")}
               >
                  {PAYMENT_METHODS.map((method) => (
                     <li
                        key={method}
                        className="rounded-md border border-white/18 px-2.5 py-1 text-xs font-semibold text-[#C5CAD3]"
                     >
                        {method}
                     </li>
                  ))}
               </ul>
               <ul className="flex gap-3">
                  {SOCIAL_LINKS.map((link) => (
                     <li key={link.href}>
                        <a
                           href={link.href}
                           target="_blank"
                           rel="noreferrer"
                           className="transition-colors hover:text-white"
                        >
                           {link.label}
                        </a>
                     </li>
                  ))}
               </ul>
            </div>

            <p
               aria-hidden="true"
               className="text-outline mt-10 text-center font-brand text-[27vw] leading-[0.78] tracking-[0.06em] whitespace-nowrap min-[1440px]:text-[390px]"
            >
               VELLUM
            </p>
         </Container>
      </footer>
   );
}
