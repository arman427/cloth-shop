import {
   CategoryGrid,
   EditorialBanners,
   Hero,
   NewArrivals,
   ProcessSection,
   ReviewsSection,
} from "@/components/home";
import { HERO_FACTS, PROCESS_STEPS, RATING_SUMMARY, REVIEWS } from "@/constants/home";
import { getCategories, getFeaturedProducts, getNewArrivals } from "@/lib/catalog";

export default async function HomePage() {
   // Только кэшированный каталог: личные данные (избранное) сюда не входят и страницу не задерживают
   const [featured, categories, arrivals] = await Promise.all([
      getFeaturedProducts(),
      getCategories(),
      getNewArrivals(12),
   ]);

   // Если в базе не отмечено ни одного isFeatured, в hero показываем самые новые вещи
   const heroProducts = featured.length > 0 ? featured : arrivals.slice(0, 3);

   return (
      <>
         <Hero products={heroProducts} facts={HERO_FACTS} />
         <CategoryGrid categories={categories} />
         <NewArrivals products={arrivals} />
         <ProcessSection steps={PROCESS_STEPS} />
         <EditorialBanners />
         <ReviewsSection summary={RATING_SUMMARY} reviews={REVIEWS} />
      </>
   );
}
