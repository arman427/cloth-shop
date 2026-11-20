"use client";

import type { ReactNode } from "react";
import type { FavoriteState } from "@/lib/favorites";
import { AuthDialogProvider } from "./AuthDialogProvider";
import { ViewerProvider } from "./ViewerProvider";

export function Providers({ viewer, children }: { viewer: Promise<FavoriteState>; children: ReactNode }) {
   return (
      <ViewerProvider viewer={viewer}>
         <AuthDialogProvider>{children}</AuthDialogProvider>
      </ViewerProvider>
   );
}

export { AuthDialogContext, AuthDialogProvider, type AuthDialogContextValue } from "./AuthDialogProvider";
export { useViewer, useViewerSnapshot, ViewerProvider } from "./ViewerProvider";
