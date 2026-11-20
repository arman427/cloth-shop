import type { Metadata } from "next";
import { SignInPrompt } from "@/components/auth";
import { ProductGrid } from "@/components/product";
import { Button, Container, PageHeader } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { getFavoriteProducts } from "@/lib/favorites";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getT();
   return { title: t("Favourites") };
}

export default async function WishlistPage() {
   const t = await getT();
   const user = await getCurrentUser();

   if (!user) {
      return (
         <SignInPrompt
            icon="heart"
            title={t("Your favourites")}
            text={t("Sign in to save pieces you love and find them again on any device.")}
         />
      );
   }

   const products = await getFavoriteProducts(user.id);

   return (
      <>
         <PageHeader
            title={t("Your favourites")}
            description={
               products.length > 0
                  ? t("Saved pieces: {count}", { count: products.length })
                  : undefined
            }
            crumbs={[{ label: t("Home"), href: "/" }, { label: t("Favourites") }]}
         />
         <Container className="pb-24">
            {products.length === 0 ? (
               <div className="rounded-panel bg-card px-6 py-20 text-center">
                  <p className="text-xl font-semibold">{t("Nothing saved yet")}</p>
                  <p className="mt-2 text-ink-2">{t("Tap the heart on any piece to keep it here.")}</p>
                  <div className="mt-8 flex justify-center">
                     <Button href="/new-in">{t("See what's new")}</Button>
                  </div>
               </div>
            ) : (
               <ProductGrid products={products} />
            )}
         </Container>
      </>
   );
}
