import type { Metadata } from "next";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/account";
import { SignInPrompt } from "@/components/auth";
import { Button, Container, PageHeader } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { getLocale, getT } from "@/lib/i18n/server";
import { getOrdersForUser } from "@/lib/orders";
import { formatDate, formatPrice } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Your orders") };
}

export default async function OrdersPage() {
   const t = await getT();
   const user = await getCurrentUser();

   if (!user) {
      return (
         <SignInPrompt icon="package" title={t("Your orders")} text={t("Sign in to see everything you've ordered and where it is now.")}>
            <p className="mt-8 text-sm text-ink-2">
               {t("Ordered without an account?")}{" "}
               <Link href="/orders/track" className="font-semibold text-ink underline underline-offset-4 hover:text-cobalt">
                  {t("Find your order")}
               </Link>
            </p>
         </SignInPrompt>
      );
   }

   const orders = await getOrdersForUser(user.id);
   const locale = await getLocale();

   return (
      <>
         <PageHeader title={t("Your orders")} crumbs={[{ label: t("Home"), href: "/" }, { label: t("Account"), href: "/account" }, { label: t("Orders") }]} />
         <Container className="pb-24">
            {orders.length === 0 ? (
               <div className="rounded-panel bg-card px-6 py-20 text-center">
                  <p className="text-xl font-semibold">{t("No orders yet")}</p>
                  <p className="mt-2 text-ink-2">{t("Once you place an order, you can follow it here.")}</p>
                  <div className="mt-8 flex justify-center">
                     <Button href="/new-in">{t("See what's new")}</Button>
                  </div>
               </div>
            ) : (
               <ul className="grid gap-3">
                  {orders.map((order) => (
                     <li key={order.id}>
                        <Link
                           href={`/orders/${order.publicId}`}
                           className="grid grid-cols-1 items-center gap-3 rounded-card bg-card p-6 transition-shadow hover:shadow-float sm:grid-cols-[1fr_auto_auto] sm:gap-8"
                        >
                           <span>
                              <span className="block text-[17px] font-semibold">{t("Order from {date}", { date: formatDate(order.createdAt, locale) })}</span>
                              <span className="text-sm text-ink-3">
                                 {order.items.map((item) => t(item.name)).join(", ")}
                              </span>
                           </span>
                           <span className="font-bold">{formatPrice(order.totalAmount, "USD", locale)}</span>
                           <OrderStatusBadge status={order.status} />
                        </Link>
                     </li>
                  ))}
               </ul>
            )}
         </Container>
      </>
   );
}
