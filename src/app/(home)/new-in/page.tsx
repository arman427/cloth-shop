import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog";
import type { SearchParams } from "@/lib/catalogParams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("New in") };
}

export default function NewInPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
   return (
      <CatalogPage
         title="New in"
         description="The latest runs from the workshop, newest first."
         crumbs={[{ label: "Home", href: "/" }, { label: "New in" }]}
         basePath="/new-in"
         searchParams={searchParams}
      />
   );
}
