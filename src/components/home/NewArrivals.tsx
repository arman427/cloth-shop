"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Container, SectionHeading, Tabs, TextLink, type TabItem } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";
import type { Product } from "@/types";

type Filter = "all" | "women" | "men";

const FILTERS: TabItem<Filter>[] = [
   { value: "all", label: "All" },
   { value: "women", label: "Women" },
   { value: "men", label: "Men" },
];

const PER_PAGE = 4;

interface NewArrivalsProps {
   products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
   const t = useT();
   const [filter, setFilter] = useState<Filter>("all");

   const visible = useMemo(
      () =>
         products
            .filter((product) => filter === "all" || product.gender === filter.toUpperCase() || product.gender === "UNISEX")
            .slice(0, PER_PAGE),
      [products, filter],
   );

   return (
      <section aria-labelledby="new-title" className="pb-24">
         <Container>
            <SectionHeading
               id="new-title"
               title={t("New this week")}
               description={t("Fresh from the workshop, each piece made in a small run.")}
               action={
                  <div className="flex w-full flex-wrap items-center justify-between gap-x-7 gap-y-4 md:w-auto md:justify-start">
                     <Tabs items={FILTERS} value={filter} onChange={setFilter} label={t("Filter new arrivals")} />
                     <TextLink href="/new-in">{t("View all")}</TextLink>
                  </div>
               }
            />
            <div role="tabpanel" aria-label={t(FILTERS.find((item) => item.value === filter)?.label ?? "All")}>
               <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {visible.map((product) => (
                     <li key={product.id}>
                        <ProductCard product={product} />
                     </li>
                  ))}
               </ul>
            </div>
         </Container>
      </section>
   );
}
