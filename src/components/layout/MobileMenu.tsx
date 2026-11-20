"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { NavLink } from "@/types";
import { useT } from "@/providers/LocaleProvider";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface MobileMenuProps {
   links: NavLink[];
   secondaryLinks: NavLink[];
}

/** Боковое меню для экранов меньше lg. Строится на том же Dialog, что и окно входа. */
export function MobileMenu({ links, secondaryLinks }: MobileMenuProps) {
   const t = useT();
   const [open, setOpen] = useState(false);
   const close = () => setOpen(false);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <button
               type="button"
               aria-label={t("Open menu")}
               className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-ink/5 lg:hidden ru:lg:grid ru:xl:hidden"
            >
               <Icon name="menu" />
            </button>
         </DialogTrigger>

         <DialogContent placement="left">
            <DialogTitle>{t("Menu")}</DialogTitle>
            <DialogDescription className="sr-only">{t("Browse the shop")}</DialogDescription>

            <form role="search" action="/search" className="mt-6 flex h-11 items-center gap-2.5 rounded-full border border-line bg-paper px-[18px] text-ink-3">
               <Icon name="search" className="size-[18px]" />
               <label htmlFor="mobile-search" className="sr-only">
                  {t("Search the shop")}
               </label>
               <input
                  id="mobile-search"
                  name="q"
                  type="search"
                  placeholder={t("Search the shop")}
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
               />
            </form>

            <nav aria-label={t("Mobile")} className="mt-6">
               <ul className="flex flex-col">
                  {links.map((link) => (
                     <li key={link.href} className="border-b border-line">
                        <Link href={link.href} onClick={close} className="flex items-center justify-between py-4 text-lg font-semibold">
                           {t(link.label)}
                           <Icon name="chevronRight" className="size-4 text-ink-3" />
                        </Link>
                     </li>
                  ))}
               </ul>
               <ul className="mt-5 flex flex-col gap-3 text-[15px] text-ink-2">
                  {secondaryLinks.map((link) => (
                     <li key={link.href}>
                        <Link href={link.href} onClick={close} className="hover:text-cobalt">
                           {t(link.label)}
                        </Link>
                     </li>
                  ))}
               </ul>
            </nav>

            <LocaleSwitcher className="mt-6 w-fit" />
         </DialogContent>
      </Dialog>
   );
}
