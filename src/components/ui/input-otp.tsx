"use client";

/**
 * Поле ввода кода по ячейкам, в стиле shadcn/ui (InputOTP).
 * Под капотом библиотека `input-otp`: npm i input-otp
 *
 * Внутри один настоящий <input>, а ячейки только рисуют его символы. Поэтому работают
 * вставка из буфера, автозаполнение кода из SMS/почты и подсказка браузера.
 */
import { OTPInput, OTPInputContext } from "input-otp";
import { useContext, type ComponentProps } from "react";
import { cn } from "@/utils";

export function InputOTP({
   className,
   containerClassName,
   ...props
}: ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
   return (
      <OTPInput
         data-slot="input-otp"
         containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
         className={cn("disabled:cursor-not-allowed", className)}
         {...props}
      />
   );
}

export function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
   return <div data-slot="input-otp-group" className={cn("flex items-center gap-2", className)} {...props} />;
}

export function InputOTPSlot({ index, className, ...props }: ComponentProps<"div"> & { index: number }) {
   const context = useContext(OTPInputContext);
   const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {};

   return (
      <div
         data-slot="input-otp-slot"
         data-active={isActive}
         className={cn(
            "relative flex h-14 w-11 items-center justify-center rounded-xl border border-line bg-card text-xl font-semibold text-ink transition-colors",
            "data-[active=true]:border-ink data-[active=true]:ring-2 data-[active=true]:ring-ink/15",
            className,
         )}
         {...props}
      >
         {char}
         {hasFakeCaret && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
               <div className="animate-caret-blink h-6 w-px bg-ink" />
            </div>
         )}
      </div>
   );
}

export function InputOTPSeparator({ ...props }: ComponentProps<"div">) {
   return (
      <div data-slot="input-otp-separator" role="separator" {...props}>
         <span className="block h-px w-2.5 bg-ink-3" />
      </div>
   );
}
