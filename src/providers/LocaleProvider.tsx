"use client";

import { createContext, useCallback, useContext, useMemo, useOptimistic, useTransition, type ReactNode } from "react";
import { setLocaleAction } from "@/actions/locale";
import type { Locale } from "@/lib/i18n/config";
import { translate, type Translator } from "@/lib/i18n/translate";

interface LocaleContextValue {
   locale: Locale;
   t: Translator;
   /** Сменить язык: клиентские компоненты переключаются сразу, серверные — когда придёт ответ */
   switchLocale: (next: Locale) => void;
   /** true, пока сервер перерисовывает страницу на новом языке */
   switching: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale: serverLocale, children }: { locale: Locale; children: ReactNode }) {
   // useOptimistic: шапка, подвал, карточки товаров и прочие клиентские компоненты переводятся
   // в момент клика, не дожидаясь, пока сервер перерисует страницу после смены cookie.
   const [locale, setOptimisticLocale] = useOptimistic(serverLocale);
   const [switching, startTransition] = useTransition();

   const switchLocale = useCallback(
      (next: Locale) => {
         startTransition(async () => {
            setOptimisticLocale(next);
            await setLocaleAction(next);
         });
      },
      [setOptimisticLocale],
   );

   const t = useCallback<Translator>((message, vars) => translate(locale, message, vars), [locale]);
   const value = useMemo<LocaleContextValue>(() => ({ locale, t, switchLocale, switching }), [locale, t, switchLocale, switching]);

   return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useLocaleContext(hook: string): LocaleContextValue {
   const context = useContext(LocaleContext);
   if (!context) throw new Error(`${hook} must be used inside <LocaleProvider>`);
   return context;
}

export function useT(): Translator {
   return useLocaleContext("useT").t;
}

export function useLocale(): Locale {
   return useLocaleContext("useLocale").locale;
}

export function useLocaleSwitch(): Pick<LocaleContextValue, "switchLocale" | "switching"> {
   const { switchLocale, switching } = useLocaleContext("useLocaleSwitch");
   return { switchLocale, switching };
}
