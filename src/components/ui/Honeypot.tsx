"use client";

import { HONEYPOT_FIELD } from "@/lib/security/honeypot";
import { useT } from "@/providers/LocaleProvider";

/**
 * Поле-ловушка для ботов (см. lib/security/honeypot.ts). Человек его не видит и не достаёт табом:
 * оно вынесено за экран, скрыто от скринридеров и без автозаполнения браузера.
 * display: none здесь не годится: часть ботов пропускает такие поля.
 */
export function Honeypot() {
   const t = useT();

   return (
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
         <label>
            {t("Leave this field empty")}
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
         </label>
      </div>
   );
}
