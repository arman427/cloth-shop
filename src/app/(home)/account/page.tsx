import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { OrderStatusBadge, ProfileForm } from "@/components/account";
import { SignInPrompt } from "@/components/auth";
import { Button, Container, Icon, PageHeader } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { getLocale, getT } from "@/lib/i18n/server";
import { getOrdersForUser } from "@/lib/orders";
import { formatDate, formatPrice } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Account") };
}

export default async function AccountPage() {
   const t = await getT();
   const user = await getCurrentUser();

   if (!user) {
      return (
         <SignInPrompt
            icon="user"
            title={t("Your account")}
            text={t("Sign in to see your orders, edit your delivery details and keep your favourites.")}
         />
      );
   }

   const orders = (await getOrdersForUser(user.id)).slice(0, 3);
   const locale = await getLocale();
   const firstName = user.name?.split(" ")[0] || t("there");

   return (
      <>
         <PageHeader
            title={t("Hello, {name}", { name: firstName })}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Account") }]}
            action={
               <form action={logout}>
                  <Button type="submit" variant="outline" size="sm">
                     <Icon name="logout" className="size-[18px]" />
                     {t("Sign out")}
                  </Button>
               </form>
            }
         />

         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
               <section aria-labelledby="profile-title">
                  <h2 id="profile-title" className="mb-6 font-display text-[28px] uppercase">
                     {t("Your details")}
                  </h2>
                  <ProfileForm user={{ name: user.name ?? "", email: user.email, phone: user.phone ?? "", address: user.address ?? "" }} />
               </section>

               <section aria-labelledby="orders-title">
                  <div className="mb-6 flex items-baseline justify-between gap-4">
                     <h2 id="orders-title" className="font-display text-[28px] uppercase">
                        {t("Recent orders")}
                     </h2>
                     {orders.length > 0 && (
                        <Link href="/orders" className="text-sm font-semibold underline underline-offset-4 hover:text-cobalt">
                           {t("View all orders")}
                        </Link>
                     )}
                  </div>

                  {orders.length === 0 ? (
                     <div className="rounded-panel bg-card px-6 py-12 text-center">
                        <Icon name="package" className="mx-auto size-8 text-ink-3" />
                        <p className="mt-4 font-semibold">{t("No orders yet")}</p>
                        <p className="mt-1 text-sm text-ink-2">{t("Your orders will show up here once you place one.")}</p>
                        <Link href="/new-in" className="mt-5 inline-block text-sm font-semibold underline underline-offset-4 hover:text-cobalt">
                           {t("See what's new")}
                        </Link>
                     </div>
                  ) : (
                     <ul className="grid gap-3">
                        {orders.map((order) => (
                           <li key={order.id}>
                              <Link
                                 href={`/orders/${order.publicId}`}
                                 className="flex items-center justify-between gap-4 rounded-card bg-card p-5 transition-shadow hover:shadow-float"
                              >
                                 <span>
                                    <span className="block font-semibold">{formatDate(order.createdAt, locale)}</span>
                                    <span className="text-sm text-ink-3">
                                       {t("Pieces: {count}", { count: order.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString(locale) })} · {formatPrice(order.totalAmount, "USD", locale)}
                                    </span>
                                 </span>
                                 <OrderStatusBadge status={order.status} />
                              </Link>
                           </li>
                        ))}
                     </ul>
                  )}

                  <Link
                     href="/wishlist"
                     className="mt-6 flex items-center justify-between rounded-card border border-line p-5 font-semibold transition-colors hover:border-ink/40"
                  >
                     <span className="flex items-center gap-3">
                        <Icon name="heart" className="size-5" />
                        {t("Your favourites")}
                     </span>
                     <Icon name="arrowRight" className="size-5" />
                  </Link>
               </section>
            </div>
         </Container>
      </>
   );
}
