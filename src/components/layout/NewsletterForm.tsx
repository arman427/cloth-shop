"use client";

import { useNewsletterForm } from "@/hooks";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

/** Демо-форма рассылки: ничего не отправляет и не сохраняет (см. hooks/useNewsletterForm.ts). */
export function NewsletterForm() {
   const t = useT();
   const { email, setEmail, status, message, onSubmit } = useNewsletterForm();

   return (
      <form onSubmit={onSubmit} noValidate className="relative max-w-[440px]">
         <div className="flex rounded-full bg-field-dark p-1.5 duration-300 hover:ring-2 hover:ring-cobalt-soft focus-within:ring-2 focus-within:ring-cobalt-soft">
            <label htmlFor="newsletter-email" className="sr-only">
               {t("Email address")}
            </label>
            <input
               id="newsletter-email"
               type="email"
               autoComplete="email"
               placeholder={t("Your email address")}
               value={email}
               onChange={(event) => setEmail(event.target.value)}
               aria-invalid={status === "error"}
               aria-describedby={message ? "newsletter-message" : undefined}
               className="min-w-0 flex-1 bg-transparent px-[18px] text-[15px] text-white outline-none placeholder:text-mute-3"
            />
            <button
               type="submit"
               className="h-[46px] rounded-full bg-white px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-white/85 disabled:opacity-60"
            >
               {t("Subscribe")}
            </button>
         </div>
         <p
            id="newsletter-message"
            aria-live="polite"
            className={cn(
               "mt-3 min-h-[22px] text-sm",
               status === "error" ? "text-[#FF9B8A]" : "text-mute-2",
            )}
         >
            {message}
         </p>
      </form>
   );
}
