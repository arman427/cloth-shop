"use client";

import { Icon } from "@/components/ui/Icon";
import { useT } from "@/providers/LocaleProvider";
import { cn } from "@/utils";

interface MediaPlaceholderProps {
   alt: string;
   label: string;
   tone: "light" | "dark";
}

export function MediaPlaceholder({ alt, label, tone }: MediaPlaceholderProps) {
   const t = useT();
   const translatedAlt = t(alt);

   return (
      <div
         role="img"
         aria-label={t("{alt} (photo coming soon)", { alt: translatedAlt })}
         className={cn("absolute inset-0 grid place-items-center", tone === "dark" ? "text-white/40" : "text-ink/35")}
         style={{
            backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, ${
               tone === "dark" ? "rgb(255 255 255 / 0.05)" : "rgb(20 24 31 / 0.035)"
            } 14px 15px)`,
         }}
      >
         <span className="flex flex-col items-center gap-2">
            <Icon name="image" className="size-8" strokeWidth={1.3} />
            <span className="text-xs font-medium">{t(label)}</span>
         </span>
      </div>
   );
}
