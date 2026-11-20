import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog";
import type { SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("All clothing") };
}

export default function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
   return (
      <CatalogPage
         title="All clothing"
         description="Outerwear, knitwear, shirts and trousers, made in small runs in Porto."
         crumbs={[{ label: "Home", href: "/" }, { label: "All clothing" }]}
         basePath="/shop"
         searchParams={searchParams}
         fixed={{ excludeCategories: ["bags"] }}
      />
   );
}
