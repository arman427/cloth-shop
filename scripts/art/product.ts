/**
 * Три ракурса товара для галереи (800 × 1000, как фото 4:5):
 *  front   — вещь на плечиках на фоне в цвет ткани;
 *  detail  — крупный план: ворот, пуговицы, фактура;
 *  pattern — та же вещь как лекало на бумаге в клетку (фирменный мотив "сшито по бумажным лекалам").
 */
import { BOX, DETAIL_FOCUS, GARMENTS, type GarmentKind, isBag, isTop } from "./garments";
import { COBALT, darken, mix, PAPER, tintOf } from "./color";
import { svgDoc } from "./defs";

const W = 800;
const H = 1000;

/** Метки обрезки по углам, как в hero на главной */
const cropMarks = (inset = 40, size = 30, color = COBALT, opacity = 0.5) => {
   const s = `fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="2.5"`;
   const [a, b] = [inset, inset + size];
   return `<g ${s}>
  <path d="M${a} ${b} V${a} H${b}"/><path d="M${W - b} ${a} H${W - a} V${b}"/>
  <path d="M${a} ${H - b} V${H - a} H${b}"/><path d="M${W - b} ${H - a} H${W - a} V${H - b}"/>
</g>`;
};

function hanger(kind: GarmentKind) {
   if (!isTop(kind)) {
      // Брюки: перекладина с зажимами
      return `<g fill="none" stroke-linecap="round">
  <path d="M400 92 Q400 60 424 60 Q446 62 444 84" stroke="#8d8a83" stroke-width="7"/>
  <path d="M400 92 L400 130" stroke="#8d8a83" stroke-width="7"/>
  <path d="M250 150 L550 150" stroke="#2b2724" stroke-width="12"/>
</g>
<g fill="#8d8a83"><rect x="262" y="146" width="22" height="46" rx="4"/><rect x="516" y="146" width="22" height="46" rx="4"/></g>`;
   }
   // Деревянные плечики
   return `<g fill="none" stroke-linecap="round">
  <path d="M400 150 Q400 112 426 112 Q450 114 448 138" stroke="#8d8a83" stroke-width="7"/>
  <path d="M400 150 L400 172" stroke="#8d8a83" stroke-width="7"/>
  <path d="M232 250 Q300 196 400 172 Q500 196 568 250" stroke="#7a5a3c" stroke-width="16"/>
  <path d="M232 250 Q300 196 400 172 Q500 196 568 250" stroke="#fff" stroke-opacity=".18" stroke-width="4" transform="translate(0 -4)"/>
</g>`;
}

export function productFront(kind: GarmentKind, color: string, label: string) {
   const bg = tintOf(color);
   const scale = isBag(kind) ? 1.45 : 1.5;
   const gw = BOX.w * scale;
   const top = isBag(kind) ? 200 : isTop(kind) ? 170 : 128;
   const body = `<rect width="${W}" height="${H}" fill="${bg}"/>
<rect width="${W}" height="${H}" fill="url(#grid-paper)" opacity=".55"/>
<ellipse cx="400" cy="${isBag(kind) ? 900 : 930}" rx="${isBag(kind) ? 270 : 230}" ry="34" fill="url(#floor)"/>
${isBag(kind) ? "" : hanger(kind)}
<g transform="translate(${(W - gw) / 2} ${top}) scale(${scale})" filter="url(#drop)">${GARMENTS[kind](color)}</g>
${cropMarks()}`;
   return svgDoc(W, H, body, label);
}

export function productDetail(kind: GarmentKind, color: string, label: string) {
   const [x, y, w] = DETAIL_FOCUS[kind];
   const h = w * (H / W);
   const body = `<rect width="${W}" height="${H}" fill="${mix(color, PAPER, 0.35)}"/>
<svg x="0" y="0" width="${W}" height="${H}" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <rect x="-400" y="-400" width="1200" height="1300" fill="${mix(color, PAPER, 0.35)}"/>
  ${GARMENTS[kind](color)}
</svg>
<rect width="${W}" height="${H}" fill="url(#sheen)" opacity=".6"/>
<circle cx="${W - 92}" cy="92" r="34" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.5"/>
<path d="M${W - 68} 116 L${W - 46} 138" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>
${cropMarks(40, 30, "#fff", 0.55)}`;
   return svgDoc(W, H, body, label);
}

export function productPattern(kind: GarmentKind, color: string, label: string, patternNo: number) {
   const scale = 1.42;
   const gw = BOX.w * scale;
   const ox = (W - gw) / 2;
   const oy = 150;
   // Вещь рисуется белой, а фильтр превращает тёмные линии в синие, а белую заливку — в прозрачность
   const body = `<filter id="blueprint" color-interpolation-filters="sRGB">
  <feColorMatrix type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.27  0 0 0 0 0.85  -0.667 -0.667 -0.667 2 0"/>
</filter>
<rect width="${W}" height="${H}" fill="#f4f3ee"/>
<rect width="${W}" height="${H}" fill="url(#grid-paper)"/>
<g transform="translate(${ox} ${oy}) scale(${scale})">
  <g opacity=".55">${GARMENTS[kind]("#dfe4fb")}</g>
  <g filter="url(#blueprint)">${GARMENTS[kind]("#ffffff")}</g>
</g>
<g fill="none" stroke="${COBALT}" stroke-width="2.2" stroke-linecap="round">
  <path d="M400 260 V760 M388 280 L400 260 L412 280 M388 740 L400 760 L412 740"/>
</g>
<g font-family="ui-monospace, 'DejaVu Sans Mono', Menlo, monospace" fill="${darken(COBALT, 0.2)}">
  <text x="64" y="92" font-size="22" letter-spacing="3">VELLUM</text>
  <text x="64" y="124" font-size="18" fill-opacity=".7">№ ${String(patternNo).padStart(3, "0")} · M</text>
  <text x="${W - 64}" y="${H - 64}" font-size="18" text-anchor="end" fill-opacity=".7">1 : 10</text>
</g>
<g fill="none" stroke="${COBALT}" stroke-opacity=".55" stroke-width="2"><path d="M64 ${H - 92} H184 M64 ${H - 100} V${H - 84} M184 ${H - 100} V${H - 84}"/></g>`;
   return svgDoc(W, H, body, label);
}
