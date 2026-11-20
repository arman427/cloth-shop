import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog";
import type { SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Men") };
}

export default function MenPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
   return (
      <CatalogPage
         title="Men"
         description="Outerwear, knitwear, shirts and trousers cut for men, plus every unisex style."
         crumbs={[{ label: "Home", href: "/" }, { label: "Men" }]}
         basePath="/men"
         searchParams={searchParams}
         fixed={{ gender: "MEN" }}
      />
   );
}
