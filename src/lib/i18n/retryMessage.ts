import type { Translator } from "./translate";

export function retryMessage(t: Translator, seconds: number) {
   if (seconds === 1) return t("Too many attempts. Try again in one second.");
   return seconds < 90
      ? t("Too many attempts. Try again in {count} seconds.", { count: seconds })
      : t("Too many attempts. Try again in {count} minutes.", { count: Math.ceil(seconds / 60) });
}
