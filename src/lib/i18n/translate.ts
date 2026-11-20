import type { Locale } from "./config";
import { ru } from "./messages/ru";

export type TranslateVars = Record<string, string | number>;

export type Translator = (message: string, vars?: TranslateVars) => string;

const dictionaries: Partial<Record<Locale, Record<string, string>>> = { ru };

export function translate(locale: Locale, message: string, vars?: TranslateVars): string {
   const dictionary = dictionaries[locale];
   const template = dictionary?.[message] ?? message;

   if (!vars) return template;

   return template.replace(/\{(\w+)\}/g, (match, key: string) =>
      Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match,
   );
}
