type ClassValue = string | number | false | null | undefined;

/** Joins truthy class names. Keep conflicting Tailwind classes out of the same call. */
export function cn(...classes: ClassValue[]): string {
   return classes.filter(Boolean).join(" ");
}
