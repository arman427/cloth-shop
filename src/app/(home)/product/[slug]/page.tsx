import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Badge, Breadcrumbs, ColorSwatches, Container, Icon, SectionHeading, tintFromHex } from "@/components/ui";
import { ProductGallery, ProductGrid, ProductPurchase } from "@/components/product";
import { BADGES, FREE_SHIPPING_THRESHOLD } from "@/constants/shop";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getLocale, getT } from "@/lib/i18n/server";
import { translateMaterial } from "@/lib/i18n/material";
import { formatPrice } from "@/utils";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
   const { slug } = await params;
   const [product, t] = await Promise.all([getProductBySlug(slug), getT()]);
   if (!product) return { title: t("Product not found") };
   return { title: `${t(product.name)}, ${t(product.color)}`, description: product.description ? t(product.description) : undefined };
}

const CARE = [
   "Wash cold, inside out, with similar colours.",
   "Reshape while damp and dry flat or on a hanger.",
   "Press on the reverse at a low heat if needed.",
   "Send it back to us for free repairs, for life.",
];

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
   const { slug } = await params;
   const product = await getProductBySlug(slug);
   if (!product) notFound();

   const [t, locale] = await Promise.all([getT(), getLocale()]);
   const material = translateMaterial(product.material, t);
   const badge = product.badge ? BADGES[product.badge] : null;

   return (
      <>
         <Container className="pt-10 pb-8 md:pt-14">
            <Breadcrumbs
               crumbs={[
                  { label: "Home", href: "/" },
                  { label: product.category.name, href: `/shop/${product.category.slug}` },
                  { label: product.name },
               ]}
            />
         </Container>

         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
               <ProductGallery name={product.name} images={product.images} tint={tintFromHex(product.colorHex)} />

               <div className="lg:sticky lg:top-6 lg:self-start">
                  <div className="flex items-start justify-between gap-6">
                     <h1 className="font-display text-[44px] leading-[1.02] uppercase md:text-[60px] ru:text-[38px] ru:md:text-[52px]">{t(product.name)}</h1>
                     {badge && <Badge tone={badge.tone}>{t(badge.label)}</Badge>}
                  </div>
                  <p className="mt-2 text-[15px] text-ink-3">{material}</p>
                  <p className="mt-5 text-[28px] font-bold">{formatPrice(product.price, "USD", locale)}</p>

                  <div className="mt-6 border-t border-line pt-6">
                     <p className="mb-3 text-[15px] font-semibold">
                        {t("Colour")}: <span className="font-normal text-ink-2">{t(product.color)}</span>
                     </p>
                     <ColorSwatches colorways={product.colorways} currentSlug={product.slug} label={t("Colours")} />
                  </div>

                  <div className="mt-6">
                     {/* Размеры и кнопки: клиентский компонент. Вход и избранное он берёт из ViewerProvider сам. */}
                     <ProductPurchase product={product} />
                  </div>

                  <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[15px] text-ink-2">
                     <li className="flex items-center gap-3">
                        <Icon name="truck" className="size-5" />
                        {t("Free shipping over {amount}", { amount: formatPrice(FREE_SHIPPING_THRESHOLD, "USD", locale) })}
                     </li>
                     <li className="flex items-center gap-3">
                        <Icon name="returns" className="size-5" />
                        {t("Free returns for 30 days")}
                     </li>
                     <li className="flex items-center gap-3">
                        <Icon name="scissors" className="size-5" />
                        {t("Free repairs for life")}
                     </li>
                  </ul>

                  <div className="mt-8 border-t border-line">
                     <Accordion title={t("Details")} defaultOpen>
                        <p>{product.description && t(product.description)}</p>
                     </Accordion>
                     <Accordion title={t("Materials and care")}>
                        {material && <p className="mb-3">{material}.</p>}
                        <ul className="list-disc space-y-1.5 pl-5">
                           {CARE.map((line) => (
                              <li key={line}>{t(line)}</li>
                           ))}
                        </ul>
                     </Accordion>
                     <Accordion title={t("Shipping and returns")}>
                        <p>
                           {t("Orders ship from Porto within two working days. Standard delivery takes three to five days in Europe and five to eight days elsewhere. Unworn pieces can be returned within 30 days.")}
                        </p>
                     </Accordion>
                  </div>
               </div>
            </div>
         </Container>

         {/* Похожие товары не нужны для первого экрана: догружаются отдельно и не задерживают страницу */}
         <Suspense fallback={null}>
            <RelatedProducts slug={product.slug} title={t("You may also like")} />
         </Suspense>
      </>
   );
}

async function RelatedProducts({ slug, title }: { slug: string; title: string }) {
   const related = await getRelatedProducts(slug);
   if (related.length === 0) return null;

   return (
      <section aria-labelledby="related-title" className="pb-24">
         <Container>
            <SectionHeading id="related-title" title={title} />
            <ProductGrid products={related} />
         </Container>
      </section>
   );
}

function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
   return (
      <details open={defaultOpen} className="group border-b border-line">
         <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
            {title}
            <Icon name="chevronDown" className="size-4 transition-transform group-open:rotate-180" />
         </summary>
         <div className="pb-5 text-[15px] leading-[1.65] text-ink-2">{children}</div>
      </details>
   );
}
