import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/account";
import { Container, PageHeader } from "@/components/ui";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Find your order"), robots: { index: false } };
}

export default async function TrackOrderPage() {
   const t = await getT();

   return (
      <>
         <PageHeader
            title={t("Find your order")}
            description={t("Ordered without an account? Enter your order number and the email you used at checkout.")}
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Orders"), href: "/orders" }, { label: t("Find your order") }]}
         />
         <Container className="pb-24">
            <TrackOrderForm />
         </Container>
      </>
   );
}
