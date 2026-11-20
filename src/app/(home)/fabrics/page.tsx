import type { Metadata } from "next";
import { Container, MediaImage, PageHeader } from "@/components/ui";
import { FABRICS } from "@/constants/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Fabrics") };
}

export default async function FabricsPage() {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={t("Fabrics")}
            description={t("Six materials we use again and again, and where each one comes from.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Fabrics") }]}
         />
         <Container className="pb-24">
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
               {FABRICS.map((fabric) => (
                  <li key={fabric.name} className="overflow-hidden rounded-card bg-card">
                     <MediaImage
                        src={fabric.image}
                        alt={t("Swatch of {name}", { name: t(fabric.name) })}
                        label={t("Fabric photo")}
                        tint="#e2dccf"
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="aspect-[4/3]"
                     />
                     <div className="p-7">
                        <h2 className="text-[22px] font-semibold">{t(fabric.name)}</h2>
                        <p className="mt-2 text-[15px] text-ink-2">{t(fabric.text)}</p>
                        <dl className="mt-5 grid gap-1.5 border-t border-line pt-5 text-sm">
                           <div className="flex justify-between gap-4">
                              <dt className="text-ink-3">{t("Origin")}</dt>
                              <dd className="text-right font-medium">{t(fabric.origin)}</dd>
                           </div>
                           <div className="flex justify-between gap-4">
                              <dt className="text-ink-3">{t("Weight")}</dt>
                              <dd className="text-right font-medium">{t(fabric.weight)}</dd>
                           </div>
                           <div className="flex justify-between gap-4">
                              <dt className="text-ink-3">{t("Care")}</dt>
                              <dd className="text-right font-medium">{t(fabric.care)}</dd>
                           </div>
                        </dl>
                     </div>
                  </li>
               ))}
            </ul>
         </Container>
      </>
   );
}
