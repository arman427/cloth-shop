"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { FILTER_SIZES, PRICE_BUCKETS, SIZE_LABEL } from "@/constants/shop";
import type { CatalogSelection } from "@/lib/catalogParams";
import { useT } from "@/providers/LocaleProvider";
import type { Category } from "@/types";
import { cn } from "@/utils";
import { useCatalogNav } from "./CatalogNav";

export const FILTERS_FORM_ID = "catalog-filters";

interface CatalogFiltersProps {
   /** Адрес страницы, на которую отправляется форма: /women, /shop/knitwear и так далее */
   action: string;
   categories: Category[];
   colors: { name: string; hex: string }[];
   selection: CatalogSelection;
   /** На странице категории сам фильтр по категориям не нужен */
   showCategories: boolean;
   activeCount: number;
}

const GROUP_TITLE = "mb-3 text-[15px] font-semibold";
const CHECK_LABEL = "flex cursor-pointer items-center gap-3 text-[15px] text-ink-2 hover:text-ink";
const BOX =
   "grid size-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-ink/40 text-white transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt";

/**
 * Фильтры это обычная форма с методом GET. Выбранные значения попадают в адрес (?size=M&color=Rust),
 * сервер читает адрес и достаёт из базы нужные товары. С JavaScript форму отправляет CatalogNav
 * без перезагрузки страницы (см. CatalogNav.tsx). Без JavaScript работает кнопка "Apply".
 */
export function CatalogFilters({ action, categories, colors, selection, showCategories, activeCount }: CatalogFiltersProps) {
   const t = useT();
   const [open, setOpen] = useState(false);
   const { version, apply, clear } = useCatalogNav();

   return (
      <aside className="lg:sticky lg:top-6 lg:self-start">
         <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={FILTERS_FORM_ID}
            className="flex h-12 w-full items-center justify-between rounded-full border-[1.5px] border-ink px-6 text-[15px] font-semibold lg:hidden"
         >
            {t("Filters")}
            {activeCount > 0 ? ` (${activeCount})` : ""}
            <Icon name="chevronDown" className={cn("size-4 transition-transform", open && "rotate-180")} />
         </button>

         <form
            key={version}
            id={FILTERS_FORM_ID}
            action={action}
            method="get"
            onChange={(event) => apply(event.currentTarget)}
            onSubmit={(event) => {
               event.preventDefault();
               apply(event.currentTarget);
            }}
            className={cn("mt-5 flex-col gap-8 lg:mt-0 lg:flex", open ? "flex" : "hidden")}
         >
            {selection.q && <input type="hidden" name="q" value={selection.q} />}

            {showCategories && (
               <fieldset>
                  <legend className={GROUP_TITLE}>{t("Category")}</legend>
                  <div className="flex flex-col gap-2.5">
                     {categories.map((category) => (
                        <label key={category.slug} className={CHECK_LABEL}>
                           <input
                              type="checkbox"
                              name="category"
                              value={category.slug}
                              defaultChecked={selection.categories.includes(category.slug)}
                              className="peer sr-only"
                           />
                           <span aria-hidden="true" className={BOX}>
                              <Icon name="check" className="size-3 opacity-0 peer-checked:opacity-100" strokeWidth={2.6} />
                           </span>
                           {t(category.name)}
                        </label>
                     ))}
                  </div>
               </fieldset>
            )}

            <fieldset>
               <legend className={GROUP_TITLE}>{t("Size")}</legend>
               <div className="flex flex-wrap gap-2">
                  {FILTER_SIZES.map((size) => (
                     <label key={size} className="cursor-pointer">
                        <input
                           type="checkbox"
                           name="size"
                           value={size}
                           defaultChecked={selection.sizes.includes(size)}
                           className="peer sr-only"
                        />
                        <span className="grid h-10 min-w-12 place-items-center rounded-full border-[1.5px] border-line px-3 text-sm font-semibold transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt hover:border-ink/40">
                           {t(SIZE_LABEL[size])}
                        </span>
                     </label>
                  ))}
               </div>
            </fieldset>

            <fieldset>
               <legend className={GROUP_TITLE}>{t("Colour")}</legend>
               <div className="flex flex-wrap gap-2.5">
                  {colors.map((color) => (
                      <label key={color.name} title={t(color.name)} className="cursor-pointer">
                        <input
                           type="checkbox"
                           name="color"
                           value={color.name}
                           defaultChecked={selection.colors.includes(color.name)}
                           className="peer sr-only"
                        />
                        <span className="sr-only">{t(color.name)}</span>
                        <span
                           aria-hidden="true"
                           style={{ backgroundColor: color.hex }}
                           className="block size-7 rounded-full shadow-swatch outline-offset-3 transition-[outline-color] peer-checked:outline-[1.5px] peer-checked:outline-ink peer-checked:outline-solid peer-focus-visible:outline-2 peer-focus-visible:outline-cobalt peer-focus-visible:outline-solid hover:outline-[1.5px] hover:outline-ink/30 hover:outline-solid"
                        />
                     </label>
                  ))}
               </div>
            </fieldset>

            <fieldset>
               <legend className={GROUP_TITLE}>{t("Price")}</legend>
               <div className="flex flex-col gap-2.5">
                  {PRICE_BUCKETS.map((bucket) => (
                     <label key={bucket.value} className={CHECK_LABEL}>
                        <input
                           type="radio"
                           name="price"
                           value={bucket.value}
                           defaultChecked={selection.price === bucket.value}
                           className="peer sr-only"
                        />
                        <span
                           aria-hidden="true"
                           className="grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] border-ink/40 transition-colors after:size-2 after:rounded-full after:bg-ink after:opacity-0 peer-checked:border-ink peer-checked:after:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt"
                        />
                        {t(bucket.label)}
                     </label>
                  ))}
               </div>
            </fieldset>

            <div className="flex items-center gap-5">
               {/* Без JavaScript форма отправляется этой кнопкой; с JavaScript она не нужна, но не мешает */}
               <button type="submit" className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-ink/85 lg:hidden">
                   {t("Apply")}
                </button>
               {activeCount > 0 && (
                  <button
                     type="button"
                     onClick={() => clear(selection.q)}
                     className="text-sm font-semibold underline underline-offset-4 hover:text-cobalt"
                  >
                     {t("Clear all")}
                  </button>
               )}
            </div>
         </form>
      </aside>
   );
}
