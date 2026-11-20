import { cacheLife } from "next/cache";
import { FooterContent } from "./FooterContent";

async function getCurrentYear() {
   "use cache";
   cacheLife("days");

   return new Date().getFullYear();
}

/**
 * Год берём из кэша на сервере: new Date() в клиентском компоненте Next не даёт вызывать при заготовке страницы.
 * Всё остальное (тексты) рисует клиентский FooterContent через useT(), без чтения cookie на сервере.
 */
export async function Footer() {
   const year = await getCurrentYear();
   return <FooterContent year={year} />;
}
