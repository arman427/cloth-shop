"use client";

import { useContext } from "react";
import { AuthDialogContext } from "@/providers";

export function useAuthDialog() {
   const context = useContext(AuthDialogContext);
   if (!context) throw new Error("useAuthDialog must be used inside <AuthDialogProvider>");
   return context;
}
