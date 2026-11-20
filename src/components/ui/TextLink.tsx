import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils";

interface TextLinkProps {
   href: string;
   className?: string;
   children: ReactNode;
}

/** Underlined text link used for "View all"-type actions. */
export function TextLink({ href, className, children }: TextLinkProps) {
   return (
      <Link
         href={href}
         className={cn(
            "border-b-[1.5px] border-current pb-[3px] text-[15px] font-semibold whitespace-nowrap transition-colors hover:text-cobalt",
            className,
         )}
      >
         {children}
      </Link>
   );
}
