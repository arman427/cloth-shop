import type { Translator } from "@/lib/i18n/translate";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
   return EMAIL_PATTERN.test(value.trim());
}

export const PASSWORD_MIN_LENGTH = 8;
/** Upper limit stops someone sending a 10 MB "password" to burn CPU in the hash function */
export const PASSWORD_MAX_LENGTH = 128;

/** Returns an error message, or null when the password is fine. */
export function validatePassword(value: string, t: Translator): string | null {
   if (value.length < PASSWORD_MIN_LENGTH) return t("Use at least {count} characters.", { count: PASSWORD_MIN_LENGTH });
   if (value.length > PASSWORD_MAX_LENGTH) return t("Use at most {count} characters.", { count: PASSWORD_MAX_LENGTH });
   return null;
}

/** Reads a text field from FormData and trims it. Missing fields become "". */
export function readText(formData: FormData, key: string): string {
   const value = formData.get(key);
   return typeof value === "string" ? value.trim() : "";
}

/** Reads a positive integer field; returns null for anything else. */
export function readInt(formData: FormData, key: string): number | null {
   const value = Number(formData.get(key));
   return Number.isInteger(value) && value > 0 ? value : null;
}
