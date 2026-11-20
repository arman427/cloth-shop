import Link from "next/link";
import { cn } from "@/utils";

interface LogoProps {
   className?: string;
}

export function Logo({ className }: LogoProps) {
   return (
      <Link
         href="/"
         aria-label="Vellum, home"
         className={cn(
            "flex shrink-0 items-center gap-2 font-brand text-[22px] leading-[1.55] tracking-[0.12em] sm:gap-3 sm:text-[28px] sm:tracking-[0.14em] md:text-[34px] lg:text-[28px] xl:text-[34px]",
            className,
         )}
      >
         <svg viewBox="0 0 26 26" fill="none" stroke="#2C44D8" strokeWidth={2} aria-hidden="true" className="size-5 sm:size-[26px]">
            <path d="M3 4 L13 22 L23 4" />
            <path d="M8 4 L18 4" strokeDasharray="2 2" />
         </svg>
         VELLUM
      </Link>
   );
}
