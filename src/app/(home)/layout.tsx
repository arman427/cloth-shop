import type { ReactNode } from "react";
import { StorefrontShell } from "@/components/layout";

/** Storefront chrome shared by every page in the (home) group. */
export default function StorefrontLayout({ children }: { children: ReactNode }) {
   return <StorefrontShell>{children}</StorefrontShell>;
}
