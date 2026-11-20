"use client";

import { useCallback } from "react";
import { useViewerSnapshot } from "@/providers/ViewerProvider";
import { useAuthDialog } from "./useAuthDialog";

/**
 * Проверка перед действием с товаром (корзина, избранное).
 * Если уже известно, что человек не вошёл, сразу открывает окно входа и возвращает false.
 * Пока сервер не ответил, пропускаем: Server Action всё равно проверит вход сам и вернёт отказ.
 */
export function useRequireSignIn() {
   const viewer = useViewerSnapshot();
   const { openAuth } = useAuthDialog();

   return useCallback(() => {
      if (viewer && !viewer.signedIn) {
         openAuth("login");
         return false;
      }
      return true;
   }, [viewer, openAuth]);
}
