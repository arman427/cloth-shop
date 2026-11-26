import type { HeroFact, ProcessStep, RatingSummary, Review } from "@/types";

/* Products, categories and prices come from the database (see lib/catalog.ts).
   Only editorial copy that is not a database record lives here. */

export const HERO_FACTS: HeroFact[] = [
   { title: "Made in Portugal", text: "Every piece, start to finish." },
   { title: "Free repairs for life", text: "Send it back, we mend it." },
   { title: "4.8", text: "From 3,200 reviews.", rating: 4.8 },
];

/** Студийные фото для слайдов hero по slug товара. Если фото нет, берётся первая картинка товара. */
export const HERO_IMAGES: Record<string, string> = {
   "field-overshirt-ochre": "/images/hero/field-overshirt-ochre.jpg",
};

export const PROCESS_STEPS: ProcessStep[] = [
   {
      title: "Drafted on paper",
      text: "Our pattern cutter builds every size by hand, so a size M fits like a size M.",
   },
   {
      title: "Cut in runs of 200",
      text: "Small batches mean almost no deadstock and fabric we can trace to the mill.",
   },
   {
      title: "Finished by hand",
      text: "Buttons, bar tacks and pressing are done by the same team that sews the piece.",
   },
];

export const RATING_SUMMARY: RatingSummary = {
   average: 4.8,
   total: 3214,
   breakdown: [
      { stars: 5, count: 2764 },
      { stars: 4, count: 322 },
      { stars: 3, count: 91 },
      { stars: 2, count: 24 },
      { stars: 1, count: 13 },
   ],
};

export const REVIEWS: Review[] = [
   {
      id: 1,
      quote: "I've worn the Field Overshirt three winters running. The canvas has softened, the seams haven't moved, and when a button came loose they sewed it back on for free.",
      author: "Marta R., Lisbon",
      initials: "MR",
      purchase: "Bought the Field Overshirt in ochre, size S",
   },
   {
      id: 2,
      quote: "The Harbour Coat is the first coat I've owned that fits over a blazer without looking borrowed. Heavy enough for Berlin in January.",
      author: "Jonas K., Berlin",
      initials: "JK",
      purchase: "Bought the Harbour Coat in navy, size M",
   },
   {
      id: 3,
      quote: "I wash the Merino Crew on the wool cycle every week. Two years in, no pilling and the cuffs still hold their shape.",
      author: "Priya S., London",
      initials: "PS",
      purchase: "Bought the Merino Crew in rust, size XS",
   },
   {
      id: 4,
      quote: "Finally, a pair of trousers that doesn't need replacing after one season. The fit is relaxed without looking oversized, and the fabric feels incredibly substantial.",
      author: "Oliver T., Copenhagen",
      initials: "OT",
      purchase: "Bought the Utility Trousers in olive, size M",
   },
   {
      id: 5,
      quote: "The attention to detail is what got me. Beautiful stitching, solid buttons and a fabric that feels like it will last for years. Already planning my next order.",
      author: "Elena V., Amsterdam",
      initials: "EV",
      purchase: "Bought the Field Overshirt in charcoal, size S",
   },
   {
      id: 6,
      quote: "I've worn this almost every day since it arrived. It works just as well with jeans as it does with smarter trousers. One of those rare pieces that makes getting dressed easier.",
      author: "Thomas B., Stockholm",
      initials: "TB",
      purchase: "Bought the Harbour Coat in sand, size L",
   },
   {
      id: 7,
      quote: "The knit is wonderfully soft without feeling delicate. I've worn it to work, on weekend walks and while travelling. It still looks exactly as it did on day one.",
      author: "Sophie M., Paris",
      initials: "SM",
      purchase: "Bought the Merino Crew in oatmeal, size S",
   },
   {
      id: 8,
      quote: "Sizing was spot on and the quality exceeded my expectations. The jacket has a lovely weight to it, and the colour is even better in person.",
      author: "Daniel F., Edinburgh",
      initials: "DF",
      purchase: "Bought the Field Overshirt in forest, size L",
   },
   {
      id: 9,
      quote: "I was hesitant about spending more on everyday clothing, but after six months I understand the difference. It wears beautifully and hasn't lost its shape.",
      author: "Amelia W., Melbourne",
      initials: "AW",
      purchase: "Bought the Utility Trousers in stone, size S",
   },
   {
      id: 10,
      quote: "A genuinely timeless coat. No unnecessary details, just a great silhouette and excellent materials. I've received more compliments on this than anything else I own.",
      author: "Lucas H., Zurich",
      initials: "LH",
      purchase: "Bought the Harbour Coat in charcoal, size M",
   },
];
