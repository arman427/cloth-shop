import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog";
import { getCategoryBySlug } from "@/lib/catalog";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
   const { category: slug } = await params;
   const [category, t] = await Promise.all([getCategoryBySlug(slug), getT()]);
   return { title: t(category?.name ?? "Shop"), description: category?.description ? t(category.description) : undefined };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/shop/[category]">) {
   const { category: slug } = await params;
   const category = await getCategoryBySlug(slug);
   if (!category) notFound();

   return (
      <CatalogPage
         title={category.name}
         description={category.description ?? undefined}
         crumbs={[{ label: "Home", href: "/" }, { label: "All clothing", href: "/shop" }, { label: category.name }]}
         basePath={`/shop/${category.slug}`}
         searchParams={searchParams}
         fixed={{ categories: [category.slug] }}
         hideCategoryFilter
      />
   );
}
