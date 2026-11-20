"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import { parseCatalogParams, searchParamsToObject, selectionToSearch } from "@/lib/catalogParams";
import { cn } from "@/utils";

/**
 * Переключение фильтров и сортировки без перезагрузки страницы.
 *
 * Как это работает:
 * 1. Человек кликает по фильтру, и мы собираем адрес (?size=M&color=Rust) из значений формы.
 * 2. router.replace(..., { scroll: false }) меняет адрес и просит у сервера новый список товаров.
 *    Страница не перезагружается и не прыгает вверх, меняется только содержимое.
 * 3. startTransition оставляет на экране старый список, пока приходит новый. isPending в это время
 *    равен true, и мы слегка притушаем сетку, чтобы было видно: идёт загрузка.
 */

interface CatalogNavValue {
   /** Идёт загрузка нового списка */
   pending: boolean;
   /** Номер "поколения" формы. Меняется, когда адрес поменяли не фильтры (кнопка "Назад", "Clear all") */
   version: number;
   /** Прочитать значения формы и перейти на адрес с ними */
   apply: (form: HTMLFormElement) => void;
   /** Сбросить все фильтры (поисковый запрос q остаётся) */
   clear: (q: string) => void;
}

const CatalogNavContext = createContext<CatalogNavValue | null>(null);

export function useCatalogNav(): CatalogNavValue {
   const value = useContext(CatalogNavContext);
   if (!value) throw new Error("useCatalogNav must be used inside <CatalogNavProvider>");
   return value;
}

interface CatalogNavProviderProps {
   /** Путь страницы: /shop, /women, /shop/knitwear */
   basePath: string;
   /** Текущая выборка из адреса, уже собранная в строку (см. selectionToSearch) */
   selectionKey: string;
   children: ReactNode;
}

export function CatalogNavProvider({ basePath, selectionKey, children }: CatalogNavProviderProps) {
   const router = useRouter();
   const [pending, startTransition] = useTransition();

   // Какой адрес мы запросили сами. null означает "сбросили всё, поля формы нужно пересоздать".
   const [requested, setRequested] = useState<string | null>(selectionKey);
   const [lastKey, setLastKey] = useState(selectionKey);
   const [version, setVersion] = useState(0);

   // Адрес изменился. Если это сделали не мы (назад в истории, ссылка "Clear all"),
   // то поля формы показывают старое. Меняем version, форма пересоздаётся и берёт значения из адреса.
   if (lastKey !== selectionKey) {
      setLastKey(selectionKey);
      if (selectionKey !== requested) setVersion((current) => current + 1);
   }

   function go(search: string, resetForm = false) {
      setRequested(resetForm ? null : search);
      startTransition(() => {
         router.replace(search ? `${basePath}?${search}` : basePath, { scroll: false });
      });
   }

   function apply(form: HTMLFormElement) {
      // FormData берёт и поля внутри формы, и "Sort by", который стоит снаружи и привязан атрибутом form
      const params = new URLSearchParams();
      for (const [name, value] of new FormData(form)) if (typeof value === "string") params.append(name, value);

      go(selectionToSearch(parseCatalogParams(searchParamsToObject(params))));
   }

   function clear(q: string) {
      go(q ? `q=${encodeURIComponent(q)}` : "", true);
   }

   return <CatalogNavContext.Provider value={{ pending, version, apply, clear }}>{children}</CatalogNavContext.Provider>;
}

/** Обёртка вокруг списка товаров: пока грузится новый список, старый притушен и не кликается. */
export function CatalogResults({ children }: { children: ReactNode }) {
   const { pending } = useCatalogNav();

   return (
      <div
         aria-busy={pending}
         className={cn("transition-opacity duration-200", pending ? "pointer-events-none opacity-50" : "opacity-100")}
      >
         {children}
      </div>
   );
}
