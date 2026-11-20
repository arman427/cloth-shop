import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, Icon, MediaImage } from "@/components/ui";
import { JOURNAL_POSTS } from "@/constants/content";
import { getT } from "@/lib/i18n/server";

export function generateStaticParams() {
   return JOURNAL_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
   const { slug } = await params;
   const t = await getT();
   const post = JOURNAL_POSTS.find((item) => item.slug === slug);
   return post ? { title: t(post.title), description: t(post.excerpt) } : { title: t("Journal") };
}

export default async function JournalPostPage({ params }: PageProps<"/journal/[slug]">) {
   const { slug } = await params;
   const t = await getT();
   const post = JOURNAL_POSTS.find((item) => item.slug === slug);
   if (!post) notFound();

   const more = JOURNAL_POSTS.filter((item) => item.slug !== post.slug).slice(0, 2);

   return (
      <article>
         <Container className="pt-10 md:pt-14">
            <Breadcrumbs crumbs={[{ label: t("Home"), href: "/" }, { label: t("Journal"), href: "/journal" }, { label: t(post.title) }]} />
            <header className="mx-auto mt-10 max-w-[820px]">
               <p className="text-sm text-ink-3">
                  {t(post.date)} · {t(post.readTime)}
               </p>
               <h1 className="mt-4 font-display text-[48px] leading-[0.98] uppercase md:text-[80px] ru:text-[40px] ru:md:text-[68px]">{t(post.title)}</h1>
               <p className="mt-5 text-[19px] text-ink-2">{t(post.excerpt)}</p>
            </header>
            <MediaImage
               src={post.image}
               alt={t(post.title)}
               label={t("Journal photo")}
               tint="#d9d0bc"
               priority
               sizes="(min-width: 1376px) 1312px, 100vw"
               className="mt-12 aspect-[16/9] rounded-panel"
            />
            <div className="mx-auto mt-12 max-w-[680px] text-[18px] leading-[1.75] text-ink-2">
               {post.body.map((paragraph) => (
                  <p key={paragraph} className="mb-6">
                     {t(paragraph)}
                  </p>
               ))}
            </div>
         </Container>

         <Container className="py-24">
            <h2 className="mb-8 font-display text-[40px] uppercase">{t("Keep reading")}</h2>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
               {more.map((item) => (
                  <li key={item.slug}>
                     <Link href={`/journal/${item.slug}`} className="group flex items-center justify-between gap-6 rounded-card bg-card p-7 transition-shadow hover:shadow-float">
                        <span>
                           <span className="block text-sm text-ink-3">{t(item.readTime)}</span>
                           <span className="mt-1 block text-xl font-semibold">{t(item.title)}</span>
                        </span>
                        <Icon name="arrowRight" className="size-5 transition-transform group-hover:translate-x-1" />
                     </Link>
                  </li>
               ))}
            </ul>
         </Container>
      </article>
   );
}
