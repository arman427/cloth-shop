import type { Metadata } from "next";
import { Container, Icon, MediaImage, PageHeader } from "@/components/ui";
import { STORES } from "@/constants/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Find a store") };
}

export default async function StoresPage() {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={t("Find a store")}
            description={t("Try pieces on, get a fitting and drop off repairs. Our flagship is next to the workshop in Porto.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Stores") }]}
         />
         <Container className="pb-24">
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
               {STORES.map((store) => (
                  <li key={store.city} className="overflow-hidden rounded-panel bg-card">
                     <MediaImage src={store.image} alt={t("Storefront photo of {name}", { name: t(store.name) })} label={t("Store photo")} tint="#e2dccf" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/8]" />
                     <div className="p-7 md:p-8">
                        <h2 className="font-display text-[36px] leading-none uppercase">{t(store.city)}</h2>
                        <p className="mt-1 text-[15px] text-ink-3">{t(store.name)}</p>
                        <dl className="mt-6 grid gap-4 text-[15px] text-ink-2">
                           <div className="flex gap-3">
                              <dt>
                                 <Icon name="pin" className="size-5" />
                                 <span className="sr-only">{t("Address")}</span>
                              </dt>
                              <dd>
                                 {store.address.map((line) => (
                                    <span key={line} className="block">
                                       {t(line)}
                                    </span>
                                 ))}
                              </dd>
                           </div>
                           <div className="flex gap-3">
                              <dt>
                                 <Icon name="clock" className="size-5" />
                                 <span className="sr-only">{t("Opening hours")}</span>
                              </dt>
                              <dd>
                                 {store.hours.map((line) => (
                                    <span key={line} className="block">
                                       {t(line)}
                                    </span>
                                 ))}
                              </dd>
                           </div>
                           <div className="flex gap-3">
                              <dt>
                                 <Icon name="phone" className="size-5" />
                                 <span className="sr-only">{t("Phone")}</span>
                              </dt>
                              <dd>
                                 <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="hover:text-cobalt">
                                    {store.phone}
                                 </a>
                              </dd>
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
