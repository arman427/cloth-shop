/**
 * Векторные картинки сайта. Все они лежат в public/images и нарисованы скриптом
 * scripts/generate-images.ts (запуск: npx tsx scripts/generate-images.ts).
 *
 * Если у товара или категории в базе есть свои картинки (поле images / image), берутся они.
 * Пусто — подставляются векторные картинки по slug. Так ничего не нужно менять в базе:
 * достаточно, чтобы для slug был сгенерирован файл.
 */

/** Ракурсы товара в галерее: вещь целиком, крупный план ткани и лекало */
export const PRODUCT_VIEWS = ["front", "detail", "pattern"] as const;

export function productImages(slug: string, images: string[]): string[] {
   if (images.length > 0) return images;
   return PRODUCT_VIEWS.map((view) => `/images/products/${slug}/${view}.svg`);
}

export function categoryImage(slug: string, image: string | null): string {
   return image ?? `/images/categories/${slug}.svg`;
}

/** Отдельные иллюстрации страниц */
export const ART = {
   coatEdit: "/images/editorial/coat-edit.svg",
   knitEdit: "/images/editorial/knit-edit.svg",
   workshop: "/images/workshop.svg",
   giftCard: "/images/gift-card.svg",
   journal: (slug: string) => `/images/journal/${slug}.svg`,
   lookbook: (slug: string) => `/images/lookbook/${slug}.svg`,
   fabric: (slug: string) => `/images/fabrics/${slug}.svg`,
   store: (slug: string) => `/images/stores/${slug}.svg`,
} as const;
