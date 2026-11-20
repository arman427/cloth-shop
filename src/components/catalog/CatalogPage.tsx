import Link from "next/link";
import { Container, PageHeader, type Crumb } from "@/components/ui";
import { ProductGrid } from "@/components/product";
import { getCatalog, getCatalogFacets, type CatalogQuery } from "@/lib/catalog";
import { countActiveFilters, parseCatalogParams, selectionToSearch, type SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogNavProvider, CatalogResults } from "./CatalogNav";
import { SortSelect } from "./SortSelect";

interface CatalogPageProps {
   title: string;
   description?: string;
   crumbs?: Crumb[];
   /** Путь страницы: сюда отправляется форма фильтров */
   basePath: string;
   searchParams: Promise<SearchParams>;
   /** Условия, которые задаёт сама страница: /women всегда показывает женское, и фильтры это не меняют */
   fixed?: Pick<CatalogQuery, "categories" | "excludeCategories" | "gender" | "limit">;
   /** Скрыть фильтр "Category" (страница категории или Bags) */
   hideCategoryFilter?: boolean;
   emptyHint?: string;
}

/** Общая страница каталога для /shop, /women, /men, /bags, /new-in и /shop/[category]. */
export async function CatalogPage({
   title,
   description,
   crumbs,
   basePath,
   searchParams,
   fixed,
   hideCategoryFilter = false,
   emptyHint = "Try removing a filter or two.",
}: CatalogPageProps) {
   const t = await getT();
   const selection = parseCatalogParams(await searchParams);
   const activeCount = countActiveFilters(selection);

   const [{ products, total }, facets] = await Promise.all([
      getCatalog({
         ...fixed,
         // фильтр по категории из адреса работает вместе с тем, что задала страница
         categories: fixed?.categories ?? (selection.categories.length ? selection.categories : undefined),
         sizes: selection.sizes,
         colors: selection.colors,
         price: selection.price,
         sort: selection.sort,
         search: selection.q || undefined,
      }),
      getCatalogFacets(),
   ]);

   return (
      <>
         <PageHeader
            title={t(title)}
            description={description ? t(description) : undefined}
            crumbs={crumbs?.map((crumb) => ({ ...crumb, label: t(crumb.label) }))}
         />

         <Container className="pb-24">
            <CatalogNavProvider basePath={basePath} selectionKey={selectionToSearch(selection)}>
               <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
                  <CatalogFilters
                     action={basePath}
                     categories={facets.categories.filter((category) => !fixed?.excludeCategories?.includes(category.slug))}
                     colors={facets.colors}
                     selection={selection}
                     showCategories={!hideCategoryFilter}
                     activeCount={activeCount}
                  />

                  <div>
                     <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-5">
                        <p className="text-[15px] text-ink-2" aria-live="polite">
                           {total === 1 ? t("{count} piece", { count: total }) : t("{count} pieces", { count: total })}
                        </p>
                        <SortSelect value={selection.sort} />
                     </div>

                     <CatalogResults>
                        {products.length > 0 ? (
                           <ProductGrid products={products} className="lg:grid-cols-3" />
                        ) : (
                           <div className="rounded-panel bg-card px-6 py-16 text-center">
                              <p className="text-xl font-semibold">{t("Nothing matches these filters")}</p>
                              <p className="mt-2 text-ink-2">{t(emptyHint)}</p>
                              <Link
                                 href={basePath}
                                 scroll={false}
                                 className="mt-6 inline-block text-[15px] font-semibold underline underline-offset-4 hover:text-cobalt"
                              >
                                 {t("Clear all filters")}
                              </Link>
                           </div>
                        )}
                     </CatalogResults>
                  </div>
               </div>
            </CatalogNavProvider>
         </Container>
      </>
   );
}
