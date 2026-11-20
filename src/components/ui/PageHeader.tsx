"use client";

import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

interface PageHeaderProps {
   title: string;
   description?: string;
   crumbs?: Crumb[];
   /** Правый слот: кнопка или ссылка */
   action?: ReactNode;
   className?: string;
}

/** Заголовок страницы: хлебные крошки, крупный Anton и описание. Один вид на все страницы. */
export function PageHeader({ title, description, crumbs, action, className }: PageHeaderProps) {
   const t = useT();

   return (
      <Container className={cn("pt-10 pb-10 md:pt-14", className)}>
         {crumbs && crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} className="mb-6" />}
         <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div>
               <h1 className="font-display text-[56px] leading-[0.95] uppercase md:text-[88px] ru:text-[44px] ru:md:text-[76px]">{t(title)}</h1>
               {description && <p className="mt-4 max-w-[560px] text-[17px] text-ink-2">{t(description)}</p>}
            </div>
            {action}
         </div>
      </Container>
   );
}
