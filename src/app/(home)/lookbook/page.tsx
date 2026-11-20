import type { Metadata } from "next";
import { Button, Container, MediaImage, PageHeader } from "@/components/ui";
import { LOOKBOOK_SCENES } from "@/constants/content";
import { getT } from "@/lib/i18n/server";
import { cn } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Lookbook") };
}

const TINTS = ["#d9d0bc", "#cdd3de", "#e2dccf", "#c9b8a0"];

export default async function LookbookPage() {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={t("Lookbook")}
            description={t("Autumn–Winter 26, photographed in and around our Porto workshop.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Lookbook") }]}
         />
         <Container className="grid grid-cols-1 gap-5 pb-24 md:grid-cols-2">
            {LOOKBOOK_SCENES.map((scene, index) => (
               <article key={scene.title} className={cn("relative overflow-hidden rounded-panel bg-card", index % 3 === 0 && "md:col-span-2")}>
                  <MediaImage
                     src={scene.image}
                      alt={t(scene.title)}
                      label={t("Lookbook photo")}
                     tint={TINTS[index % TINTS.length]}
                     priority={index === 0}
                     sizes={index % 3 === 0 ? "100vw" : "50vw"}
                     className={cn("w-full aspect-[4/3]", index % 3 === 0 ? "sm:aspect-[16/9]" : "sm:aspect-[4/5]")}
                  />
                  {/* На телефоне подпись под картинкой (поверх она закрывала почти весь кадр), с sm — плашкой поверх */}
                  <div className="flex flex-col gap-4 p-6 sm:absolute sm:inset-x-8 sm:bottom-8 sm:max-w-[420px] sm:rounded-card sm:bg-card/95 sm:shadow-float">
                     <div>
                         <h2 className="font-display text-[32px] leading-[1.05] uppercase">{t(scene.title)}</h2>
                         <p className="mt-2 text-[15px] text-ink-2">{t(scene.caption)}</p>
                      </div>
                      <Button href={scene.href} size="sm" className="self-start">
                         {t(scene.cta)}
                      </Button>
                  </div>
               </article>
            ))}
         </Container>
      </>
   );
}
