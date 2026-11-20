import type { Metadata } from "next";
import { OrderItems, OrderStatusBadge, TrackOrderForm } from "@/components/account";
import { OrderTotals } from "@/components/cart";
import { Button, Container, Icon, PageHeader } from "@/components/ui";
import { getLocale, getT } from "@/lib/i18n/server";
import { getOrderForViewer } from "@/lib/orders";
import { formatDate } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Your order"), robots: { index: false } };
}

export default async function OrderPage({ params }: PageProps<"/orders/[publicId]">) {
   const t = await getT();
   const { publicId } = await params;
   // Заказ показываем только владельцу или гостю, у которого он запомнен в браузере (см. getOrderForViewer).
   // Чужой, несуществующий и неразрешённый заказ выглядят одинаково: так по ответу не узнать, что есть в базе.
   const order = await getOrderForViewer(publicId);

   if (!order) {
      return (
         <>
            <PageHeader
               title={t("Find your order")}
               description={t("We can't show this order in this browser. Enter the order number and the email you used at checkout, or sign in to the account that placed it.")}
               crumbs={[{ label: t("Home"), href: "/" }, { label: t("Orders"), href: "/orders" }, { label: t("Find your order") }]}
            />
            <Container className="pb-24">
               <TrackOrderForm defaultOrderNumber={publicId} />
            </Container>
         </>
      );
   }

   const locale = await getLocale();
   const date = formatDate(order.createdAt, locale);
   return (
      <>
         <PageHeader
            title={t("Thank you")}
            description={
               order.email
                  ? t("We've received your order from {date}. A confirmation goes to {email}.", { date, email: order.email })
                  : t("We've received your order from {date}.", { date })
            }
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Order") }]}
            action={<OrderStatusBadge status={order.status} />}
         />

         <Container className="pb-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
               <section aria-labelledby="items-title">
                  <h2 id="items-title" className="mb-5 font-display text-[28px] uppercase">
                     {t("What you ordered")}
                  </h2>
                  <OrderItems items={order.items} />
                  <p className="mt-6 text-sm text-ink-3">
                     {t("Order number:")} <b className="font-mono font-semibold text-ink-2 select-all">{order.publicId}</b>{t(". Keep it: with your email it lets you find this order later.")}
                  </p>
               </section>

               <aside className="grid h-fit gap-8 rounded-panel bg-card p-6 md:p-8">
                  <div>
                     <h2 className="mb-4 font-display text-[28px] uppercase">{t("Delivery")}</h2>
                     <p className="flex gap-3 text-[15px] text-ink-2">
                        <Icon name="pin" className="mt-0.5 size-5" />
                        <span>
                           <b className="block text-ink">{order.name}</b>
                           <span className="whitespace-pre-line">{order.address}</span>
                           <span className="mt-1 block">{order.phone}</span>
                        </span>
                     </p>
                     {order.comment && <p className="mt-3 text-sm text-ink-3">{t("Note: {comment}", { comment: order.comment })}</p>}
                  </div>
                  <div>
                     <h2 className="mb-4 font-display text-[28px] uppercase">{t("Total")}</h2>
                     <OrderTotals
                        subtotal={order.totalAmount - order.shipping + order.discount}
                        discount={order.discount}
                        shipping={order.shipping}
                        total={order.totalAmount}
                        promoCode={order.promoCode}
                     />
                     <p className="mt-4 text-sm text-ink-3">{t("Pay on delivery.")}</p>
                  </div>
                  <Button href="/new-in" variant="outline" className="w-full">
                     {t("Keep shopping")}
                  </Button>
               </aside>
            </div>
         </Container>
      </>
   );
}
