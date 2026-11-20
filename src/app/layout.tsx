import type { Metadata } from "next";
import { Suspense } from "react";
import { Anton, DM_Sans, Manrope, Oswald } from "next/font/google";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { Providers } from "@/providers";
import { getFavoriteState } from "@/lib/favorites";
import { getLocale, getT } from "@/lib/i18n/server";
import "./globals.css";

const anton = Anton({
   variable: "--font-anton",
   weight: "400",
   subsets: ["latin"],
   display: "swap",
});

const dmSans = DM_Sans({
   variable: "--font-dm-sans",
   subsets: ["latin"],
   display: "swap",
});

/*
 * В Anton и DM Sans нет кириллицы. Раньше русский текст рисовался запасным Arial: широким и тонким,
 * поэтому крупные заголовки вылезали за экран телефона. Для русского берём шрифты с кириллицей
 * (переключение по lang в globals.css). preload: false — английской версии они не нужны.
 */
const oswald = Oswald({
   variable: "--font-oswald",
   subsets: ["latin", "cyrillic"],
   display: "swap",
   preload: false,
});

const manrope = Manrope({
   variable: "--font-manrope",
   subsets: ["latin", "cyrillic"],
   display: "swap",
   preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();

   return {
      title: {
         default: t("Vellum | Clothing cut from paper patterns"),
         template: "%s | Vellum",
      },
      description: t(
         "Clothing for women and men, drafted on paper in our Porto studio and made in small runs from fabrics that get better with wear.",
      ),
   };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
   return (
      <Suspense fallback={null}>
         <LocalizedDocument>{children}</LocalizedDocument>
      </Suspense>
   );
}

async function LocalizedDocument({ children }: { children: React.ReactNode }) {
   const locale = await getLocale();

   return (
      <html lang={locale} className={`${anton.variable} ${dmSans.variable} ${oswald.variable} ${manrope.variable} h-full`}>
         <body className="flex min-h-full flex-col">
            <LocaleProvider locale={locale}>
               {/* Promise без await: сессия и избранное догружаются потоком и не задерживают страницу */}
               <Providers viewer={getFavoriteState()}>{children}</Providers>
            </LocaleProvider>
         </body>
      </html>
   );
}
