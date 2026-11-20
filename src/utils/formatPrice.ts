const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string, locale: string, fractionDigits: number) {
   const key = `${locale}:${currency}:${fractionDigits}`;
   let formatter = formatters.get(key);

   if (!formatter) {
      formatter = new Intl.NumberFormat(locale, {
         style: "currency",
         currency,
         minimumFractionDigits: fractionDigits,
         maximumFractionDigits: fractionDigits,
      });
      formatters.set(key, formatter);
   }

   return formatter;
}

/**
 * Formats a price stored in cents, e.g. 18900 → "$189", 2950 → "$29.50".
 * Whole-dollar prices drop the decimals to match the design.
 */
export function formatPrice(cents: number, currency = "USD", locale = "en-US"): string {
   const fractionDigits = cents % 100 === 0 ? 0 : 2;
   return getFormatter(currency, locale, fractionDigits).format(cents / 100);
}

/** 3214 → "3,214" */
export function formatNumber(value: number, locale = "en-US"): string {
   return new Intl.NumberFormat(locale).format(value);
}

/** Date from the database → "19 November 2026" (fixed locale, so server and client agree) */
export function formatDate(date: Date, locale = "en-GB"): string {
   return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}
