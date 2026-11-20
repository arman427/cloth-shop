import type { ReactNode } from "react";
import { cn } from "@/utils";

/** Оформление текстовых страниц: заголовки, абзацы и списки получают отступы без классов на каждом теге. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
   return (
      <div
         className={cn(
            "max-w-[680px] text-[17px] leading-[1.7] text-ink-2",
            "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[32px] [&_h2]:leading-[1.1] [&_h2]:text-ink [&_h2]:uppercase [&_h2:first-child]:mt-0",
            "[&_p+p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-cobalt",
            "[&_strong]:text-ink",
            className,
         )}
      >
         {children}
      </div>
   );
}
