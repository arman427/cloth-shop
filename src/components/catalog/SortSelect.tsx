"use client";

import { Icon } from "@/components/ui";
import { SORT_OPTIONS, type SortValue } from "@/constants/shop";
import { useT } from "@/providers/LocaleProvider";
import { FILTERS_FORM_ID } from "./CatalogFilters";
import { useCatalogNav } from "./CatalogNav";

/** Живёт отдельно от списка фильтров (в панели над сеткой), но принадлежит той же форме через атрибут form. */
export function SortSelect({ value }: { value: SortValue }) {
   const t = useT();
   const { version, apply } = useCatalogNav();

   return (
      <div className="relative">
          <label htmlFor="catalog-sort" className="sr-only">
             {t("Sort by")}
          </label>
         <select
            key={version}
            id="catalog-sort"
            name="sort"
            form={FILTERS_FORM_ID}
            defaultValue={value}
            onChange={(event) => event.currentTarget.form && apply(event.currentTarget.form)}
            className="h-11 cursor-pointer appearance-none rounded-full border border-line bg-card pr-10 pl-5 text-sm font-medium outline-none hover:border-ink/40 focus:border-ink"
         >
            {SORT_OPTIONS.map((option) => (
               <option key={option.value} value={option.value}>
                   {t(option.label)}
               </option>
            ))}
         </select>
         <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-3" />
      </div>
   );
}
