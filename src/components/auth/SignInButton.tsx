"use client";

import { Icon } from "@/components/ui/Icon";
import { useAuthDialog } from "@/hooks";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

type Variant = "solid" | "outline" | "link";
type Size = "sm" | "lg";

const VARIANTS: Record<Variant, string> = {
   solid: "bg-ink text-white hover:bg-ink/85",
   outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white",
   link: "text-sm font-semibold text-ink underline underline-offset-4 hover:text-cobalt",
};

const SIZES: Record<Size, string> = {
   sm: "h-10 px-5 text-sm",
   lg: "h-13 px-7 text-[15px]",
};

interface SignInButtonProps {
   label?: string;
   /** Какое окно открыть: вход или регистрацию */
   mode?: "login" | "register";
   variant?: Variant;
   size?: Size;
   /** На телефоне показывать только иконку человечка (для шапки, где мало места) */
   iconOnMobile?: boolean;
   className?: string;
}

/** Кнопка, которая открывает окно входа. Используется в шапке и на страницах для гостей. */
export function SignInButton({ label = "Sign in", mode = "login", variant = "solid", size = "sm", iconOnMobile = false, className }: SignInButtonProps) {
   const t = useT();
   const { openAuth } = useAuthDialog();

   return (
      <button
         type="button"
         onClick={() => openAuth(mode)}
         className={cn(
            variant === "link" ? "inline" : cn("inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors", SIZES[size]),
            VARIANTS[variant],
            iconOnMobile && "max-sm:size-10 max-sm:px-0",
            className,
         )}
      >
         {iconOnMobile ? (
            <>
               <Icon name="user" className="size-5 sm:hidden" aria-hidden="true" />
               <span className="max-sm:sr-only">{t(label)}</span>
            </>
         ) : (
            t(label)
         )}
      </button>
   );
}
