import type { ReactNode } from "react";
import type { BadgeTone } from "@/types";
import { cn } from "@/utils";

const TONES: Record<BadgeTone, string> = {
   cobalt: "bg-cobalt",
   ink: "bg-ink",
};

interface BadgeProps {
   tone?: BadgeTone;
   className?: string;
   children: ReactNode;
}

export function Badge({ tone = "cobalt", className, children }: BadgeProps) {
   return (
      <span className={cn("rounded-full px-3 py-1.5 text-xs leading-[1.55] font-semibold text-white", TONES[tone], className)}>
         {children}
      </span>
   );
}
