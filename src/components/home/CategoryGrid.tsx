import Link from "next/link";
import { Container, MediaImage, SectionHeading, TextLink } from "@/components/ui";
import { getT } from "@/lib/i18n/server";
import type { Category } from "@/types";
import { cn } from "@/utils";

interface CategoryGridProps {
   categories: Category[];
}

export async function CategoryGrid({ categories }: CategoryGridProps) {
   const t = await getT();

   return (
      <section aria-labelledby="categories-title" className="pt-6 pb-24">
         <Container>
            <SectionHeading
               id="categories-title"
               title={t("Shop by category")}
               action={<TextLink href="/shop">{t("All clothing")}</TextLink>}
            />
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
               {categories.map((category, index) => (
                  <li key={category.slug} className={cn(index === 0 && "col-span-2 md:col-span-1")}>
                     {/* Первая ячейка шире остальных из-за sortOrder — ей отдаётся двойная ширина */}
                     <CategoryCard category={category} featured={index === 0} t={t} />
                  </li>
               ))}
            </ul>
         </Container>
      </section>
   );
}

function CategoryCard({
   category,
   featured,
   t,
}: {
   category: Category;
   featured: boolean;
   t: Awaited<ReturnType<typeof getT>>;
}) {
   return (
      <Link
         href={`/shop/${category.slug}`}
         style={{ backgroundColor: category.tint }}
         className={cn(
            "group relative flex h-[260px] flex-col justify-end overflow-hidden rounded-card p-4 sm:h-[340px] sm:p-[22px]",
            featured && "text-white",
         )}
      >
         <MediaImage
            src={category.image}
            alt={t(category.name)}
            tone={featured ? "dark" : "light"}
            tint={featured ? "rgb(255 255 255 / 0.07)" : "rgb(255 255 255 / 0.4)"}
            sizes="(min-width: 1024px) 24vw, 50vw"
            className="absolute inset-x-4 top-4 bottom-[76px] rounded-xl transition-transform duration-300 group-hover:-translate-y-1.5 sm:inset-x-[22px] sm:top-[22px] sm:bottom-[72px]"
         />
         {/* flex-wrap: длинное название ("Рубашки и футболки") занимает строку, а число уходит под него */}
         <span className="relative flex flex-wrap items-baseline justify-between gap-x-3 text-base leading-tight font-semibold sm:text-lg">
            <span className="min-w-0">{t(category.name)}</span>
            <span className={cn("text-sm font-medium", featured ? "text-[#AEB4BF]" : "text-ink-2")}>
               {featured ? t("{count} pieces", { count: category.count }) : category.count}
            </span>
         </span>
      </Link>
   );
}
