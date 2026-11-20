export const LOCALES = ["ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_COOKIE = "locale";

export const LOCALE_SHORT: Record<Locale, string> = {
   ru: "RU",
   en: "EN",
};

export const LOCALE_NAMES: Record<Locale, string> = {
   ru: "Русский",
   en: "English",
};

export function isLocale(value: string | null | undefined): value is Locale {
   return value === "ru" || value === "en";
}
