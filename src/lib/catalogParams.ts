/**
 * Превращает адрес страницы (?size=M&color=Rust&sort=price-asc) в запрос к базе.
 * Всё, что пришло из адреса, проверяется по белому списку: адрес можно набрать руками.
 */
import { FILTER_SIZES, PRICE_BUCKETS, SORT_OPTIONS, type PriceBucketValue, type SortValue } from "@/constants/shop";
import type { Size } from "@/types";

export type SearchParams = Record<string, string | string[] | undefined>;

export interface CatalogSelection {
   categories: string[];
   sizes: Size[];
   colors: string[];
   price: PriceBucketValue;
   sort: SortValue;
   q: string;
}

const asArray = (value: string | string[] | undefined): string[] => (Array.isArray(value) ? value : value ? [value] : []);
const first = (value: string | string[] | undefined): string => asArray(value)[0] ?? "";

export function parseCatalogParams(params: SearchParams): CatalogSelection {
   const price = first(params.price);
   const sort = first(params.sort);

   return {
      categories: asArray(params.category).slice(0, 10),
      sizes: asArray(params.size).filter((size): size is Size => (FILTER_SIZES as string[]).includes(size)),
      colors: asArray(params.color).slice(0, 20),
      price: PRICE_BUCKETS.some((bucket) => bucket.value === price) ? (price as PriceBucketValue) : "any",
      sort: SORT_OPTIONS.some((option) => option.value === sort) ? (sort as SortValue) : "newest",
      q: first(params.q).trim().slice(0, 80),
   };
}

/** Сколько фильтров включено (для подписи на кнопке "Filters") */
export function countActiveFilters(selection: CatalogSelection): number {
   return selection.categories.length + selection.sizes.length + selection.colors.length + (selection.price !== "any" ? 1 : 0);
}

/** Достаёт из URLSearchParams обычный объект: повторяющиеся ключи (?size=M&size=L) становятся массивом. */
export function searchParamsToObject(params: URLSearchParams): SearchParams {
   const result: SearchParams = {};
   for (const key of new Set(params.keys())) result[key] = params.getAll(key);
   return result;
}

/**
 * Обратное действие: выбранные фильтры → строка адреса без "?" (size=M&color=Rust&sort=price-asc).
 * Значения по умолчанию (любая цена, сортировка "newest") в адрес не попадают, чтобы он оставался коротким.
 * Порядок ключей всегда один и тот же, поэтому две одинаковые выборки дают одинаковую строку.
 */
export function selectionToSearch(selection: CatalogSelection): string {
   const params = new URLSearchParams();
   if (selection.q) params.set("q", selection.q);
   for (const category of selection.categories) params.append("category", category);
   for (const size of selection.sizes) params.append("size", size);
   for (const color of selection.colors) params.append("color", color);
   if (selection.price !== "any") params.set("price", selection.price);
   if (selection.sort !== "newest") params.set("sort", selection.sort);
   return params.toString();
}
