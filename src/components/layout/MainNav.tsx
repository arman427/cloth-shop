"use client";

import Link from "next/link";
import { useT } from "@/providers/LocaleProvider";
import type { NavLink } from "@/types";
import { cn } from "@/utils";

interface MainNavProps {
   links: NavLink[];
   className?: string;
}

export function MainNav({ links, className }: MainNavProps) {
   const t = useT();

   return (
      <nav aria-label={t("Main")} className={className}>
         <ul className="flex gap-5 text-[14px] font-medium whitespace-nowrap xl:gap-8 xl:text-[15px] ru:xl:gap-6">
            {links.map((link) => (
               <li key={link.href}>
                  <Link
                     href={link.href}
                     className={cn(
                        "relative pb-px duration-500 hover:text-cobalt after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-cobalt after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left",
                     )}
                  >
                     {t(link.label)}
                  </Link>
               </li>
            ))}
         </ul>
      </nav>
   );
}
