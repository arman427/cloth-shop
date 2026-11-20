"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/actions/account";
import { Button, Field, FormError, TextAreaField } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

interface ProfileFormProps {
   user: { name: string; email: string; phone: string; address: string };
}

const initialState: ProfileState = { ok: false };

export function ProfileForm({ user }: ProfileFormProps) {
   const t = useT();
   const [state, formAction, pending] = useActionState(updateProfile, initialState);

   return (
      <form action={formAction} className="grid gap-4" noValidate>
         <FormError>{state.errors?.form ? t(state.errors.form) : null}</FormError>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("Name")} name="name" autoComplete="name" defaultValue={user.name} error={state.errors?.name ? t(state.errors.name) : undefined} required />
            <Field label={t("Phone")} name="phone" type="tel" autoComplete="tel" defaultValue={user.phone} error={state.errors?.phone ? t(state.errors.phone) : undefined} />
         </div>
         <Field label={t("Email")} name="email" type="email" defaultValue={user.email} disabled hint={t("Your email is how you sign in and can't be changed here.")} />
         <TextAreaField
            label={t("Delivery address")}
            name="address"
            rows={3}
            autoComplete="street-address"
            defaultValue={user.address}
            error={state.errors?.address ? t(state.errors.address) : undefined}
            hint={t("We fill this in for you at checkout.")}
         />
         <div className="flex items-center gap-4">
            <Button type="submit" disabled={pending}>
               {pending ? t("Saving…") : t("Save changes")}
            </Button>
            {state.ok && !pending && (
               <p role="status" className="text-sm font-semibold text-ink-2">
                  {t("Saved.")}
               </p>
            )}
         </div>
      </form>
   );
}
