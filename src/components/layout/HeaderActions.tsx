import Link from "next/link";
import { SignInButton } from "@/components/auth";
import { Icon } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { getCartCount } from "@/lib/cart";
import { getFavoriteState } from "@/lib/favorites";
import { getT } from "@/lib/i18n/server";

const ACTION =
   "relative grid size-9 place-items-center rounded-full transition-colors hover:bg-ink/5 sm:size-10";

function Count({ value }: { value: number }) {
   if (value === 0) return null;
   return (
      <i className="absolute top-[3px] right-[0px] grid size-[18px] place-items-center rounded-full bg-cobalt text-[11px] font-bold text-white not-italic">
         {value > 9 ? "9+" : value}
      </i>
   );
}

/**
 * Серверный компонент: читает cookie сессии и корзины, поэтому в Header он завёрнут в <Suspense>.
 * Гость видит кнопку "Sign in", вошедший пользователь видит иконку профиля.
 */
export async function HeaderActions() {
   const [user, cartCount, favorites, t] = await Promise.all([
      getCurrentUser(),
      getCartCount(),
      getFavoriteState(),
      getT(),
   ]);
   const wishlistCount = favorites.ids.length;

   return (
      <div className="-mr-1.5 flex items-center gap-0.5 sm:-mr-[9px] sm:gap-1">
         <Link
            href="/wishlist"
            aria-label={t("Wishlist, {count} items", { count: wishlistCount })}
            className={ACTION}
         >
            <Icon name="heart" />
            <Count value={wishlistCount} />
         </Link>
         <Link
            href="/cart"
            aria-label={t("Bag, {count} items", { count: cartCount })}
            className={ACTION}
         >
            <Icon name="bag" />
            <Count value={cartCount} />
         </Link>
         {user ? (
            <Link href="/account" aria-label={t("Account")} className={ACTION}>
               <Icon name="user" />
            </Link>
         ) : (
            <SignInButton iconOnMobile className="ml-1 sm:ml-1.5" />
         )}
      </div>
   );
}

/** Пока сервер читает cookie: те же иконки без счётчиков и без кнопки входа, чтобы шапка не прыгала. */
export function HeaderActionsFallback() {
   return (
      <div className="-mr-1.5 flex items-center gap-0.5 sm:-mr-[9px] sm:gap-1" aria-hidden="true">
         <span className={ACTION}>
            <Icon name="heart" />
         </span>
         <span className={ACTION}>
            <Icon name="bag" />
         </span>
         <span className="ml-1 size-10 sm:ml-1.5 sm:w-[84px]" />
      </div>
   );
}
