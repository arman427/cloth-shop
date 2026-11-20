import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog";
import type { SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Bags") };
}

export default function BagsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
   return (
      <CatalogPage
         title="Bags"
         description="Vegetable-tanned leather and waxed canvas, made to take on a patina."
         crumbs={[{ label: "Home", href: "/" }, { label: "Bags" }]}
         basePath="/bags"
         searchParams={searchParams}
         fixed={{ categories: ["bags"] }}
         hideCategoryFilter
      />
   );
}
