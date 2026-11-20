"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/actions/contact";
import { Button, Field, Honeypot, FormError, SelectField, TextAreaField } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";
import { retryMessage } from "@/lib/i18n/retryMessage";

const initialState: ContactState = { ok: false };

const TOPICS = [
   { value: "order", label: "My order" },
   { value: "repair", label: "A repair" },
   { value: "sizing", label: "Sizing advice" },
   { value: "gift-card", label: "Gift cards" },
   { value: "other", label: "Something else" },
];

export function ContactForm({ defaultTopic = "order" }: { defaultTopic?: string }) {
   const t = useT();
   const [state, formAction, pending] = useActionState(sendMessage, initialState);

   if (state.ok) {
      return (
         <div role="status" className="rounded-panel bg-card px-6 py-12 text-center">
            <p className="text-xl font-semibold">{t("Message sent")}</p>
            <p className="mt-2 text-ink-2">{t("Thanks for writing. We reply within one working day.")}</p>
         </div>
      );
   }

   return (
      <form action={formAction} className="grid max-w-[620px] gap-4" noValidate>
         <Honeypot />
         <FormError>{state.retryAfter !== undefined ? retryMessage(t, state.retryAfter) : state.errors?.form && t(state.errors.form)}</FormError>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
               label={t("Name")}
               name="name"
               autoComplete="name"
               defaultValue={state.values?.name}
               error={state.errors?.name ? t(state.errors.name) : undefined}
               required
            />
            <Field
               label={t("Email")}
               name="email"
               type="email"
               autoComplete="email"
               defaultValue={state.values?.email}
               error={state.errors?.email ? t(state.errors.email) : undefined}
               required
            />
         </div>
         <SelectField label={t("What is it about?")} name="topic" defaultValue={state.values?.topic ?? defaultTopic}>
            {TOPICS.map((topic) => (
               <option key={topic.value} value={topic.value}>
                  {t(topic.label)}
               </option>
            ))}
         </SelectField>
         <TextAreaField
            label={t("Message")}
            name="message"
            rows={6}
            defaultValue={state.values?.message}
            error={state.errors?.message ? t(state.errors.message) : undefined}
            required
         />
         <Button type="submit" disabled={pending} className="self-start">
            {pending ? t("Sending…") : t("Send message")}
         </Button>
      </form>
   );
}
