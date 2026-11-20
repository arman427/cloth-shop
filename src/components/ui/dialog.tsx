"use client";

/**
 * Dialog в стиле shadcn/ui: тонкая обёртка над @radix-ui/react-dialog.
 * Radix даёт всё сложное: фокус внутри окна, закрытие по Esc, aria-атрибуты,
 * блокировку прокрутки страницы. Мы только добавляем внешний вид.
 *
 * Анимации описаны в globals.css (@keyframes dialog-*, sheet-*) и включаются
 * по атрибуту data-state="open" | "closed", который Radix ставит сам.
 */
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, ComponentRef, HTMLAttributes } from "react";
import { forwardRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = forwardRef<ComponentRef<typeof DialogPrimitive.Overlay>, ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
   ({ className, ...props }, ref) => (
      <DialogPrimitive.Overlay
         ref={ref}
         className={cn(
            "fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px]",
            "data-[state=open]:animate-[overlay-in_200ms_ease-out] data-[state=closed]:animate-[overlay-out_150ms_ease-in_forwards]",
            className,
         )}
         {...props}
      />
   ),
);
DialogOverlay.displayName = "DialogOverlay";

interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
   /** "center" is a modal; "left" is a side sheet (mobile menu) */
   placement?: "center" | "left";
   hideClose?: boolean;
}

const DialogContent = forwardRef<ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(
   ({ className, children, placement = "center", hideClose = false, ...props }, ref) => {
      const t = useT();

      return (
         <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
               ref={ref}
               className={cn(
                  "fixed z-50 bg-card text-ink shadow-float outline-none",
                  placement === "center" &&
                     "top-1/2 left-1/2 max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-panel p-6 sm:p-8 " +
                        "data-[state=open]:animate-[dialog-in_240ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[dialog-out_150ms_ease-in_forwards]",
                  placement === "left" &&
                     "inset-y-0 left-0 w-[min(340px,88vw)] overflow-y-auto p-6 " +
                        "data-[state=open]:animate-[sheet-in_280ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[sheet-out_200ms_ease-in_forwards]",
                  className,
               )}
               {...props}
            >
               {children}
               {!hideClose && (
                  <DialogPrimitive.Close
                     aria-label={t("Close")}
                     className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                     <Icon name="x" className="size-5" />
                  </DialogPrimitive.Close>
               )}
            </DialogPrimitive.Content>
         </DialogPortal>
      );
   },
);
DialogContent.displayName = "DialogContent";

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
   return <div className={cn("flex flex-col gap-2 pr-8", className)} {...props} />;
}

const DialogTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
   ({ className, ...props }, ref) => (
      <DialogPrimitive.Title ref={ref} className={cn("font-display text-[32px] leading-[1.15] uppercase", className)} {...props} />
   ),
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<
   ComponentRef<typeof DialogPrimitive.Description>,
   ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
   <DialogPrimitive.Description ref={ref} className={cn("text-[15px] text-ink-2", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
