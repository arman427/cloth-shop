"use client";

import { useActionState, useEffect } from "react";
import { register, type AuthState } from "@/actions/auth";
import { Button, Field, FormError, Honeypot, PasswordField } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";
import { PASSWORD_MIN_LENGTH } from "@/utils";

interface RegisterFormProps {
   onSuccess: () => void;
   /** Нужен код из письма: родитель переключает окно на ввод кода */
   onVerify: (email: string) => void;
}

const initialState: AuthState = { ok: false };

export function RegisterForm({ onSuccess, onVerify }: RegisterFormProps) {
   const t = useT();
   const [state, formAction, pending] = useActionState(register, initialState);

   useEffect(() => {
      if (state.ok) onSuccess();
   }, [state.ok, onSuccess]);

   useEffect(() => {
      if (state.step === "verify" && state.values?.email) onVerify(state.values.email);
   }, [state.step, state.values?.email, onVerify]);

   return (
      <form action={formAction} className="flex flex-col gap-4" noValidate>
         <Honeypot />
         <FormError>{state.errors?.form}</FormError>
         <Field
            label={t("Name")}
            name="name"
            autoComplete="name"
            placeholder={t("Your name")}
            defaultValue={state.values?.name}
            error={state.errors?.name}
            required
         />
         <Field
            label={t("Email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            defaultValue={state.values?.email}
            error={state.errors?.email}
            required
         />
         <PasswordField
            label={t("Password")}
            name="password"
            autoComplete="new-password"
            hint={t("At least {count} characters.", { count: PASSWORD_MIN_LENGTH })}
            error={state.errors?.password}
            required
         />
         <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? t("Creating account…") : t("Create account")}
         </Button>
      </form>
   );
}
