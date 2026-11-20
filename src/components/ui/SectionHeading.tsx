"use client";

import type { ReactNode } from "react";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

interface SectionHeadingProps {
   title: string;
   description?: string;
   /** Right-hand slot: links, tabs */
   action?: ReactNode;
   id?: string;
   className?: string;
}

export function SectionHeading({ title, description, action, id, className }: SectionHeadingProps) {
   const t = useT();

   return (
      <div className={cn("mb-10 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between", className)}>
         <div>
            <h2 id={id} className="font-display text-[44px] leading-none uppercase md:text-[64px] ru:text-[38px] ru:md:text-[56px]">
               {t(title)}
            </h2>
            {description && <p className="mt-3.5 max-w-[420px] text-[17px] text-ink-2">{t(description)}</p>}
         </div>
         {action}
      </div>
   );
}
