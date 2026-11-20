import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog";
import type { SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Women") };
}

export default function WomenPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
   return (
      <CatalogPage
         title="Women"
         description="Coats, knits, shirts and trousers cut for women, plus every unisex style."
         crumbs={[{ label: "Home", href: "/" }, { label: "Women" }]}
         basePath="/women"
         searchParams={searchParams}
         fixed={{ gender: "WOMEN" }}
      />
   );
}
