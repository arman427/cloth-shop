/**
 * Рисует все векторные картинки сайта в public/images.
 * Запуск из корня проекта:  npx tsx scripts/generate-images.ts
 *
 * Картинки товаров строятся по prisma/catalog-data.ts: для каждого цвета каждого фасона три файла
 * (front, detail, pattern). Если добавили фасон или цвет в каталог — запустите скрипт ещё раз.
 * Остальные картинки (категории, баннеры, журнал, лукбук, ткани, магазины) описаны в scripts/art/scenes.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, STYLES } from "../prisma/catalog-data";
import { STYLE_GARMENT } from "./art/garments";
import { productDetail, productFront, productPattern } from "./art/product";
import { category, coatEdit, fabric, giftCard, journal, knitEdit, lookbook, store, workshop } from "./art/scenes";

const OUT = path.resolve("public/images");
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

let count = 0;
function write(file: string, svg: string) {
   const target = path.join(OUT, file);
   fs.mkdirSync(path.dirname(target), { recursive: true });
   fs.writeFileSync(target, svg);
   count += 1;
}

/* Товары: тот же slug, что создаёт prisma/seed.ts (`${key}-${цвет}`) */
let patternNo = 0;
for (const style of STYLES) {
   const kind = STYLE_GARMENT[style.key];
   if (!kind) throw new Error(`No drawing for style "${style.key}": add it to STYLE_GARMENT in scripts/art/garments.ts`);
   patternNo += 1;
   for (const colourway of style.colors) {
      const slug = `${style.key}-${colourway.color.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const name = `${style.name}, ${colourway.color.toLowerCase()}`;
      write(`products/${slug}/front.svg`, productFront(kind, colourway.hex, name));
      write(`products/${slug}/detail.svg`, productDetail(kind, colourway.hex, `${name}, detail`));
      write(`products/${slug}/pattern.svg`, productPattern(kind, colourway.hex, `${name}, paper pattern`, patternNo));
   }
}

for (const cat of CATEGORIES) write(`categories/${cat.slug}.svg`, category(cat.slug, cat.name));

write("editorial/coat-edit.svg", coatEdit("The winter coat edit"));
write("editorial/knit-edit.svg", knitEdit("Knits in pure merino"));

for (const slug of ["how-a-pattern-becomes-a-coat", "making-wool-last-twenty-years", "why-we-cut-in-runs-of-200", "a-day-in-the-porto-workshop"]) {
   write(`journal/${slug}.svg`, journal(slug, slug.replace(/-/g, " ")));
}
for (const title of ["First frost", "Quiet layers", "Weekday uniform", "Carry it all"]) write(`lookbook/${slugify(title)}.svg`, lookbook(slugify(title), title));
for (const name of ["Boiled wool", "Extra-fine merino", "Dry-waxed cotton", "Washed linen", "Selvedge denim", "Vegetable-tanned leather"]) {
   write(`fabrics/${slugify(name)}.svg`, fabric(slugify(name), `Swatch of ${name.toLowerCase()}`));
}
for (const city of ["Porto", "Lisbon", "London", "Berlin"]) write(`stores/${slugify(city)}.svg`, store(slugify(city), `Vellum store in ${city}`));
write("workshop.svg", workshop("The Vellum workshop in Porto"));
write("gift-card.svg", giftCard("A Vellum gift card"));

console.log(`Wrote ${count} SVG files to ${path.relative(process.cwd(), OUT)}`);
