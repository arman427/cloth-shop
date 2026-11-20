"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Icon } from "@/components/ui/Icon";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

const CONTROL =
   "w-full rounded-xl border border-line bg-card px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 hover:border-ink/30 focus:border-ink";
const CONTROL_ERROR = "border-cobalt hover:border-cobalt focus:border-cobalt";

interface ShellProps {
   id: string;
   label: string;
   error?: string;
   hint?: string;
   className?: string;
   children: ReactNode;
}

function FieldShell({ id, label, error, hint, className, children }: ShellProps) {
   const t = useT();

   return (
      <div className={cn("flex flex-col gap-1.5", className)}>
         <label htmlFor={id} className="text-sm font-semibold">
            {t(label)}
         </label>
         {children}
         {error ? (
            <p id={`${id}-error`} className="text-[13px] text-cobalt">
               {t(error)}
            </p>
         ) : hint ? (
            <p id={`${id}-hint`} className="text-[13px] text-ink-3">
               {t(hint)}
            </p>
         ) : null}
      </div>
   );
}

function describedBy(id: string, error?: string, hint?: string) {
   return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

interface FieldBaseProps {
   label: string;
   error?: string;
   hint?: string;
   wrapperClassName?: string;
}

/* ───────────── Input ───────────── */

export function Field({ label, error, hint, wrapperClassName, className, id, ...rest }: FieldBaseProps & InputHTMLAttributes<HTMLInputElement>) {
   const autoId = useId();
   const fieldId = id ?? autoId;

   return (
      <FieldShell id={fieldId} label={label} error={error} hint={hint} className={wrapperClassName}>
         <input
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(fieldId, error, hint)}
            className={cn(CONTROL, "h-12", error && CONTROL_ERROR, className)}
            {...rest}
         />
      </FieldShell>
   );
}

/* ───────────── Password with show/hide ───────────── */

export function PasswordField({
   label,
   error,
   hint,
   wrapperClassName,
   className,
   id,
   ...rest
}: FieldBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
   const autoId = useId();
   const fieldId = id ?? autoId;
   const [visible, setVisible] = useState(false);
   const t = useT();

   return (
      <FieldShell id={fieldId} label={label} error={error} hint={hint} className={wrapperClassName}>
         <div className="relative">
            <input
               id={fieldId}
               type={visible ? "text" : "password"}
               aria-invalid={error ? true : undefined}
               aria-describedby={describedBy(fieldId, error, hint)}
               className={cn(CONTROL, "h-12 pr-12", error && CONTROL_ERROR, className)}
               {...rest}
            />
            <button
               type="button"
               onClick={() => setVisible((value) => !value)}
               aria-label={visible ? t("Hide password") : t("Show password")}
               aria-pressed={visible}
               className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-colors hover:text-ink"
            >
               <Icon name={visible ? "eyeOff" : "eye"} className="size-5" />
            </button>
         </div>
      </FieldShell>
   );
}

/* ───────────── Textarea ───────────── */

export function TextAreaField({
   label,
   error,
   hint,
   wrapperClassName,
   className,
   id,
   ...rest
}: FieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
   const autoId = useId();
   const fieldId = id ?? autoId;

   return (
      <FieldShell id={fieldId} label={label} error={error} hint={hint} className={wrapperClassName}>
         <textarea
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(fieldId, error, hint)}
            className={cn(CONTROL, "min-h-28 resize-y py-3", error && CONTROL_ERROR, className)}
            {...rest}
         />
      </FieldShell>
   );
}

/* ───────────── Select ───────────── */

export function SelectField({
   label,
   error,
   hint,
   wrapperClassName,
   className,
   id,
   children,
   ...rest
}: FieldBaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
   const autoId = useId();
   const fieldId = id ?? autoId;

   return (
      <FieldShell id={fieldId} label={label} error={error} hint={hint} className={wrapperClassName}>
         <div className="relative">
            <select
               id={fieldId}
               aria-invalid={error ? true : undefined}
               aria-describedby={describedBy(fieldId, error, hint)}
               className={cn(CONTROL, "h-12 appearance-none pr-10", error && CONTROL_ERROR, className)}
               {...rest}
            >
               {children}
            </select>
            <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-3" />
         </div>
      </FieldShell>
   );
}

/** Сообщение об ошибке над кнопкой формы */
export function FormError({ children }: { children?: ReactNode }) {
   if (!children) return null;
   return (
      <p role="alert" className="rounded-xl border border-cobalt/30 bg-cobalt/5 px-4 py-3 text-sm text-cobalt">
         {children}
      </p>
   );
}
