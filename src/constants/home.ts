import type { HeroFact, ProcessStep, RatingSummary, Review } from "@/types";

/* Products, categories and prices come from the database (see lib/catalog.ts).
   Only editorial copy that is not a database record lives here. */

export const HERO_FACTS: HeroFact[] = [
   { title: "Made in Portugal", text: "Every piece, start to finish." },
   { title: "Free repairs for life", text: "Send it back, we mend it." },
   { title: "4.8", text: "From 3,200 reviews.", rating: 4.8 },
];

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
];
