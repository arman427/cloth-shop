/**
 * Картинки для всего, что не товар: плитки категорий, баннеры главной, журнал, лукбук,
 * ткани, магазины, мастерская и подарочная карта. Собраны из тех же рисунков вещей.
 */
import { GARMENTS, type GarmentKind } from "./garments";
import { COBALT, COBALT_SOFT, darken, INK, lighten, mix, PAPER } from "./color";
import { svgDoc } from "./defs";

/** Поставить вещь: x, y — левый верхний угол рамки 400 × 480, s — масштаб, r — поворот вокруг центра */
const put = (kind: GarmentKind, color: string, x: number, y: number, s = 1, r = 0, shadow = true) =>
   `<g transform="translate(${x} ${y}) scale(${s}) rotate(${r} 200 240)"${shadow ? ` filter="url(#drop)"` : ""}>${GARMENTS[kind](color)}</g>`;

const hangerAt = (cx: number, y: number, s = 1) => `<g transform="translate(${cx} ${y}) scale(${s})" fill="none" stroke-linecap="round">
  <path d="M0 0 Q0 -26 18 -26 Q34 -24 32 -8" stroke="#8d8a83" stroke-width="5"/>
  <path d="M0 0 L0 14" stroke="#8d8a83" stroke-width="5"/>
  <path d="M-112 66 Q-66 30 0 14 Q66 30 112 66" stroke="#7a5a3c" stroke-width="11"/>
</g>`;

const sans = `font-family="'Arial Narrow', 'Helvetica Neue', Arial, sans-serif"`;
const mono = `font-family="ui-monospace, 'DejaVu Sans Mono', Menlo, monospace"`;

/* ───────────── Categories (600 × 640, прозрачный фон: цвет даёт плитка) ───────────── */

export function category(slug: string, label: string) {
   const W = 600;
   const H = 640;
   const scenes: Record<string, string> = {
      outerwear: put("coat", "#B58B5A", 40, 60, 1.05, -6) + put("overshirt", "#C08A2B", 190, 140, 0.95, 6),
      knitwear: put("sweater", "#D9CDB4", 30, 90, 0.95, -7) + put("cardigan", "#2F4A3A", 200, 150, 0.9, 5) + put("polo", "#B5532F", 120, 230, 0.75, -2),
      shirts: put("shirt", "#A9C1D9", 30, 80, 1, -6) + put("tee", "#B5532F", 200, 170, 0.9, 7),
      trousers: put("pleated", "#3A3D42", 40, 70, 1.05, -5) + put("chino", "#A89A74", 190, 120, 1, 6),
      bags: put("tote", "#B58B5A", 20, 60, 1, -5) + put("crossbody", "#B5532F", 230, 210, 0.85, 6) + put("card-holder", "#14181F", 150, 380, 0.55, -10),
   };
   return svgDoc(W, H, scenes[slug] ?? "", label);
}

/* ───────────── Home editorial banners (500 × 660) ───────────── */

export function coatEdit(label: string) {
   const rail = `<path d="M30 92 H470" stroke="#2b2724" stroke-width="10" stroke-linecap="round"/>
<path d="M60 92 V20 M440 92 V20" stroke="#2b2724" stroke-width="8"/>`;
   const coats = [
      { c: "#CFC6B8", x: 140, k: "trench" as const },
      { c: "#1F2A44", x: 360, k: "coat" as const },
      { c: "#B58B5A", x: 250, k: "coat" as const },
   ];
   const body = coats
      .map((it) => `${hangerAt(it.x, 104, 0.9)}${put(it.k, it.c, it.x - 180, 108, 0.9, 0)}`)
      .join("");
   return svgDoc(500, 660, rail + body, label);
}

export function knitEdit(label: string) {
   const yarn = `<g transform="translate(360 560)">
  <circle r="58" fill="#B5532F"/><circle r="58" fill="url(#knit)"/>
  <g fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"><path d="M-50 -20 Q0 -60 50 -22"/><path d="M-56 4 Q0 -36 56 0"/><path d="M-50 28 Q0 -10 52 26"/><path d="M-30 50 Q10 20 40 46"/></g>
  <path d="M40 40 Q90 70 120 60" fill="none" stroke="#B5532F" stroke-width="5"/>
</g>
<g stroke-linecap="round"><path d="M250 640 L430 470" stroke="#d8c7a0" stroke-width="9"/><path d="M290 650 L460 500" stroke="#d8c7a0" stroke-width="9"/>
<circle cx="430" cy="470" r="9" fill="#14181F"/><circle cx="460" cy="500" r="9" fill="#14181F"/></g>`;
   const body = put("sweater", "#D9CDB4", 10, 30, 0.95, -6) + put("rollneck", "#1F2A44", 120, 70, 0.9, 5) + put("sweater", "#B5532F", 40, 200, 0.8, -1) + yarn;
   return svgDoc(500, 660, body, label);
}

/* ───────────── Journal (1600 × 1200) ───────────── */

const scissors = (x: number, y: number, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})" fill="none" stroke-linecap="round">
  <path d="M0 0 L180 -40 M0 0 L180 40" stroke="#9aa0a8" stroke-width="10"/>
  <circle cx="-40" cy="-28" r="30" stroke="#14181F" stroke-width="12"/><circle cx="-40" cy="28" r="30" stroke="#14181F" stroke-width="12"/>
  <circle cx="0" cy="0" r="5" fill="#14181F"/>
</g>`;
const tape = (x: number, y: number, len: number, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})">
  <rect width="${len}" height="34" fill="#e8c547" stroke="#000" stroke-opacity=".2"/>
  ${Array.from({ length: Math.floor(len / 12) }, (_, i) => `<path d="M${i * 12 + 6} 0 V${i % 5 === 0 ? 16 : 9}" stroke="#14181F" stroke-opacity=".7" stroke-width="1.5"/>`).join("")}
</g>`;
const patternPiece = (d: string, tx: number, ty: number, s = 1) => `<g transform="translate(${tx} ${ty}) scale(${s})">
  <path d="${d}" fill="#efe6d1" stroke="${COBALT}" stroke-width="2.5"/>
  <path d="${d}" fill="none" stroke="${COBALT}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="8 6" transform="translate(12 12) scale(.96)"/>
</g>`;

export function journal(slug: string, label: string) {
   const W = 1600;
   const H = 1200;
   let body = "";
   if (slug === "how-a-pattern-becomes-a-coat") {
      body = `<rect width="${W}" height="${H}" fill="#c9a77c"/><rect width="${W}" height="${H}" fill="url(#grain)"/>
<rect x="80" y="80" width="1440" height="1040" fill="#f4f3ee" filter="url(#soft)"/><rect x="80" y="80" width="1440" height="1040" fill="url(#grid-paper)"/>
${patternPiece("M60 70 L150 52 Q170 92 214 84 L232 116 Q222 176 238 226 L254 560 L76 580 Z", 160, 160, 1.15)}
${patternPiece("M286 60 L396 48 L430 92 Q420 166 436 222 L452 560 L298 572 Z", 140, 170, 1.15)}
${patternPiece("M478 170 Q544 52 610 170 L596 420 L492 420 Z", 120, 160, 1.15)}
${put("coat", "#1F2A44", 1010, 220, 1.35, 4)}
${scissors(560, 980, -18)}${tape(150, 1010, 600, -4)}`;
   } else if (slug === "making-wool-last-twenty-years") {
      body = `<rect width="${W}" height="${H}" fill="#2a2f3a"/><rect width="${W}" height="${H}" fill="url(#grid-dark)"/>
${hangerAt(800, 210, 1.5)}${put("coat", "#B58B5A", 500, 220, 1.5, 0)}
<g transform="translate(860 700)"><circle r="70" fill="#9a7650" stroke="#f1e6d0" stroke-width="3" stroke-dasharray="6 6"/>
${Array.from({ length: 9 }, (_, i) => `<path d="M${-60 + i * 15} -50 V50" stroke="#f1e6d0" stroke-opacity=".6" stroke-width="2"/>`).join("")}
${Array.from({ length: 7 }, (_, i) => `<path d="M-55 ${-45 + i * 15} H55" stroke="#000" stroke-opacity=".2" stroke-width="3"/>`).join("")}</g>
<g transform="translate(1260 260) rotate(30)"><path d="M0 0 L0 420" stroke="#c9ccd2" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="18" rx="4" ry="12" fill="#2a2f3a"/></g>
<path d="M1262 270 Q1380 420 1200 560 Q1040 680 940 690" fill="none" stroke="#e8c547" stroke-width="4"/>
<g ${mono} fill="#f1e6d0" fill-opacity=".8"><text x="120" y="1090" font-size="40">2006 — 2026</text></g>`;
   } else if (slug === "why-we-cut-in-runs-of-200") {
      const layers = Array.from({ length: 14 }, (_, i) => {
         const c = ["#1F2A44", "#B58B5A", "#6B6B3A", "#B5532F", "#D9CDB4", "#3A3D42"][i % 6];
         return `<path d="M${380 + i * 6} ${820 - i * 30} L${1180 + i * 6} ${820 - i * 30} L${1240 + i * 6} ${880 - i * 30} L${440 + i * 6} ${880 - i * 30} Z" fill="${c}" stroke="#000" stroke-opacity=".2"/>`;
      }).join("");
      body = `<rect width="${W}" height="${H}" fill="#e6dfd1"/><rect width="${W}" height="${H}" fill="url(#grid-paper)" opacity=".6"/>
<ellipse cx="820" cy="900" rx="560" ry="60" fill="url(#floor)"/>${layers}
<path d="M1190 430 Q1260 380 1300 300" fill="none" stroke="#7a5a3c" stroke-width="3"/>
<g transform="translate(1250 160) rotate(12)"><rect width="220" height="140" rx="14" fill="#f4f3ee" stroke="#14181F" stroke-opacity=".3" filter="url(#soft)"/>
<circle cx="30" cy="70" r="10" fill="none" stroke="#14181F" stroke-opacity=".4" stroke-width="3"/>
<text x="130" y="96" text-anchor="middle" font-size="76" font-weight="700" fill="${INK}" ${sans}>200</text></g>
${scissors(240, 260, 24)}`;
   } else {
      // A day in the Porto workshop: окно с крышами Порту, машинка, стойка с вещами
      const roofs = Array.from({ length: 9 }, (_, i) => `<path d="M${180 + i * 70} 620 L${215 + i * 70} ${560 - (i % 3) * 24} L${250 + i * 70} 620 Z" fill="${["#c0623f", "#b5532f", "#d07b4e"][i % 3]}"/><rect x="${186 + i * 70}" y="620" width="58" height="${80 + (i % 4) * 20}" fill="${["#efe6d1", "#e2dccf", "#d9cdb4"][i % 3]}"/>`).join("");
      body = `<rect width="${W}" height="${H}" fill="#e2dccf"/>
<rect x="140" y="160" width="700" height="620" rx="340" ry="320" fill="#a9c1d9"/>
<clipPath id="win"><rect x="140" y="160" width="700" height="620" rx="340" ry="320"/></clipPath>
<g clip-path="url(#win)"><circle cx="650" cy="330" r="70" fill="#f4e3b5"/>${roofs}<rect x="140" y="700" width="700" height="100" fill="#6f7452"/></g>
<rect x="140" y="160" width="700" height="620" rx="340" ry="320" fill="none" stroke="#f4f3ee" stroke-width="24"/>
<path d="M490 170 V780 M150 470 H830" stroke="#f4f3ee" stroke-width="14"/>
<rect x="0" y="860" width="${W}" height="340" fill="#b88b57"/><rect x="0" y="860" width="${W}" height="340" fill="url(#grain)"/>
<g transform="translate(300 700)" filter="url(#soft)">
  <path d="M0 160 L0 40 Q0 0 40 0 L360 0 Q400 0 400 40 L400 80 L120 80 L120 160 Z" fill="${INK}"/>
  <rect x="-40" y="160" width="520" height="40" rx="8" fill="#3a3d42"/>
  <rect x="300" y="80" width="40" height="80" fill="#3a3d42"/><circle cx="430" cy="40" r="36" fill="#3a3d42"/>
  <text x="60" y="52" font-size="30" letter-spacing="6" fill="#e8e1d0" ${sans}>VELLUM</text>
</g>
<path d="M980 150 H1520" stroke="#2b2724" stroke-width="10" stroke-linecap="round"/>
${hangerAt(1080, 160, 0.8)}${put("overshirt", "#C08A2B", 920, 170, 0.8)}
${hangerAt(1260, 160, 0.8)}${put("shirt", "#F2EFE8", 1100, 170, 0.8)}
${hangerAt(1430, 160, 0.8)}${put("cardigan", "#2F4A3A", 1270, 170, 0.8)}`;
   }
   return svgDoc(W, H, body, label);
}

/* ───────────── Lookbook (1600 × 1200, раскладка образа сверху) ───────────── */

export function lookbook(slug: string, label: string) {
   const W = 1600;
   const H = 1200;
   const bgs: Record<string, string> = { "first-frost": "#cdd3de", "quiet-layers": "#e2dccf", "weekday-uniform": "#d9d0bc", "carry-it-all": "#c9b8a0" };
   const bg = bgs[slug] ?? "#d9d0bc";
   let items = "";
   if (slug === "first-frost") {
      const flakes = Array.from({ length: 26 }, (_, i) => {
         const x = (i * 263) % 1560 + 20;
         const y = (i * 397) % 1160 + 20;
         const s = 6 + (i % 4) * 3;
         return `<g transform="translate(${x} ${y})" stroke="#fff" stroke-opacity=".75" stroke-width="2.5" stroke-linecap="round"><path d="M-${s} 0 H${s} M0 -${s} V${s} M-${s * 0.7} -${s * 0.7} L${s * 0.7} ${s * 0.7} M${s * 0.7} -${s * 0.7} L-${s * 0.7} ${s * 0.7}"/></g>`;
      }).join("");
      items = flakes + put("coat", "#1F2A44", 260, 180, 1.6, -4) + put("rollneck", "#14181F", 760, 200, 1.15, 5) + put("wide-leg", "#B58B5A", 1060, 300, 1.25, -3);
   } else if (slug === "quiet-layers") {
      items = put("cardigan", "#EFE8D8", 220, 220, 1.4, -5) + put("shirt", "#A9C1D9", 640, 170, 1.3, 3) + put("pleated", "#CFC6B8", 1060, 230, 1.3, -2);
   } else if (slug === "weekday-uniform") {
      items = put("overshirt", "#6B6B3A", 160, 200, 1.35, -6) + put("tee", "#F2EFE8", 560, 300, 1.1, 4) + put("chino", "#1F2A44", 880, 220, 1.3, 2) + put("tote", "#B58B5A", 1180, 470, 0.9, 8);
   } else {
      items = put("weekender", "#6B6B3A", 200, 340, 1.6, -4) + put("tote", "#14181F", 900, 160, 1.15, 6) + put("crossbody", "#B5532F", 1060, 620, 0.9, -8) + put("card-holder", "#B58B5A", 760, 760, 0.6, 14);
   }
   return svgDoc(W, H, `<rect width="${W}" height="${H}" fill="${bg}"/><rect width="${W}" height="${H}" fill="url(#linen)"/>${items}`, label);
}

/* ───────────── Fabrics (1200 × 900, крупный план ткани) ───────────── */

export function fabric(slug: string, label: string) {
   const W = 1200;
   const H = 900;
   const swatch = (fill: string, patterns: string[], extra = "") => `<rect width="${W}" height="${H}" fill="${mix(fill, PAPER, 0.55)}"/>
<g transform="translate(150 110) rotate(-4 450 340)" filter="url(#drop)">
  <path d="M0 0 H900 V680 H0 Z" fill="${fill}"/>
  ${patterns.map((p) => `<path d="M0 0 H900 V680 H0 Z" fill="url(#${p})"/>`).join("")}
  <path d="M0 0 H900 V680 H0 Z" fill="url(#shade)"/>
  ${extra}
  <path d="M20 20 H880 V660 H20 Z" fill="none" stroke="${lighten(fill, 0.4)}" stroke-opacity=".6" stroke-width="3" stroke-dasharray="10 8"/>
</g>`;
   const bodies: Record<string, string> = {
      "boiled-wool": swatch("#6b4a3a", ["grain", "grain"], `<rect width="900" height="680" fill="url(#knit)" opacity=".5"/>`),
      "extra-fine-merino": `<defs><pattern id="bigknit" width="40" height="46" patternUnits="userSpaceOnUse"><path d="M0 0 L20 34 L40 0" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="5"/><path d="M0 0 L20 34 L40 0" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2" transform="translate(0 -3)"/></pattern></defs>${swatch("#b5532f", ["bigknit"])}`,
      "dry-waxed-cotton": swatch("#6b6b3a", ["twill", "twill", "sheen"], `<path d="M0 220 Q300 160 900 260 L900 300 Q300 200 0 260 Z" fill="#fff" fill-opacity=".08"/>`),
      "washed-linen": swatch("#a5b09a", ["linen", "linen"], `<g fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2">${Array.from({ length: 18 }, (_, i) => `<path d="M0 ${30 + i * 37} Q450 ${20 + i * 37} 900 ${34 + i * 37}"/>`).join("")}</g>`),
      "selvedge-denim": swatch("#2b3a55", ["denim", "denim"], `<rect x="0" y="0" width="900" height="34" fill="#f2efe8"/><path d="M0 17 H900" stroke="#b5332f" stroke-width="5"/>`),
      "vegetable-tanned-leather": swatch("#b58b5a", ["grain", "grain", "sheen"], `<path d="M0 0 H900 V680 H0 Z" fill="none" stroke="#6a4b33" stroke-width="10"/>`),
   };
   return svgDoc(W, H, bodies[slug] ?? swatch("#999999", ["twill"]), label);
}

/* ───────────── Stores (1600 × 800, витрина) ───────────── */

export function store(city: string, label: string) {
   const W = 1600;
   const H = 800;
   const look: Record<string, { wall: string; pattern: string; awning: string; sky: string }> = {
      porto: { wall: "#f4f3ee", pattern: "azulejo", awning: "#2c44d8", sky: "#a9c1d9" },
      lisbon: { wall: "#e8c547", pattern: "none", awning: "#14181F", sky: "#bcd3e6" },
      london: { wall: "#9a4b30", pattern: "brick", awning: "#1f2a44", sky: "#cdd3de" },
      berlin: { wall: "#b6b8b5", pattern: "panel", awning: "#3a3d42", sky: "#d9dee6" },
   };
   const l = look[city] ?? look.porto;
   const patternDefs = `<pattern id="azulejo" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#f4f3ee"/><path d="M30 6 L54 30 L30 54 L6 30 Z" fill="none" stroke="#2c44d8" stroke-width="3"/><circle cx="30" cy="30" r="6" fill="#2c44d8"/><path d="M0 0 L10 10 M60 0 L50 10 M0 60 L10 50 M60 60 L50 50" stroke="#2c44d8" stroke-width="3"/></pattern>
<pattern id="brick" width="80" height="40" patternUnits="userSpaceOnUse"><path d="M0 0 H80 M0 20 H80 M20 0 V20 M60 20 V40" stroke="#000" stroke-opacity=".18" stroke-width="3"/></pattern>
<pattern id="panel" width="200" height="160" patternUnits="userSpaceOnUse"><path d="M0 0 H200 V160" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="3"/></pattern>`;
   const window = (x: number, kinds: [GarmentKind, string][]) => `<rect x="${x}" y="330" width="420" height="380" fill="#2b3240"/>
<rect x="${x}" y="330" width="420" height="380" fill="#fff" fill-opacity=".06"/>
${kinds.map(([k, c], i) => put(k, c, x + 20 + i * 130, 380, 0.58, 0, false)).join("")}
<path d="M${x} 330 L${x + 160} 330 L${x} 520 Z" fill="#fff" fill-opacity=".08"/>
<rect x="${x}" y="330" width="420" height="380" fill="none" stroke="${INK}" stroke-width="14"/>`;
   const tram = city === "lisbon" ? `<g transform="translate(1260 520)"><rect width="300" height="170" rx="20" fill="#e8c547" stroke="#14181F" stroke-width="5"/><rect x="20" y="24" width="60" height="60" rx="6" fill="#a9c1d9"/><rect x="100" y="24" width="60" height="60" rx="6" fill="#a9c1d9"/><rect x="180" y="24" width="60" height="60" rx="6" fill="#a9c1d9"/><circle cx="60" cy="176" r="18" fill="#14181F"/><circle cx="240" cy="176" r="18" fill="#14181F"/><path d="M150 0 L150 -120" stroke="#14181F" stroke-width="5"/></g>` : "";
   const body = `<defs>${patternDefs}</defs>
<rect width="${W}" height="${H}" fill="${l.sky}"/>
<rect x="0" y="0" width="${W}" height="760" fill="${l.wall}"/>
${l.pattern !== "none" ? `<rect x="0" y="0" width="${W}" height="760" fill="url(#${l.pattern})"/>` : ""}
<rect x="230" y="150" width="1140" height="610" fill="${darken(l.wall, 0.06)}"/>
<rect x="300" y="170" width="1000" height="96" fill="${INK}"/>
<text x="800" y="238" text-anchor="middle" font-size="64" letter-spacing="22" fill="#f4f3ee" ${sans}>VELLUM</text>
<path d="M260 280 H1340 L1300 330 H300 Z" fill="${l.awning}"/>
${Array.from({ length: 11 }, (_, i) => `<path d="M${300 + i * 100} 330 q50 26 100 0" fill="${l.awning}"/>`).join("")}
${window(300, [["coat", "#B58B5A"], ["sweater", "#D9CDB4"], ["shirt", "#A9C1D9"]])}
<rect x="740" y="360" width="120" height="400" fill="#2b2724"/><circle cx="840" cy="560" r="7" fill="#c9c2b0"/>
${window(880, [["overshirt", "#C08A2B"], ["pleated", "#3A3D42"], ["tote", "#B58B5A"]])}
<rect x="0" y="760" width="${W}" height="40" fill="#8d8a83"/>
<g><rect x="120" y="610" width="70" height="150" rx="8" fill="#6f7452"/><circle cx="155" cy="590" r="54" fill="#5f7a4c"/><circle cx="1460" cy="590" r="54" fill="#5f7a4c"/><rect x="1425" y="610" width="70" height="150" rx="8" fill="#6f7452"/></g>
${tram}`;
   return svgDoc(W, H, body, label);
}

/* ───────────── Workshop page (1600 × 800) ───────────── */

export function workshop(label: string) {
   const W = 1600;
   const H = 800;
   const lamp = (x: number) => `<path d="M${x} 0 V120" stroke="#2b2724" stroke-width="4"/><path d="M${x - 70} 190 Q${x} 90 ${x + 70} 190 Z" fill="${COBALT}"/><ellipse cx="${x}" cy="190" rx="70" ry="10" fill="#f4e3b5"/><path d="M${x - 60} 196 L${x - 180} 560 H${x + 180} L${x + 60} 196 Z" fill="#f4e3b5" fill-opacity=".09"/>`;
   const body = `<rect width="${W}" height="${H}" fill="#e2dccf"/><rect width="${W}" height="${H}" fill="url(#grid-paper)" opacity=".35"/>
<path d="M60 120 H560" stroke="#2b2724" stroke-width="10" stroke-linecap="round"/>
${hangerAt(150, 130, 0.62)}${put("coat", "#1F2A44", 26, 136, 0.62, 0)}
${hangerAt(290, 130, 0.62)}${put("trench", "#CFC6B8", 166, 136, 0.62, 0)}
${hangerAt(430, 130, 0.62)}${put("coat", "#B58B5A", 306, 136, 0.62, 0)}
${lamp(860)}${lamp(1260)}
<path d="M600 560 L1540 560 L1580 640 L560 640 Z" fill="#b88b57"/><rect x="560" y="640" width="1020" height="24" fill="#8f6a42"/>
<rect x="600" y="664" width="26" height="136" fill="#8f6a42"/><rect x="1520" y="664" width="26" height="136" fill="#8f6a42"/>
<path d="M660 548 L1480 548 L1500 600 L640 600 Z" fill="#f4f3ee"/><path d="M660 548 L1480 548 L1500 600 L640 600 Z" fill="url(#grid-paper)"/>
<g fill="none" stroke="${COBALT}" stroke-width="2.5"><path d="M720 590 L760 556 L860 554 L880 590 Z"/><path d="M920 592 L940 556 L1060 556 L1080 592 Z"/><path d="M1120 592 Q1180 548 1240 592 Z"/></g>
${scissors(1330, 576, -10).replace(/stroke-width="12"/g, 'stroke-width="7"').replace(/stroke-width="10"/g, 'stroke-width="6"')}
<g transform="translate(560 470)"><rect width="300" height="70" rx="35" fill="#efe6d1" stroke="#000" stroke-opacity=".15"/><ellipse cx="300" cy="35" rx="16" ry="35" fill="#d9cdb4"/></g>
<rect y="760" width="${W}" height="40" fill="#8d8a83"/>`;
   return svgDoc(W, H, body, label);
}

/* ───────────── Gift card (1200 × 900) ───────────── */

export function giftCard(label: string) {
   const body = `<rect width="1200" height="900" fill="#d9d0bc"/><rect width="1200" height="900" fill="url(#linen)"/>
<g transform="translate(250 260) rotate(-8 350 240)" filter="url(#drop)">
  <path d="M0 0 H700 V460 H0 Z" fill="#efe6d1"/><path d="M0 0 L350 250 L700 0" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="3"/>
  <path d="M0 460 L280 220 M700 460 L420 220" stroke="#000" stroke-opacity=".08" stroke-width="3"/>
</g>
<g transform="translate(300 180) rotate(6 300 190)" filter="url(#drop)">
  <rect width="600" height="380" rx="28" fill="${INK}"/>
  <rect width="600" height="380" rx="28" fill="url(#grid-dark)"/>
  <g transform="translate(56 64)" fill="none" stroke="${COBALT_SOFT}" stroke-width="5"><path d="M0 0 L28 50 L56 0"/><path d="M14 0 L42 0" stroke-dasharray="5 5"/></g>
  <text x="130" y="108" font-size="56" letter-spacing="16" fill="#f4f3ee" ${sans}>VELLUM</text>
  <text x="56" y="320" font-size="26" letter-spacing="6" fill="${COBALT_SOFT}" ${mono}>GIFT CARD</text>
  <text x="544" y="320" font-size="64" text-anchor="end" font-weight="700" fill="#f4f3ee" ${sans}>$150</text>
  <path d="M56 230 H360" stroke="#fff" stroke-opacity=".15" stroke-width="2" stroke-dasharray="8 8"/>
</g>
<path d="M300 760 Q520 700 640 760 T980 740" fill="none" stroke="${COBALT}" stroke-width="10" stroke-linecap="round"/>`;
   return svgDoc(1200, 900, body, label);
}
