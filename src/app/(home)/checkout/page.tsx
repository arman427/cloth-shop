import type { Metadata } from "next";
import { SignInPrompt } from "@/components/auth";
import { OrderTotals } from "@/components/cart";
import { CheckoutForm } from "@/components/checkout";
import { Button, Container, MediaImage, PageHeader, tintFromHex } from "@/components/ui";
import { SIZE_LABEL } from "@/constants/shop";
import { getCurrentUser } from "@/lib/auth/session";
import { getCart } from "@/lib/cart";
import { getLocale, getT } from "@/lib/i18n/server";
import { formatPrice } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Checkout") };
}

export default async function CheckoutPage() {
   const [locale, t, cart, user] = await Promise.all([getLocale(), getT(), getCart(), getCurrentUser()]);

   // Заказ оформляется только из аккаунта
   if (!user) {
      return (
         <SignInPrompt
            icon="bag"
            title="Sign in to check out"
            text="Orders are placed from your account. Sign in to continue to checkout."
         />
      );
   }

   const items = cart.lines.filter((line) => line.available);

   if (items.length === 0 || items.length !== cart.lines.length) {
      return (
         <>
            <PageHeader title={t("Checkout")} crumbs={[{ label: t("Home"), href: "/" }, { label: t("Bag"), href: "/cart" }, { label: t("Checkout") }]} />
            <Container className="pb-24">
               <div className="rounded-panel bg-card px-6 py-20 text-center">
                  <p className="text-xl font-semibold">{items.length === 0 ? t("Your bag is empty") : t("Some pieces have sold out")}</p>
                  <p className="mt-2 text-ink-2">
                     {items.length === 0 ? t("Add something to your bag to check out.") : t("Remove them from your bag to continue.")}
                  </p>
                  <div className="mt-8 flex justify-center">
                     <Button href={items.length === 0 ? "/new-in" : "/cart"}>{items.length === 0 ? t("See what's new") : t("Back to your bag")}</Button>
                  </div>
               </div>
            </Container>
         </>
      );
   }

   return (
      <>
         <PageHeader title={t("Checkout")} crumbs={[{ label: t("Home"), href: "/" }, { label: t("Bag"), href: "/cart" }, { label: t("Checkout") }]} />

         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
               <CheckoutForm
                  signedIn
                  defaults={{
                     name: user.name ?? "",
                     email: user.email,
                     phone: user.phone ?? "",
                     address: user.address ?? "",
                  }}
               />

               <aside className="h-fit rounded-panel bg-card p-6 md:p-8 lg:sticky lg:top-6">
                  <h2 className="font-display text-[28px] uppercase">{t("Your order")}</h2>
                  <ul className="mt-6 divide-y divide-line border-y border-line">
                     {items.map((line) => (
                        <li key={line.variantId} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 py-4">
                           <MediaImage
                              src={line.product.image}
                              alt={t(line.product.name)}
                              tint={tintFromHex(line.product.colorHex)}
                              label=""
                              sizes="64px"
                              className="aspect-[4/5] rounded-lg"
                           />
                           <div className="min-w-0">
                              <p className="truncate text-[15px] font-semibold">{t(line.product.name)}</p>
                              <p className="text-[13px] text-ink-3">
                                 {t(line.product.color)} · {t(SIZE_LABEL[line.size])} · {t("Qty {quantity}", { quantity: line.quantity })}
                              </p>
                           </div>
                           <p className="text-[15px] font-semibold">{formatPrice(line.lineTotal, "USD", locale)}</p>
                        </li>
                     ))}
                  </ul>
                  <div className="mt-6">
                     <OrderTotals {...cart} />
                  </div>
               </aside>
            </div>
         </Container>
      </>
   );
}
