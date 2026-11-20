import { ART } from "@/lib/art";
import type { Fabric, JobOpening, JournalPost, LookbookScene, Store } from "@/types";

/* Редакционный текст сайта. Картинки — векторные иллюстрации из public/images (scripts/generate-images.ts).
   Чтобы поставить фото, замени путь в поле image (например "/images/journal-1.jpg"). */

export const JOURNAL_POSTS: JournalPost[] = [
   {
      slug: "how-a-pattern-becomes-a-coat",
      image: ART.journal("how-a-pattern-becomes-a-coat"),
      title: "How a pattern becomes a coat",
      excerpt: "Forty-one paper pieces, three fittings and one very patient pattern cutter.",
      date: "12 November 2026",
      readTime: "5 min read",
      body: [
         "Every Vellum coat begins as a flat drawing on brown paper. Inês, our head pattern cutter, draws each piece by hand: the front, the back, the undercollar, the pocket bags. A single coat is forty-one pieces before it is ever cut in cloth.",
         "The first version is made in calico, a plain cotton that costs very little and forgives mistakes. We fit it on three different bodies, mark where it pulls or gapes, and go back to the paper. Most coats go through three rounds before we are happy.",
         "Only then do we cut in wool. The cutter lays the pattern pieces along the grain of the cloth so the coat hangs straight and does not twist with wear. It is slow work, and it is the reason a Harbour Coat still fits well in its fifth winter.",
      ],
   },
   {
      slug: "making-wool-last-twenty-years",
      image: ART.journal("making-wool-last-twenty-years"),
      title: "Making wool last twenty years",
      excerpt: "Less washing, more airing, and a few tools worth owning.",
      date: "29 October 2026",
      readTime: "4 min read",
      body: [
         "Wool is self-cleaning, up to a point. The fibres shed odour and moisture when they are left to air, so a coat or sweater needs washing far less often than most people think. Hang it by an open window overnight and it is usually fresh again by morning.",
         "When a knit does need a wash, use the wool cycle at 30 degrees with a gentle detergent, then dry it flat. Hanging a wet sweater stretches it, because the weight of the water pulls the shoulders down.",
         "Keep a fabric comb and a clothes brush. A comb removes the small pills that form where fabric rubs, and a brush lifts dust from the surface of a coat before it settles in. Ten minutes a season adds years to a garment.",
      ],
   },
   {
      slug: "why-we-cut-in-runs-of-200",
      image: ART.journal("why-we-cut-in-runs-of-200"),
      title: "Why we cut in runs of 200",
      excerpt: "Small batches cost more per piece. Here is why we do it anyway.",
      date: "14 October 2026",
      readTime: "3 min read",
      body: [
         "Most clothing is made in runs of thousands, based on a guess about what will sell. When the guess is wrong, the surplus is discounted, burned or buried. We would rather make less and be sure.",
         "A run of 200 means we can order fabric in amounts a small mill can weave for us, and trace it back to the loom. It also means a piece can sell out. When it does, we tell you, and when we make it again we cut it fresh.",
         "It is not the cheapest way to make clothes. It is the way that lets us do the pressing, the bar tacks and the final inspection ourselves, every time.",
      ],
   },
   {
      slug: "a-day-in-the-porto-workshop",
      image: ART.journal("a-day-in-the-porto-workshop"),
      title: "A day in the Porto workshop",
      excerpt: "Fourteen people, one long table and a lot of pressing.",
      date: "2 October 2026",
      readTime: "6 min read",
      body: [
         "The workshop opens at eight, when the light comes in over the cutting table. By nine the first bundles of cut cloth are moving to the sewing room, where each maker follows a piece from the first seam to the last.",
         "Lunch is shared and takes an hour. People who spend the morning at machines tend to spend it talking about fabric, and some of our best changes to a pattern started as a remark across the table.",
         "At the end of the day, every finished piece is pressed, checked against its measurement sheet and hung. Anything that is not right goes back to the maker, who fixes it before the piece leaves the building.",
      ],
   },
];

export const STORES: Store[] = [
   {
      city: "Porto",
      image: ART.store("porto"),
      name: "Vellum Workshop & Store",
      address: ["Rua das Flores 148", "4050-262 Porto", "Portugal"],
      hours: ["Mon to Sat: 10:00 to 19:00", "Sun: closed"],
      phone: "+351 22 000 0148",
   },
   {
      city: "Lisbon",
      image: ART.store("lisbon"),
      name: "Vellum Chiado",
      address: ["Rua Garrett 62", "1200-203 Lisbon", "Portugal"],
      hours: ["Mon to Sat: 10:30 to 20:00", "Sun: 12:00 to 18:00"],
      phone: "+351 21 000 0062",
   },
   {
      city: "London",
      image: ART.store("london"),
      name: "Vellum Marylebone",
      address: ["27 Chiltern Street", "London W1U 7PN", "United Kingdom"],
      hours: ["Mon to Sat: 10:00 to 18:30", "Sun: 11:00 to 17:00"],
      phone: "+44 20 0000 0027",
   },
   {
      city: "Berlin",
      image: ART.store("berlin"),
      name: "Vellum Mitte",
      address: ["Almstadtstraße 34", "10119 Berlin", "Germany"],
      hours: ["Mon to Sat: 11:00 to 19:00", "Sun: closed"],
      phone: "+49 30 0000 0034",
   },
];

export const JOB_OPENINGS: JobOpening[] = [
   {
      title: "Pattern cutter",
      team: "Workshop",
      location: "Porto",
      type: "Full time",
      summary: "Draft and grade patterns for outerwear and tailoring. You have at least five years at the table and an eye for fit.",
   },
   {
      title: "Sewing machinist",
      team: "Workshop",
      location: "Porto",
      type: "Full time",
      summary: "Make garments from first seam to last in a small team. Experience with wool and unlined coats is a plus.",
   },
   {
      title: "Customer care specialist",
      team: "Customer care",
      location: "Remote, Europe",
      type: "Full time",
      summary: "Help customers with sizing, orders and repairs, by email and chat. You write clearly and enjoy solving problems.",
   },
   {
      title: "Store associate",
      team: "Retail",
      location: "London",
      type: "Part time",
      summary: "Look after customers in our Marylebone store, from fittings to repairs intake. Weekends required.",
   },
];

export const FABRICS: Fabric[] = [
   {
      name: "Boiled wool",
      image: ART.fabric("boiled-wool"),
      origin: "Tyrol, Austria",
      weight: "540 g/m²",
      care: "Dry clean or hand wash cold",
      text: "Knitted, then shrunk with steam and pressure until it is dense and almost water-resistant. Used for our coats.",
   },
   {
      name: "Extra-fine merino",
      image: ART.fabric("extra-fine-merino"),
      origin: "Biella, Italy",
      weight: "Fine gauge, 12 gg",
      care: "Machine wash on the wool cycle",
      text: "Spun from fibres under 18.5 microns, which is why it feels soft rather than itchy against the skin.",
   },
   {
      name: "Dry-waxed cotton",
      image: ART.fabric("dry-waxed-cotton"),
      origin: "Lancashire, England",
      weight: "340 g/m²",
      care: "Spot clean, re-wax yearly",
      text: "Woven tight, then coated with a dry wax that resists rain and ages with creases and fades, like a good pair of boots.",
   },
   {
      name: "Washed linen",
      image: ART.fabric("washed-linen"),
      origin: "Normandy, France",
      weight: "190 g/m²",
      care: "Machine wash at 30°C",
      text: "European flax, woven and stone-washed so it is soft from the first day and gets softer with every wash.",
   },
   {
      name: "Selvedge denim",
      image: ART.fabric("selvedge-denim"),
      origin: "Okayama, Japan",
      weight: "13 oz",
      care: "Wash rarely, inside out, cold",
      text: "Woven on narrow shuttle looms, which leave a self-finished edge. It is rigid at first and then moulds to you.",
   },
   {
      name: "Vegetable-tanned leather",
      image: ART.fabric("vegetable-tanned-leather"),
      origin: "Tuscany, Italy",
      weight: "1.4 mm",
      care: "Wipe clean, condition twice a year",
      text: "Tanned for weeks in tree bark rather than chemicals. It starts pale and darkens beautifully with use.",
   },
];

export const LOOKBOOK_SCENES: LookbookScene[] = [
   {
      title: "First frost",
      image: ART.lookbook("first-frost"),
      caption: "Coats and boiled wool for the first cold week of the year.",
      href: "/shop/outerwear",
      cta: "Shop outerwear",
   },
   {
      title: "Quiet layers",
      image: ART.lookbook("quiet-layers"),
      caption: "Merino, lambswool and a soft rollneck, layered in oat and rust.",
      href: "/shop/knitwear",
      cta: "Shop knitwear",
   },
   {
      title: "Weekday uniform",
      image: ART.lookbook("weekday-uniform"),
      caption: "An oxford shirt, a pleated trouser and a leather tote.",
      href: "/men",
      cta: "Shop men",
   },
   {
      title: "Carry it all",
      image: ART.lookbook("carry-it-all"),
      caption: "Bags in vegetable-tanned leather and waxed canvas.",
      href: "/bags",
      cta: "Shop bags",
   },
];

export const WORKSHOP_FIGURES = [
   { value: "14", label: "makers in the Porto workshop" },
   { value: "200", label: "pieces at most in a single run" },
   { value: "41", label: "paper pieces in one coat pattern" },
] as const;

export const GIFT_CARD_AMOUNTS = [5000, 10000, 20000] as const;

export const HELP_LINKS = [
   { label: "Shipping", href: "/help/shipping", description: "Delivery times, costs and tracking." },
   { label: "Returns", href: "/help/returns", description: "Send it back within 30 days, for free." },
   { label: "Size guide", href: "/help/size-guide", description: "Measurements for every size." },
   { label: "Free repairs", href: "/help/repairs", description: "How we mend what you love." },
   { label: "Contact us", href: "/help/contact", description: "Write to us, we reply within a day." },
] as const;
