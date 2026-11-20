import type { Metadata } from "next";
import Link from "next/link";
import { HelpLayout, Prose } from "@/components/content";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Size guide") };
}

const WOMEN = [
   ["XS", "80", "62", "88"],
   ["S", "84", "66", "92"],
   ["M", "88", "70", "96"],
   ["L", "94", "76", "102"],
   ["XL", "100", "82", "108"],
];

const MEN = [
   ["XS", "86", "72", "90"],
   ["S", "92", "78", "94"],
   ["M", "98", "84", "100"],
   ["L", "104", "90", "106"],
   ["XL", "110", "96", "112"],
];

export default async function SizeGuidePage() {
   const t = await getT();

   return (
      <HelpLayout
         title={t("Size guide")}
         description={t("Body measurements for every size, in centimetres.")}
         current="/help/size-guide"
      >
         <Prose>
            <h2>{t("How to measure")}</h2>
            <p>
               {t(
                  "Use a soft tape measure over light clothing. For the chest, measure around the fullest part. For the waist, measure at the narrowest point, and for the hip, around the widest. Between two sizes, choose the larger for a relaxed fit and the smaller for a close one.",
               )}
            </p>
         </Prose>

         <SizeTable title={t("Women")} rows={WOMEN} />
         <SizeTable title={t("Men")} rows={MEN} />

         <Prose className="mt-12">
            <p>
               {t("Unisex pieces follow the men's table. Not sure?")} <Link href="/help/contact">{t("Ask us")}</Link>{" "}
               {t("and our pattern cutters will help you pick.")}
            </p>
         </Prose>
      </HelpLayout>
   );
}

async function SizeTable({ title, rows }: { title: string; rows: string[][] }) {
   const t = await getT();

   return (
      <section className="mt-12 max-w-[680px]">
         <h2 className="mb-4 font-display text-[32px] uppercase">{title}</h2>
         <div className="overflow-x-auto rounded-card border border-line">
            <table className="w-full min-w-[420px] text-left text-[15px]">
               <caption className="sr-only">{t("{title} body measurements in centimetres", { title })}</caption>
               <thead className="bg-card">
                  <tr>
                     <th scope="col" className="px-5 py-3 font-semibold">
                        {t("Size")}
                     </th>
                     <th scope="col" className="px-5 py-3 font-semibold">
                        {t("Chest")}
                     </th>
                     <th scope="col" className="px-5 py-3 font-semibold">
                        {t("Waist")}
                     </th>
                     <th scope="col" className="px-5 py-3 font-semibold">
                        {t("Hip")}
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {rows.map(([size, chest, waist, hip]) => (
                     <tr key={size} className="border-t border-line">
                        <th scope="row" className="px-5 py-3 font-semibold">
                           {size}
                        </th>
                        <td className="px-5 py-3 text-ink-2">
                           {chest} {t("cm")}
                        </td>
                        <td className="px-5 py-3 text-ink-2">
                           {waist} {t("cm")}
                        </td>
                        <td className="px-5 py-3 text-ink-2">
                           {hip} {t("cm")}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
   );
}
