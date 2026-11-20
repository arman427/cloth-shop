import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

type Variant = "ink" | "outline" | "light";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
   ink: "bg-ink text-white hover:bg-ink/85",
   outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white",
   light: "bg-white text-ink hover:bg-white/85",
};

const SIZES: Record<Size, string> = {
   md: "h-13 px-7",
   sm: "h-12 px-7",
};

interface BaseProps {
   variant?: Variant;
   size?: Size;
   className?: string;
   children: ReactNode;
}

type ButtonAsLink = BaseProps & { href: string };
type ButtonAsButton = BaseProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function buttonClasses(variant: Variant = "ink", size: Size = "md", className?: string) {
   return cn(
      "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors",
      "disabled:cursor-not-allowed disabled:opacity-50",
      VARIANTS[variant],
      SIZES[size],
      className,
   );
}

export function Button({ variant = "ink", size = "md", className, children, ...rest }: ButtonProps) {
   const classes = buttonClasses(variant, size, className);

   if (rest.href !== undefined) {
      return (
         <Link href={rest.href} className={classes}>
            {children}
         </Link>
      );
   }

   const { type = "button", ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
   return (
      <button type={type} className={classes} {...buttonProps}>
         {children}
      </button>
   );
}
