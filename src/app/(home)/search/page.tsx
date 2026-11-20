import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog";
import { Container, PageHeader } from "@/components/ui";
import { parseCatalogParams, type SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Search") };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
   const t = await getT();
   const params = await searchParams;
   const { q } = parseCatalogParams(params);

   if (!q) {
      return (
         <>
            <PageHeader title={t("Search")} crumbs={[{ label: t("Home"), href: "/" }, { label: t("Search") }]} />
            <Container className="pb-24">
               <p className="max-w-[460px] text-[17px] text-ink-2">
                  {t("Type a piece, a colour or a fabric into the search box at the top of the page, for example “wool” or “navy”.")}
               </p>
            </Container>
         </>
      );
   }

   return (
      <CatalogPage
         title={t("Results for “{query}”", { query: q })}
         crumbs={[{ label: t("Home"), href: "/" }, { label: t("Search") }]}
         basePath="/search"
         searchParams={Promise.resolve(params)}
         emptyHint={t("Check the spelling, or try a broader word like “coat” or “linen”.")}
      />
   );
}
