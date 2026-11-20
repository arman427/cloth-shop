"use client";

import { useTransition } from "react";
import { loginAsDemo } from "@/actions/auth";
import { Button } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

export function DemoLoginButton() {
   const t = useT();
   const [isPending, startTransition] = useTransition();

   return (
      <Button
         type="button"
         variant="outline"
         className="w-full"
         disabled={isPending}
         onClick={() => startTransition(() => loginAsDemo())}
      >
         {isPending ? t("Signing in…") : t("Sign in to demo account")}
      </Button>
   );
}
