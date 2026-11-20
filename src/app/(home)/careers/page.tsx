import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { JOB_OPENINGS } from "@/constants/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Careers") };
}

export default async function CareersPage() {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={t("Careers")}
            description={t("Join a small team that makes clothes carefully. We hire slowly and keep people for a long time.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Careers") }]}
         />
         <Container className="pb-24">
            <ul className="divide-y divide-line border-y border-line">
               {JOB_OPENINGS.map((job) => (
                  <li key={job.title} className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[1.2fr_1.6fr_auto] md:items-start md:gap-12">
                     <div>
                        <h2 className="text-[22px] font-semibold">{t(job.title)}</h2>
                        <p className="mt-1 text-sm text-ink-3">
                           {t(job.team)} · {t(job.location)} · {t(job.type)}
                        </p>
                     </div>
                     <p className="text-[15px] text-ink-2">{t(job.summary)}</p>
                     <a
                        href={`mailto:careers@vellum.example?subject=${encodeURIComponent(
                           t("Application: {title}", { title: t(job.title) }),
                        )}`}
                        className="border-b-[1.5px] border-current pb-[3px] text-[15px] font-semibold whitespace-nowrap transition-colors hover:text-cobalt"
                     >
                        {t("Apply by email")}
                     </a>
                  </li>
               ))}
            </ul>
            <p className="mt-10 max-w-[560px] text-[17px] text-ink-2">
               {t("Don't see your role? Write to")}{" "}
               <a href="mailto:careers@vellum.example" className="font-semibold text-ink underline underline-offset-4 hover:text-cobalt">careers@vellum.example</a>{" "}
               {t("and tell us what you make.")}
            </p>
         </Container>
      </>
   );
}
