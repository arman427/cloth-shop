import type { ReactNode } from "react";
import {
   AnnouncementBar,
   Footer,
   Header,
   PetProjectBanner,
} from "@/components/layout";

/** Шапка, контент и подвал. Нужна и (home)/layout.tsx, и app/not-found.tsx, у которого своего layout нет. */
export function StorefrontShell({ children }: { children: ReactNode }) {
   return (
      <>
         <PetProjectBanner />
         <AnnouncementBar />
         <Header />
         <main className="flex-1">{children}</main>
         <Footer />
      </>
   );
}
