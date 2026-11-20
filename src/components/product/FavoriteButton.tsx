"use client";

import { Suspense, useOptimistic, useState, useTransition } from "react";
import { toggleFavorite } from "@/actions/favorites";
import { Icon } from "@/components/ui";
import { useAuthDialog } from "@/hooks";
import { useT } from "@/providers/LocaleProvider";
import { useViewer } from "@/providers/ViewerProvider";
import { cn } from "@/utils";

interface FavoriteButtonProps {
   productId: number;
   name: string;
   /** overlay: белый кружок поверх фото; outline: кнопка рядом с "Add to bag" */
   variant?: "overlay" | "outline";
   className?: string;
}

const buttonClasses = (variant: FavoriteButtonProps["variant"], className?: string) =>
   cn(
      "grid place-items-center rounded-full transition-colors hover:text-cobalt",
      variant === "overlay" ? "size-10 bg-white" : "relative size-13 border-[1.5px] border-ink hover:bg-ink/5",
      className,
   );

/**
 * Сердечко. Избранное и статус входа приходят из ViewerProvider потоком, поэтому кнопка
 * в своём <Suspense>: пока данных нет, показывается пустое сердечко, а карточка товара уже видна.
 */
export function FavoriteButton(props: FavoriteButtonProps) {
   return (
      <Suspense fallback={<FavoriteButtonPlaceholder {...props} />}>
         <FavoriteButtonInner {...props} />
      </Suspense>
   );
}

function FavoriteButtonPlaceholder({ name, variant = "overlay", className }: FavoriteButtonProps) {
   const t = useT();
   return (
      <button
         type="button"
         disabled
         aria-busy="true"
         aria-label={t("Save {name} to favourites", { name: t(name) })}
         className={buttonClasses(variant, className)}
      >
         <Icon name="heart" className="size-[18px]" />
      </button>
   );
}

function FavoriteButtonInner({ productId, name, variant = "overlay", className }: FavoriteButtonProps) {
   const t = useT();
   const viewer = useViewer();
   const favorite = viewer.ids.includes(productId);
   const { openAuth } = useAuthDialog();
   const [pending, startTransition] = useTransition();
   const [failed, setFailed] = useState(false);
   // useOptimistic: сердечко закрашивается сразу, не дожидаясь ответа сервера.
   // Если действие не удалось, после перерисовки вернётся значение из ViewerProvider.
   const [optimistic, setOptimistic] = useOptimistic(favorite);

   const onClick = () => {
      setFailed(false);
      if (!viewer.signedIn) {
         openAuth("login");
         return;
      }

      startTransition(async () => {
         setOptimistic(!optimistic);
         try {
            const result = await toggleFavorite(productId);
            if (!result.ok && result.error === "unauthenticated") openAuth("login");
            else if (!result.ok) setFailed(true);
         } catch {
            setFailed(true);
         }
      });
   };

   return (
      <button
         type="button"
         onClick={onClick}
         disabled={pending}
         aria-pressed={optimistic}
         aria-label={
            optimistic
               ? t("Remove {name} from favourites", { name: t(name) })
               : t("Save {name} to favourites", { name: t(name) })
         }
         className={buttonClasses(variant, className)}
      >
         <Icon name="heart" filled={optimistic} className={cn("size-[18px]", optimistic && "text-cobalt")} />
         {failed && <span role="alert" className="absolute top-full right-0 z-10 mt-1 w-48 rounded-lg bg-ink p-2 text-sm text-white">{t("Couldn't update your favourites. Try again.")}</span>}
      </button>
   );
}
