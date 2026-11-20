"use client";

import { useCallback, useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/providers/LocaleProvider";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { VerifyForm } from "./VerifyForm";

export type AuthMode = "login" | "register";

interface AuthDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   mode: AuthMode;
   onModeChange: (mode: AuthMode) => void;
}

const COPY = {
   login: {
      title: "Sign in",
      description:
         "Welcome back. Sign in to see your saved pieces and past orders.",
      switchText: "New to Vellum?",
      switchAction: "Create an account",
      switchTo: "register",
   },
   register: {
      title: "Create account",
      description:
         "Save pieces to your favourites and check out faster next time.",
      switchText: "Already have an account?",
      switchAction: "Sign in",
      switchTo: "login",
   },
} as const;

/**
 * Одно окно для входа, регистрации и ввода кода из письма.
 * Ссылка внизу переключает вход и регистрацию. Когда сервер просит подтвердить email,
 * окно показывает ввод кода (verifyEmail хранит адрес, на который ушло письмо).
 */
export function AuthDialog({
   open,
   onOpenChange,
   mode,
   onModeChange,
}: AuthDialogProps) {
   const t = useT();
   const copy = COPY[mode];
   // Адрес, на который отправили код. null: показываем обычную форму.
   const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

   const handleOpenChange = useCallback(
      (next: boolean) => {
         if (!next) setVerifyEmail(null); // закрыли окно: в следующий раз начнём с формы
         onOpenChange(next);
      },
      [onOpenChange],
   );
   const close = useCallback(() => handleOpenChange(false), [handleOpenChange]);

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent>
            <DialogHeader className="mb-6">
               <DialogTitle>
                  {verifyEmail ? t("Check your email") : t(copy.title)}
               </DialogTitle>
               <DialogDescription>
                  {verifyEmail
                     ? t("One more step: confirm that this address is yours.")
                     : t(copy.description)}
               </DialogDescription>
            </DialogHeader>

            {verifyEmail ? (
               <VerifyForm
                  key={verifyEmail}
                  email={verifyEmail}
                  onSuccess={close}
                  onChangeEmail={() => {
                     setVerifyEmail(null);
                     onModeChange("register");
                  }}
               />
            ) : (
               <>
                  {/* key заставляет форму создаться заново при смене режима, поэтому ошибки не переносятся */}
                  {mode === "login" ? (
                     <LoginForm
                        key="login"
                        onSuccess={close}
                        onVerify={setVerifyEmail}
                     />
                  ) : (
                     <RegisterForm
                        key="register"
                        onSuccess={close}
                        onVerify={setVerifyEmail}
                     />
                  )}

                  <div className="mt-6 text-center">
                     <p className="text-sm text-ink-2">
                        {t(copy.switchText)}{" "}
                        <button
                           type="button"
                           onClick={() => onModeChange(copy.switchTo)}
                           className="font-semibold relative pb-px duration-500 text-cobalt after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-cobalt after:scale-x-100"
                        >
                           {t(copy.switchAction)}
                        </button>
                     </p>
                     <p className="mt-2 text-xs text-ink-3">
                        {t(
                           "Demo project — please do not use real personal data or passwords",
                        )}
                     </p>
                  </div>
               </>
            )}
         </DialogContent>
      </Dialog>
   );
}
