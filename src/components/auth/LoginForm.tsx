"use client";

import { useActionState, useEffect } from "react";
import { login, type AuthState } from "@/actions/auth";
import { Button, Field, FormError, Honeypot, PasswordField } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

interface LoginFormProps {
   onSuccess: () => void;
   /** Нужен код из письма: родитель переключает окно на ввод кода */
   onVerify: (email: string) => void;
}

const initialState: AuthState = { ok: false };

export function LoginForm({ onSuccess, onVerify }: LoginFormProps) {
   const t = useT();
   // useActionState вызывает серверную функцию login и хранит то, что она вернула
   const [state, formAction, pending] = useActionState(login, initialState);

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
            label={t("Email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            defaultValue={state.values?.email}
            error={state.errors?.email}
            required
         />
         <PasswordField label={t("Password")} name="password" autoComplete="current-password" error={state.errors?.password} required />
         <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? t("Signing in…") : t("Sign in")}
         </Button>
      </form>
   );
}
