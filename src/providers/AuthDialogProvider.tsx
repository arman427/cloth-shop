"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth/AuthDialog";

export interface AuthDialogContextValue {
   /** Открыть окно входа (или регистрации). Вызывается из любого клиентского компонента. */
   openAuth: (mode?: AuthMode) => void;
}

export const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

/**
 * Держит одно окно входа на весь сайт. Кнопка "Sign in" в шапке, сердечко у гостя
 * и страница корзины открывают одно и то же окно через useAuthDialog().
 */
export function AuthDialogProvider({ children }: { children: ReactNode }) {
   const [open, setOpen] = useState(false);
   const [mode, setMode] = useState<AuthMode>("login");

   const openAuth = useCallback((nextMode: AuthMode = "login") => {
      setMode(nextMode);
      setOpen(true);
   }, []);

   const value = useMemo(() => ({ openAuth }), [openAuth]);

   return (
      <AuthDialogContext.Provider value={value}>
         {children}
         <AuthDialog open={open} onOpenChange={setOpen} mode={mode} onModeChange={setMode} />
      </AuthDialogContext.Provider>
   );
}
