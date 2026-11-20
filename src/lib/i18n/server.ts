// @/lib/i18n/server.ts
import { cookies } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { translate, type Translator } from "./translate";

/**
 * Locale from the cookie, Russian by default. Cached per request.
 * connection() здесь не нужен: cookies() и так делает компонент зависящим от запроса.
 */
export const getLocale = cache(async (): Promise<Locale> => {
   const value = (await cookies()).get(LOCALE_COOKIE)?.value;
   return isLocale(value) ? value : DEFAULT_LOCALE;
});

/** Синхронный переводчик без обращения к cookies/connection */
export function getTForLocale(locale: Locale): Translator {
   return (message, vars) => translate(locale, message, vars);
}

/** Translator bound to the current request locale. Cached per request. */
export const getT = cache(async (): Promise<Translator> => {
   const locale = await getLocale();
   return getTForLocale(locale);
});
