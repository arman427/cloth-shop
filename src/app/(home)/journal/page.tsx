import type { Metadata } from "next";
import Link from "next/link";
import { Container, MediaImage, PageHeader } from "@/components/ui";
import { JOURNAL_POSTS } from "@/constants/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Journal") };
}

export default async function JournalPage() {
   const t = await getT();
   const [lead, ...rest] = JOURNAL_POSTS;

   return (
      <>
         <PageHeader
            title={t("Journal")}
            description={t("Notes from the workshop on patterns, fabric and looking after what you own.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Journal") }]}
         />
         <Container className="pb-24">
            <Link href={`/journal/${lead.slug}`} className="group grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-14">
               <MediaImage
                  src={lead.image}
                  alt={t(lead.title)}
                  label={t("Journal photo")}
                  tint="#d9d0bc"
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="aspect-[4/3] rounded-panel"
               />
               <div>
                  <p className="text-sm text-ink-3">
                     {t(lead.date)} · {t(lead.readTime)}
                  </p>
                  <h2 className="mt-3 font-display text-[40px] leading-[1.02] uppercase transition-colors group-hover:text-cobalt md:text-[56px] ru:text-[34px] ru:md:text-[48px]">
                     {t(lead.title)}
                  </h2>
                  <p className="mt-4 max-w-[420px] text-[17px] text-ink-2">{t(lead.excerpt)}</p>
               </div>
            </Link>

            <ul className="mt-16 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
               {rest.map((post) => (
                  <li key={post.slug}>
                     <Link href={`/journal/${post.slug}`} className="group block">
                        <MediaImage
                           src={post.image}
                           alt={t(post.title)}
                           label={t("Journal photo")}
                           tint="#e2dccf"
                           sizes="(min-width: 1024px) 33vw, 50vw"
                           className="aspect-[4/3] rounded-card"
                        />
                        <p className="mt-5 text-sm text-ink-3">
                           {t(post.date)} · {t(post.readTime)}
                        </p>
                        <h2 className="mt-2 text-[22px] leading-[1.25] font-semibold transition-colors group-hover:text-cobalt">
                           {t(post.title)}
                        </h2>
                        <p className="mt-2 text-[15px] text-ink-2">{t(post.excerpt)}</p>
                     </Link>
                  </li>
               ))}
            </ul>
         </Container>
      </>
   );
}
