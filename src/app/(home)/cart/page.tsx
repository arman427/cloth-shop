import type { Metadata } from "next";
import { SignInPrompt } from "@/components/auth";
import { CartLineItem, FreeShippingBar, OrderTotals, PromoForm } from "@/components/cart";
import { Button, Container, PageHeader } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { getCart } from "@/lib/cart";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Your bag") };
}

export default async function CartPage() {
   const [t, user, cart] = await Promise.all([getT(), getCurrentUser(), getCart()]);

   // Корзина есть только у вошедших
   if (!user) {
      return (
         <SignInPrompt
            icon="bag"
            title="Sign in to see your bag"
            text="Your bag is saved to your account. Sign in to add pieces and check out."
         />
      );
   }

   const hasSoldOut = cart.lines.some((line) => !line.available);

   if (cart.lines.length === 0) {
      return (
         <>
            <PageHeader title={t("Your bag")} crumbs={[{ label: t("Home"), href: "/" }, { label: t("Bag") }]} />
            <Container className="pb-24">
               <div className="rounded-panel bg-card px-6 py-20 text-center">
                  <p className="text-xl font-semibold">{t("Your bag is empty")}</p>
                  <p className="mt-2 text-ink-2">{t("Pieces you add will wait for you here.")}</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                     <Button href="/new-in">{t("See what's new")}</Button>
                     <Button href="/shop" variant="outline">
                        {t("Browse all clothing")}
                     </Button>
                  </div>
               </div>
            </Container>
         </>
      );
   }

   return (
      <>
         <PageHeader
            title={t("Your bag")}
            description={t("Pieces: {count}", { count: cart.count })}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Bag") }]}
         />

         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
               <ul className="h-fit divide-y divide-line border-y border-line">
                  {cart.lines.map((line) => (
                     <CartLineItem key={line.variantId} line={line} />
                  ))}
               </ul>

               <aside className="h-fit rounded-panel bg-card p-6 md:p-8 lg:sticky lg:top-6">
                  <h2 className="font-display text-[28px] uppercase">{t("Order summary")}</h2>
                  <div className="mt-6 flex flex-col gap-6">
                     <FreeShippingBar subtotal={cart.subtotal} remaining={cart.freeShippingRemaining} />
                     <PromoForm appliedCode={cart.promoCode} />
                     <OrderTotals {...cart} />
                     {hasSoldOut && <p className="text-sm text-cobalt">{t("Remove the sold-out pieces to continue.")}</p>}
                     {hasSoldOut ? (
                        <Button disabled className="w-full">
                           {t("Checkout")}
                        </Button>
                     ) : (
                        <Button href="/checkout" className="w-full">
                           {t("Checkout")}
                        </Button>
                     )}
                     <Button href="/shop" variant="outline" className="w-full">
                        {t("Keep shopping")}
                     </Button>
                  </div>
               </aside>
            </div>
         </Container>
      </>
   );
}
