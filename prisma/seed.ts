import { hashPassword } from "../src/lib/auth/password";
import { prisma } from "../src/lib/prisma";
import { CATEGORIES, STYLES, type Style } from "./catalog-data";

/** Предсказуемые остатки без случайности: после каждого seed база одинаковая, а часть размеров всегда распродана. */
function stockFor(seed: number, sizeIndex: number, sizeCount: number): number {
   if (sizeCount === 1) return 3 + (seed % 9); // сумки: 3–11 штук
   const value = (seed * 7 + sizeIndex * 5) % 11;
   return value < 2 ? 0 : value; // примерно каждый пятый размер распродан
}

/**
 * Раскладывает фасоны по кругу: куртка, свитер, рубашка, брюки, сумка, снова куртка и так далее.
 * Последние созданные товары считаются самыми новыми ("New in"), и без этого в новинках
 * оказались бы одни сумки.
 */
function interleaveByCategory(styles: Style[]): Style[] {
   const groups = CATEGORIES.map((category) => styles.filter((style) => style.category === category.slug));
   const result: Style[] = [];
   for (let round = 0; result.length < styles.length; round += 1) {
      for (const group of groups) if (group[round]) result.push(group[round]);
   }
   return result;
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

async function main() {
   console.log("Clearing the database...");
   await prisma.rateLimit.deleteMany();
   await prisma.emailCode.deleteMany();
   await prisma.session.deleteMany();
   await prisma.favorite.deleteMany();
   await prisma.orderItem.deleteMany();
   await prisma.order.deleteMany();
   await prisma.productVariant.deleteMany();
   await prisma.product.deleteMany();
   await prisma.category.deleteMany();
   await prisma.user.deleteMany();
   await prisma.newsletterSubscriber.deleteMany();
   await prisma.contactMessage.deleteMany();

   console.log("Creating demo user...");
   // Пароль хешируется тем же hashPassword(), что и при регистрации, поэтому вход работает.
   await prisma.user.create({
      data: {
         email: "demo@vellum.test",
         password: await hashPassword("demo12345"),
         name: "Demo Customer",
         address: "12 Mercer Street, New York, NY 10013",
         emailVerifiedAt: new Date(),
      },
   });

   console.log("Creating categories...");
   const categoryIds = new Map<string, number>();
   for (const [index, category] of CATEGORIES.entries()) {
      const created = await prisma.category.create({ data: { ...category, sortOrder: index } });
      categoryIds.set(category.slug, created.id);
   }

   console.log("Creating products and variants...");
   let productCount = 0;
   let seed = 0;

   for (const style of interleaveByCategory(STYLES)) {
      for (const colourway of style.colors) {
         seed += 1;
         await prisma.product.create({
            data: {
               name: style.name,
               slug: `${style.key}-${slugify(colourway.color)}`,
               styleCode: style.key,
               description: style.description,
               material: `${style.fabric}, ${colourway.color.toLowerCase()}`,
               price: style.price,
               color: colourway.color,
               colorHex: colourway.hex,
               gender: style.gender,
               badge: colourway.badge ?? null,
               isFeatured: colourway.featured ?? false,
               images: [], // пусто = векторные картинки из public/images по slug (см. src/lib/art.ts); сюда можно положить пути к фото
               categoryId: categoryIds.get(style.category)!,
               variants: {
                  create: style.sizes.map((size, sizeIndex) => ({
                     size,
                     stock: stockFor(seed, sizeIndex, style.sizes.length),
                  })),
               },
            },
         });
         productCount += 1;
      }
   }

   console.log(`Done. Categories: ${CATEGORIES.length}, products: ${productCount}.`);
   console.log("Sign in with demo@vellum.test / demo12345");
}

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (error) => {
      console.error("Seed failed:", error);
      await prisma.$disconnect();
      process.exit(1);
   });
