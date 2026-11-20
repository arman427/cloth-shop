"use client";

import { useRef, type KeyboardEvent } from "react";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

export interface TabItem<T extends string> {
   value: T;
   label: string;
}

interface TabsProps<T extends string> {
   items: TabItem<T>[];
   value: T;
   onChange: (value: T) => void;
   label: string;
   className?: string;
}

/** Pill segmented control. Arrow keys move between tabs. */
export function Tabs<T extends string>({ items, value, onChange, label, className }: TabsProps<T>) {
   const refs = useRef<(HTMLButtonElement | null)[]>([]);
   const t = useT();

   const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + step + items.length) % items.length;
      onChange(items[next].value);
      refs.current[next]?.focus();
   };

   return (
      <div role="tablist" aria-label={t(label)} className={cn("flex gap-1.5 rounded-full bg-paper-2 p-[5px]", className)}>
         {items.map((item, index) => {
            const selected = item.value === value;
            return (
               <button
                  key={item.value}
                  ref={(node) => {
                     refs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onChange(item.value)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                     "rounded-full px-4 py-[9px] text-sm leading-[1.55] font-medium transition-colors sm:px-5",
                     selected ? "bg-ink text-white" : "text-ink-2 hover:text-ink",
                  )}
               >
                  {t(item.label)}
               </button>
            );
         })}
      </div>
   );
}
