"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useActionState, useEffect, useRef, useState } from "react";
import { resendCode, verifyEmail, type AuthState } from "@/actions/auth";
import { Button, FormError } from "@/components/ui";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useT } from "@/providers/LocaleProvider";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

interface VerifyFormProps {
   email: string;
   onSuccess: () => void;
   /** "Use a different email": вернуться к регистрации */
   onChangeEmail: () => void;
}

/** Второй шаг регистрации (и входа в неподтверждённый аккаунт): ввод 6-значного кода из письма. */
export function VerifyForm({ email, onSuccess, onChangeEmail }: VerifyFormProps) {
   const t = useT();
   const initial: AuthState = { ok: false, step: "verify", values: { email } };
   const [state, formAction, pending] = useActionState(verifyEmail, initial);
   const [resendState, resendAction, resending] = useActionState(resendCode, initial);

   const [code, setCode] = useState("");
   const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
   const formRef = useRef<HTMLFormElement>(null);

   // Неверный код: очищаем ячейки, чтобы можно было сразу вводить заново
   const [seenState, setSeenState] = useState(state);
   if (state !== seenState) {
      setSeenState(state);
      if (state.errors?.code) setCode("");
   }

   useEffect(() => {
      if (state.ok) onSuccess();
   }, [state.ok, onSuccess]);

   // Обратный отсчёт до возможности запросить код повторно
   useEffect(() => {
      if (cooldown <= 0) return;
      const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
      return () => clearTimeout(timer);
   }, [cooldown]);

   return (
      <div className="flex flex-col gap-5">
         <p className="text-[15px] text-ink-2">
            {t("We sent a {count}-digit code to", { count: CODE_LENGTH })} <b className="font-semibold text-ink">{email}</b>{t(". It works for 10 minutes.")}
         </p>

         <form ref={formRef} action={formAction} className="flex flex-col gap-4">
            <FormError>{state.errors?.form}</FormError>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="code" value={code} />

            <div className="flex flex-col gap-2">
               <InputOTP
                  maxLength={CODE_LENGTH}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={code}
                  onChange={setCode}
                  // Когда введена последняя цифра, отправляем сами. setTimeout даёт React обновить hidden-поле.
                  onComplete={() => setTimeout(() => formRef.current?.requestSubmit(), 0)}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  aria-label={t("{count}-digit confirmation code", { count: CODE_LENGTH })}
                  disabled={pending}
                  autoFocus
               >
                  <InputOTPGroup>
                     <InputOTPSlot index={0} />
                     <InputOTPSlot index={1} />
                     <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                     <InputOTPSlot index={3} />
                     <InputOTPSlot index={4} />
                     <InputOTPSlot index={5} />
                  </InputOTPGroup>
               </InputOTP>
               {state.errors?.code && (
                  <p role="alert" className="text-[13px] text-cobalt">
                     {state.errors.code}
                  </p>
               )}
            </div>

            <Button type="submit" disabled={pending || code.length < CODE_LENGTH} className="w-full">
               {pending ? t("Checking…") : t("Confirm email")}
            </Button>
         </form>

         <div className="flex flex-col items-center gap-2 text-sm text-ink-2">
            {resendState.notice && !resendState.errors?.form && (
               <p role="status" className="text-ink">
                  {resendState.notice}
               </p>
            )}
            {resendState.errors?.form && (
               <p role="alert" className="text-cobalt">
                  {resendState.errors.form}
               </p>
            )}
            <form action={resendAction} onSubmit={() => setCooldown(RESEND_COOLDOWN_SECONDS)}>
               <input type="hidden" name="email" value={email} />
               <button
                  type="submit"
                  disabled={cooldown > 0 || resending}
                  className="font-semibold text-ink underline decoration-1 underline-offset-4 transition-colors hover:text-cobalt disabled:no-underline disabled:opacity-50 disabled:hover:text-ink"
               >
                  {cooldown > 0 ? t("Send a new code in {seconds}s", { seconds: cooldown }) : resending ? t("Sending…") : t("Send a new code")}
               </button>
            </form>
            <button
               type="button"
               onClick={onChangeEmail}
               className="underline decoration-1 underline-offset-4 transition-colors hover:text-cobalt"
            >
               {t("Use a different email")}
            </button>
         </div>
      </div>
   );
}
