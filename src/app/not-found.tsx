import { StorefrontShell } from "@/components/layout";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

/** Адреса, которых нет вообще: у них нет (home)/layout.tsx, поэтому шапку и подвал рисуем сами. */
export default function GlobalNotFound() {
   return (
      <StorefrontShell>
         <NotFoundContent />
      </StorefrontShell>
   );
}
