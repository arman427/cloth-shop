"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import { ANNOUNCEMENT, UTILITY_NAV } from "@/constants/navigation";
import { useT } from "@/providers/LocaleProvider";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function AnnouncementBar() {
   const t = useT();

   return (
      <div className="bg-ink text-[13px] text-[#E6E8EE]">
         <Container className="flex h-10 items-center justify-between gap-6">
            <span className="truncate">{t(ANNOUNCEMENT.shipping)}</span>
            <span className="hidden truncate xl:inline">
               <b className="font-semibold text-white">{t(ANNOUNCEMENT.season)}</b> {t(ANNOUNCEMENT.seasonNote)}
            </span>
            <span className="hidden shrink-0 items-center gap-6 whitespace-nowrap text-[#B9BEC8] sm:flex">
               {UTILITY_NAV.map((link) => (
                  <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
                     {t(link.label)}
                  </Link>
               ))}
               <LocaleSwitcher onDark />
            </span>
         </Container>
      </div>
   );
}
