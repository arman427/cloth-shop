"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

export interface Crumb {
   label: string;
   href?: string;
}

export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
   const t = useT();

   return (
      <nav aria-label={t("Breadcrumb")} className={className}>
         <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
            {crumbs.map((crumb, index) => (
               <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 && <Icon name="chevronRight" className="size-3" />}
                  {crumb.href ? (
                     <Link href={crumb.href} className={cn("transition-colors hover:text-cobalt")}>
                        {t(crumb.label)}
                     </Link>
                  ) : (
                     <span aria-current="page" className="text-ink-2">
                        {t(crumb.label)}
                     </span>
                  )}
               </li>
            ))}
         </ol>
      </nav>
   );
}
