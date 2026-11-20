/**
 * Плоские рисунки вещей (как технический эскиз) в рамке 400 × 480.
 * Каждая функция получает цвет ткани и возвращает кусок SVG. Узоры берутся из defs.ts.
 * Основа — те же контуры, что и в src/components/garments/symbols.
 */
import { darken, isDark, lighten } from "./color";

export type GarmentKind =
   | "overshirt" | "quilted" | "bomber" | "coat" | "trench"
   | "sweater" | "cardigan" | "polo" | "rollneck"
   | "shirt" | "linen-shirt" | "blouse" | "tee"
   | "pleated" | "wide-leg" | "chino" | "jean"
   | "tote" | "crossbody" | "weekender" | "card-holder";

export const BOX = { w: 400, h: 480 };

const OUT = `stroke="#1b1e24" stroke-opacity=".55" stroke-width="1.5" stroke-linejoin="round"`;
const stitchColor = (c: string) => (isDark(c) ? `stroke="#fff" stroke-opacity=".28"` : `stroke="#1b1e24" stroke-opacity=".38"`);
const stitch = (c: string, d: string) => `<path d="${d}" fill="none" ${stitchColor(c)} stroke-width="1" stroke-dasharray="3 3"/>`;
const folds = (d: string[], op = 0.13) => `<g fill="none" stroke="#000" stroke-opacity="${op}" stroke-width="2" stroke-linecap="round">${d.map((x) => `<path d="${x}"/>`).join("")}</g>`;
const buttonFill = (c: string) => (isDark(c) ? "#3a3d42" : darken(c, 0.55));
const buttons = (c: string, pts: [number, number][], r = 5) =>
   `<g fill="${buttonFill(c)}" stroke="#000" stroke-opacity=".25">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`;
const shift = (svg: string, dy = 20) => `<g transform="translate(0 ${dy})">${svg}</g>`;

/* ───────────── Outerwear ───────────── */

function overshirtBase(c: string, opts: { pockets?: boolean; texture?: string } = {}) {
   const BODY = "M166 34 L120 62 L127 152 L128 404 Q200 412 272 404 L273 152 L280 62 L234 34 Q200 46 166 34 Z";
   const SL = "M120 62 L86 80 Q66 190 56 334 L100 340 Q112 236 127 152 Z";
   const SR = "M280 62 L314 80 Q334 190 344 334 L300 340 Q288 236 273 152 Z";
   const CR = "M234 34 L248 68 L220 100 L200 62 Q214 48 234 34 Z";
   const tex = opts.texture ?? "twill";
   return `<g ${OUT}>
  <path d="${SL}" fill="${c}"/><path d="${SR}" fill="${c}"/>
  <path d="${SL}" fill="#000" fill-opacity=".09"/><path d="${SR}" fill="#000" fill-opacity=".13"/>
  <path d="${SL}" fill="url(#${tex})" stroke="none"/><path d="${SR}" fill="url(#${tex})" stroke="none"/>
  <path d="M56 334 L100 340 L98 368 L53 362 Z" fill="${c}"/><path d="M344 334 L300 340 L302 368 L347 362 Z" fill="${c}"/>
  <path d="${BODY}" fill="${c}"/><path d="${BODY}" fill="url(#shade)" stroke="none"/><path d="${BODY}" fill="url(#${tex})" stroke="none"/>
  <path d="M166 34 Q200 46 234 34 Q200 60 166 34 Z" fill="#000" fill-opacity=".35"/>
  <path d="M192 64 L208 64 L208 409 L192 409 Z" fill="${c}"/>
  <path d="M166 34 L152 68 L180 100 L200 62 Q186 48 166 34 Z" fill="${c}"/>
  <path d="${CR}" fill="${c}"/><path d="${CR}" fill="#000" fill-opacity=".08"/>
  ${opts.pockets === false ? "" : `<rect x="138" y="152" width="46" height="56" rx="2" fill="${c}"/>
  <path d="M135 146 L187 146 L187 164 L161 172 L135 164 Z" fill="${c}"/>
  <rect x="216" y="152" width="46" height="56" rx="2" fill="${c}"/>
  <path d="M213 146 L265 146 L265 164 L239 172 L213 164 Z" fill="${c}"/>
  <rect x="216" y="152" width="46" height="56" rx="2" fill="#000" fill-opacity=".07"/>`}
</g>`;
}

function overshirt(c: string) {
   return shift(`${overshirtBase(c)}
${stitch(c, "M124 96 Q200 104 276 96 M134 396 Q200 402 266 396 M196 68 L196 404 M204 68 L204 404 M142 168 L142 204 L180 204 L180 168 M220 168 L220 204 L258 204 L258 168 M58 346 L100 352 M342 346 L300 352")}
${buttons(c, [[200, 118], [200, 170], [200, 222], [200, 274], [200, 326], [200, 378]])}
${buttons(c, [[161, 164], [239, 164], [77, 355], [323, 355]], 3.5)}
${folds(["M150 230 Q160 300 152 388", "M252 240 Q244 310 250 390", "M86 150 Q80 220 78 300", "M318 160 Q322 240 324 310"])}`);
}

function quilted(c: string) {
   const BODY = "M166 34 L120 62 L127 152 L128 404 Q200 412 272 404 L273 152 L280 62 L234 34 Q200 46 166 34 Z";
   return shift(`${overshirtBase(c, { pockets: false, texture: "quilt" })}
<path d="${BODY}" fill="url(#quilt)" stroke="none"/>
<g ${OUT}><path d="M134 300 L184 300 L184 360 L134 360 Z" fill="${c}"/><path d="M216 300 L266 300 L266 360 L216 360 Z" fill="${c}"/></g>
<path d="M134 300 L184 300 L184 360 L134 360 Z M216 300 L266 300 L266 360 L216 360 Z" fill="#000" fill-opacity=".06"/>
${stitch(c, "M124 96 Q200 104 276 96 M196 68 L196 404 M204 68 L204 404 M138 306 L180 306 M220 306 L262 306")}
${buttons(c, [[200, 110], [200, 160], [200, 210], [200, 260], [200, 310], [200, 360]], 4.5)}
<path d="M120 62 L86 80 Q66 190 56 334 L100 340 Q112 236 127 152 Z M280 62 L314 80 Q334 190 344 334 L300 340 Q288 236 273 152 Z" fill="url(#quilt)"/>`);
}

function bomber(c: string) {
   const BODY = "M160 46 L112 70 L122 160 L124 382 L276 382 L278 160 L288 70 L240 46 Q200 62 160 46 Z";
   const SL = "M112 70 L78 90 Q60 200 54 336 L104 342 Q114 240 122 160 Z";
   const SR = "M288 70 L322 90 Q340 200 346 336 L296 342 Q286 240 278 160 Z";
   const rib = isDark(c) ? lighten(c, 0.08) : darken(c, 0.12);
   return shift(`<g ${OUT}>
  <path d="${SL}" fill="${c}"/><path d="${SR}" fill="${c}"/>
  <path d="${SL}" fill="#000" fill-opacity=".1"/><path d="${SR}" fill="#000" fill-opacity=".14"/>
  <path d="M54 336 L104 342 L102 376 L52 370 Z" fill="${rib}"/><path d="M346 336 L296 342 L298 376 L348 370 Z" fill="${rib}"/>
  <path d="${BODY}" fill="${c}"/><path d="${BODY}" fill="url(#shade)" stroke="none"/><path d="${BODY}" fill="url(#sheen)" stroke="none"/>
  <path d="M124 382 L276 382 L278 420 L122 420 Z" fill="${rib}"/>
  <path d="M152 40 Q200 70 248 40 L240 46 Q200 62 160 46 Z" fill="${rib}"/>
  <path d="M62 140 L90 136 L92 176 L66 180 Z" fill="${c}"/>
</g>
<path d="M54 336 L104 342 L102 376 L52 370 Z M346 336 L296 342 L298 376 L348 370 Z M124 382 L276 382 L278 420 L122 420 Z M152 40 Q200 70 248 40 L240 46 Q200 62 160 46 Z" fill="url(#rib)"/>
<path d="M200 58 L200 420" stroke="#1b1e24" stroke-opacity=".6" stroke-width="3"/>
<path d="M200 58 L200 420" stroke="#c9c2b0" stroke-width="1.2" stroke-dasharray="2 2"/>
<rect x="195" y="62" width="10" height="16" rx="2" fill="#b9b2a2" stroke="#1b1e24" stroke-opacity=".5"/>
${stitch(c, "M140 260 L150 330 M260 260 L250 330 M66 146 L88 143")}
${folds(["M150 200 Q158 280 152 370", "M252 210 Q244 290 250 372", "M84 160 Q78 230 76 300"])}`);
}

function coatBase(c: string, opts: { belt?: boolean; double?: boolean; long?: boolean } = {}) {
   const bottom = opts.long ? 474 : 462;
   const BODY = `M166 30 L116 54 L122 150 L110 ${bottom} L290 ${bottom} L278 150 L284 54 L234 30 Q200 40 166 30 Z`;
   const SL = "M116 54 L82 74 Q62 210 56 368 L104 374 Q112 260 122 150 Z";
   const SR = "M284 54 L318 74 Q338 210 344 368 L296 374 Q288 260 278 150 Z";
   const LR = "M234 30 L252 62 L234 82 L246 98 L216 196 L200 70 Z";
   return `<g ${OUT}>
  <path d="${SL}" fill="${c}"/><path d="${SR}" fill="${c}"/>
  <path d="${SL}" fill="#000" fill-opacity=".14"/><path d="${SR}" fill="#000" fill-opacity=".2"/>
  <path d="${BODY}" fill="${c}"/><path d="${BODY}" fill="url(#shade)" stroke="none"/><path d="${BODY}" fill="url(#twill)" stroke="none"/>
  <path d="M166 30 Q200 40 234 30 Q200 56 166 30 Z" fill="#000" fill-opacity=".4"/>
  <path d="M214 196 L214 ${bottom}" fill="none"/>
  <path d="M166 30 L148 62 L166 82 L154 98 L200 212 L200 70 Z" fill="${c}"/>
  <path d="${LR}" fill="${c}"/><path d="${LR}" fill="#000" fill-opacity=".12"/>
  <path d="M126 316 L178 316 L178 332 L126 332 Z" fill="${c}"/><path d="M222 316 L274 316 L274 332 L222 332 Z" fill="${c}"/>
  ${opts.belt ? `<path d="M120 236 L280 236 L280 258 L120 258 Z" fill="${c}"/><path d="M120 236 L280 236 L280 258 L120 258 Z" fill="#000" fill-opacity=".1"/>
  <rect x="226" y="232" width="22" height="30" rx="3" fill="none" stroke="#1b1e24" stroke-opacity=".7" stroke-width="3"/>
  <path d="M118 54 L150 46 L152 60 L120 68 Z M282 54 L250 46 L248 60 L280 68 Z" fill="${c}"/>` : ""}
</g>`;
}

function coat(c: string) {
   return `${coatBase(c)}
${buttons(c, [[182, 232], [246, 232], [182, 290], [246, 290]], 6)}
${stitch(c, "M118 450 L282 450 M58 356 L104 362 M342 356 L296 362 M160 82 L198 196")}
${folds(["M150 350 Q146 400 140 452", "M260 350 Q264 400 262 452"], 0.18)}`;
}

function trench(c: string) {
   return `${coatBase(c, { belt: true, long: true })}
${buttons(c, [[176, 190], [240, 190], [176, 296], [240, 296], [176, 340], [240, 340]], 5.5)}
${stitch(c, "M116 460 L284 460 M58 356 L104 362 M342 356 L296 362 M160 82 L198 196 M124 242 L276 242 M124 252 L276 252")}
${folds(["M150 360 Q146 410 140 462", "M262 360 Q266 410 264 462", "M170 270 L160 330", "M236 270 L246 330"], 0.16)}`;
}

/* ───────────── Knitwear ───────────── */

const SW = {
   BODY: "M162 34 L112 60 L120 160 L122 372 L278 372 L280 160 L288 60 L238 34 Q200 76 162 34 Z",
   SL: "M112 60 L76 86 Q58 200 52 338 L102 344 Q114 240 120 160 Z",
   SR: "M288 60 L324 86 Q342 200 348 338 L298 344 Q286 240 280 160 Z",
   CL: "M52 338 L102 344 L100 382 L50 376 Z",
   CR: "M348 338 L298 344 L300 382 L350 376 Z",
   HEM: "M122 372 L278 372 L280 412 L120 412 Z",
   NECK: "M154 30 Q200 92 246 30 L238 34 Q200 76 162 34 Z",
};

function knitBase(c: string, opts: { pattern?: string; neck?: boolean } = {}) {
   return `<g ${OUT}>
  <path d="${SW.SL}" fill="${c}"/><path d="${SW.SR}" fill="${c}"/>
  <path d="${SW.SL}" fill="url(#knit)" stroke="none"/><path d="${SW.SR}" fill="url(#knit)" stroke="none"/>
  <path d="${SW.SL}" fill="#000" fill-opacity=".1"/><path d="${SW.SR}" fill="#000" fill-opacity=".14"/>
  <path d="${SW.CL}" fill="${c}"/><path d="${SW.CR}" fill="${c}"/>
  <path d="${SW.CL}" fill="url(#rib)"/><path d="${SW.CR}" fill="url(#rib)"/>
  <path d="${SW.BODY}" fill="${c}"/><path d="${SW.BODY}" fill="url(#${opts.pattern ?? "knit"})" stroke="none"/><path d="${SW.BODY}" fill="url(#shade)" stroke="none"/>
  <path d="${SW.HEM}" fill="${c}"/><path d="${SW.HEM}" fill="url(#rib)"/>
  <path d="M162 34 Q200 46 238 34 Q200 58 162 34 Z" fill="#000" fill-opacity=".3"/>
  ${opts.neck === false ? "" : `<path d="${SW.NECK}" fill="${c}"/><path d="${SW.NECK}" fill="url(#rib)"/>`}
</g>
${folds(["M150 220 Q160 290 152 360", "M252 230 Q244 300 250 362", "M80 170 Q74 240 72 300"], 0.14)}`;
}

const sweater = (c: string) => shift(knitBase(c));

function cardigan(c: string) {
   return shift(`${knitBase(c, { pattern: "cable", neck: false })}
<g ${OUT}>
  <path d="M162 34 L190 150 L190 412 L210 412 L210 150 L238 34 L226 34 L200 132 L174 34 Z" fill="${c}"/>
</g>
<path d="M162 34 L190 150 L190 412 L210 412 L210 150 L238 34 L226 34 L200 132 L174 34 Z" fill="url(#rib)"/>
<path d="M200 150 L200 412" stroke="#000" stroke-opacity=".3"/>
${buttons(c, [[200, 176], [200, 220], [200, 264], [200, 308], [200, 352]], 5)}
<g fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"><path d="M140 300 h36 v40 h-36 Z M224 300 h36 v40 h-36 Z"/></g>`);
}

function polo(c: string) {
   return shift(`${knitBase(c, { neck: false })}
<g ${OUT}>
  <path d="M162 34 Q200 46 238 34 L262 60 L214 104 L200 70 L186 104 L138 60 Z" fill="${c}"/>
  <path d="M188 62 L212 62 L212 150 L188 150 Z" fill="${c}"/>
</g>
<path d="M162 34 Q200 46 238 34 L262 60 L214 104 L200 70 L186 104 L138 60 Z" fill="url(#rib)"/>
${buttons(c, [[200, 96], [200, 128]], 4)}`);
}

function rollneck(c: string) {
   return shift(`${knitBase(c, { neck: false })}
<g ${OUT}>
  <path d="M158 -4 Q200 6 242 -4 L246 42 Q200 58 154 42 Z" fill="${c}"/>
</g>
<path d="M158 -4 Q200 6 242 -4 L246 42 Q200 58 154 42 Z" fill="url(#rib)"/>
<path d="M156 18 Q200 30 244 18" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`, 34);
}

/* ───────────── Shirts & tees ───────────── */

function shirtBase(c: string, opts: { pocket?: boolean; texture?: string; collar?: "point" | "camp" | "round"; fitted?: boolean } = {}) {
   const waist = opts.fitted ? 134 : 128;
   const BODY = `M166 40 L122 62 L128 150 L${waist} 410 Q200 424 ${400 - waist} 410 L272 150 L278 62 L234 40 Q200 52 166 40 Z`;
   const SL = "M122 62 L90 80 Q70 200 62 340 L104 346 Q114 240 128 150 Z";
   const SR = "M278 62 L310 80 Q330 200 338 340 L296 346 Q286 240 272 150 Z";
   const tex = opts.texture ?? "twill";
   const collar =
      opts.collar === "camp"
         ? `<path d="M166 40 L146 70 L184 118 L200 66 Z" fill="${c}"/><path d="M234 40 L254 70 L216 118 L200 66 Z" fill="${c}"/>`
         : opts.collar === "round"
           ? `<path d="M166 40 Q150 76 196 84 L200 64 Z" fill="${c}"/><path d="M234 40 Q250 76 204 84 L200 64 Z" fill="${c}"/>`
           : `<path d="M166 40 L156 82 L192 76 L200 60 Z" fill="${c}"/><path d="M234 40 L244 82 L208 76 L200 60 Z" fill="${c}"/>`;
   return `<g ${OUT}>
  <path d="${SL}" fill="${c}"/><path d="${SR}" fill="${c}"/>
  <path d="${SL}" fill="url(#${tex})" stroke="none"/><path d="${SR}" fill="url(#${tex})" stroke="none"/>
  <path d="${SL}" fill="#000" fill-opacity=".07"/><path d="${SR}" fill="#000" fill-opacity=".11"/>
  <path d="M62 340 L104 346 L102 376 L60 370 Z" fill="${c}"/><path d="M338 340 L296 346 L298 376 L340 370 Z" fill="${c}"/>
  <path d="${BODY}" fill="${c}"/><path d="${BODY}" fill="url(#${tex})" stroke="none"/><path d="${BODY}" fill="url(#shade)" stroke="none"/>
  <path d="M166 40 Q200 52 234 40 Q200 62 166 40 Z" fill="#000" fill-opacity=".3"/>
  <path d="M193 66 L207 66 L207 418 L193 418 Z" fill="${c}"/>
  ${collar}
  ${opts.pocket ? `<path d="M218 140 L256 140 L256 182 L237 190 L218 182 Z" fill="${c}"/>` : ""}
</g>`;
}

function shirt(c: string) {
   return shift(`${shirtBase(c, { pocket: true })}
${stitch(c, "M196 70 L196 414 M204 70 L204 414 M64 352 L102 358 M336 352 L298 358 M222 146 L252 146")}
${buttons(c, [[200, 98], [200, 150], [200, 202], [200, 254], [200, 306], [200, 358]], 3.6)}
${buttons(c, [[82, 360], [318, 360]], 3)}
${folds(["M154 230 Q162 300 156 390", "M250 240 Q242 310 248 392", "M92 160 Q86 230 84 300"], 0.1)}`);
}

function linenShirt(c: string) {
   return shift(`${shirtBase(c, { texture: "linen", collar: "camp" })}
${stitch(c, "M196 70 L196 414 M204 70 L204 414")}
${buttons(c, [[200, 128], [200, 186], [200, 244], [200, 302], [200, 360]], 3.6)}
${folds(["M150 200 Q164 260 150 330 Q144 370 158 400", "M256 210 Q240 280 254 340", "M96 170 Q84 240 90 310", "M310 180 Q318 250 312 320"], 0.12)}`);
}

function blouse(c: string) {
   return shift(`${shirtBase(c, { collar: "round", fitted: true, texture: "linen" })}
${stitch(c, "M196 70 L196 414 M204 70 L204 414 M168 180 Q170 260 160 330 M232 180 Q230 260 240 330")}
${buttons(c, [[200, 104], [200, 160], [200, 216], [200, 272], [200, 328], [200, 384]], 3.2)}`);
}

function tee(c: string) {
   const BODY = "M162 40 L108 60 L56 116 L90 166 L124 140 L126 404 L274 404 L276 140 L310 166 L344 116 L292 60 L238 40 Q200 70 162 40 Z";
   return shift(`<g ${OUT}>
  <path d="${BODY}" fill="${c}"/><path d="${BODY}" fill="url(#knit)" stroke="none" opacity=".5"/><path d="${BODY}" fill="url(#shade)" stroke="none"/>
  <path d="M162 40 Q200 52 238 40 Q200 62 162 40 Z" fill="#000" fill-opacity=".25"/>
  <path d="M156 37 Q200 84 244 37 L238 40 Q200 70 162 40 Z" fill="${c}"/>
</g>
<path d="M156 37 Q200 84 244 37 L238 40 Q200 70 162 40 Z" fill="url(#rib)"/>
${stitch(c, "M130 392 L270 392 M64 126 L94 156 M336 126 L306 156")}
${folds(["M150 220 Q158 300 152 390", "M252 230 Q244 310 250 392"], 0.1)}`);
}

/* ───────────── Trousers ───────────── */

function trouserBase(c: string, legs: string, tex = "twill") {
   const WAIST = "M128 28 L272 28 L273 54 L127 54 Z";
   return `<g ${OUT}>
  <path d="${legs}" fill="${c}"/><path d="${legs}" fill="url(#${tex})" stroke="none"/><path d="${legs}" fill="url(#shade)" stroke="none"/>
  <path d="${WAIST}" fill="${c}"/><path d="${WAIST}" fill="#000" fill-opacity=".08"/>
  <rect x="148" y="24" width="8" height="34" rx="2" fill="${c}"/><rect x="244" y="24" width="8" height="34" rx="2" fill="${c}"/><rect x="196" y="24" width="8" height="34" rx="2" fill="${c}"/>
  <path d="M200 54 L200 150" fill="none"/>
</g>
<circle cx="212" cy="41" r="4" fill="${buttonFill(c)}"/>`;
}

function pleated(c: string) {
   const LEGS = "M127 52 L112 420 L190 422 L200 150 L210 422 L288 420 L273 52 Z";
   return shift(`${trouserBase(c, LEGS)}
<g fill="none" ${OUT}><path d="M142 54 Q154 86 128 104"/><path d="M258 54 Q246 86 272 104"/></g>
${stitch(c, "M212 56 L212 124 Q212 140 200 144 M118 408 L188 410 M212 410 L282 408")}
${folds(["M172 54 L164 190", "M228 54 L236 190", "M160 110 L152 418", "M240 110 L248 418", "M182 54 L178 120", "M218 54 L222 120"], 0.17)}`);
}

function wideLeg(c: string) {
   const LEGS = "M127 52 L84 420 L192 424 L200 160 L208 424 L316 420 L273 52 Z";
   return shift(`${trouserBase(c, LEGS)}
<g fill="none" ${OUT}><path d="M142 54 Q154 86 128 104"/><path d="M258 54 Q246 86 272 104"/></g>
${stitch(c, "M212 56 L212 124 Q212 140 200 144 M90 408 L190 412 M210 412 L310 408")}
${folds(["M168 54 L148 420", "M232 54 L252 420", "M180 54 L176 130", "M220 54 L224 130"], 0.15)}`);
}

function chino(c: string) {
   const LEGS = "M127 52 L120 420 L188 422 L200 156 L212 422 L280 420 L273 52 Z";
   return shift(`${trouserBase(c, LEGS)}
<g fill="none" ${OUT}><path d="M134 54 L150 110"/><path d="M266 54 L250 110"/></g>
${stitch(c, "M212 56 L212 124 Q212 140 200 144 M124 404 L188 406 M212 406 L276 404 M138 54 L154 108 M262 54 L246 108")}
${folds(["M160 120 L156 418", "M240 120 L244 418", "M150 380 Q170 386 186 380", "M214 380 Q230 386 250 380"], 0.12)}`);
}

function jean(c: string) {
   const LEGS = "M127 52 L118 420 L190 422 L200 158 L210 422 L282 420 L273 52 Z";
   const thread = "#d39a3a";
   return shift(`${trouserBase(c, LEGS, "denim")}
<g fill="none" ${OUT}><path d="M138 54 Q150 96 128 108"/><path d="M262 54 Q250 96 272 108"/><path d="M236 62 h22 v20 h-22 Z"/></g>
<g fill="none" stroke="${thread}" stroke-opacity=".85" stroke-width="1.2" stroke-dasharray="3 2.5">
  <path d="M212 56 L212 128 Q212 144 200 148"/><path d="M142 58 Q152 96 132 106"/><path d="M258 58 Q248 96 268 106"/>
  <path d="M130 32 L270 32 M130 50 L270 50"/><path d="M122 410 L188 412 M212 412 L278 410"/><path d="M164 60 L158 418 M236 60 L242 418"/>
</g>
<g fill="#c08a2b"><circle cx="136" cy="104" r="2.5"/><circle cx="264" cy="104" r="2.5"/><circle cx="240" cy="64" r="2"/><circle cx="256" cy="64" r="2"/></g>
${folds(["M150 300 Q170 306 188 300", "M212 300 Q230 306 250 300", "M146 360 Q168 366 188 360", "M212 360 Q232 366 254 360"], 0.12)}`);
}

/* ───────────── Bags ───────────── */

function tote(c: string) {
   const HANDLE = "M150 156 Q146 40 200 40 Q254 40 250 156";
   const BAG = "M98 150 L302 150 L322 412 L78 412 Z";
   const label = isDark(c) ? "#e8e1d0" : "#1b1e24";
   return shift(`<g fill="none" stroke-linecap="round">
  <path d="${HANDLE}" stroke="#1b1e24" stroke-opacity=".55" stroke-width="18"/>
  <path d="${HANDLE}" stroke="${c}" stroke-width="14"/><path d="${HANDLE}" stroke="#000" stroke-opacity=".12" stroke-width="14"/>
</g>
<g ${OUT}>
  <path d="${BAG}" fill="${c}"/><path d="${BAG}" fill="url(#shade)" stroke="none"/><path d="${BAG}" fill="url(#grain)" stroke="none"/>
  <path d="M98 150 L302 150 L304 178 L96 178 Z" fill="${c}"/>
</g>
<rect x="164" y="252" width="72" height="34" rx="3" fill="none" stroke="${label}" stroke-opacity=".6" stroke-width="1.5"/>
<path d="M176 262 L188 276 L200 262 M206 262 L224 262" fill="none" stroke="${label}" stroke-opacity=".7" stroke-width="2"/>
${stitch(c, "M100 172 L300 172 M84 400 L316 400 M146 150 L146 190 M254 150 L254 190")}`);
}

function crossbody(c: string) {
   const BAG = "M96 210 Q96 186 120 186 L280 186 Q304 186 304 210 L304 380 Q304 400 284 400 L116 400 Q96 400 96 380 Z";
   const FLAP = "M96 210 Q96 186 120 186 L280 186 Q304 186 304 210 L304 300 Q200 330 96 300 Z";
   return `<path d="M108 196 Q130 20 200 20 Q270 20 292 196" fill="none" stroke="#1b1e24" stroke-opacity=".55" stroke-width="12"/>
<path d="M108 196 Q130 20 200 20 Q270 20 292 196" fill="none" stroke="${c}" stroke-width="9"/>
<path d="M108 196 Q130 20 200 20 Q270 20 292 196" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="9"/>
<g ${OUT}>
  <path d="${BAG}" fill="${c}"/><path d="${BAG}" fill="url(#shade)" stroke="none"/><path d="${BAG}" fill="url(#grain)" stroke="none"/>
  <path d="${FLAP}" fill="${c}"/><path d="${FLAP}" fill="#000" fill-opacity=".08"/><path d="${FLAP}" fill="url(#grain)" stroke="none"/>
  <rect x="100" y="188" width="14" height="22" rx="3" fill="#b9b2a2"/><rect x="286" y="188" width="14" height="22" rx="3" fill="#b9b2a2"/>
</g>
<rect x="188" y="300" width="24" height="18" rx="4" fill="#c9c2b0" stroke="#1b1e24" stroke-opacity=".55"/>
${stitch(c, "M108 212 Q108 198 122 198 L278 198 Q292 198 292 212 L292 294 Q200 320 108 294 Z M106 388 L294 388")}
${folds(["M130 330 Q140 360 132 392", "M270 330 Q262 360 270 392"], 0.1)}`;
}

function weekender(c: string) {
   const BAG = "M40 250 Q40 184 110 180 L290 180 Q360 184 360 250 L360 392 Q360 412 340 412 L60 412 Q40 412 40 392 Z";
   const leather = c === "#ffffff" ? "#ffffff" : isDark(c) ? "#7a5636" : "#5b3d26";
   return `<g fill="none" stroke-linecap="round">
  <path d="M140 186 Q140 110 200 110 Q260 110 260 186" stroke="#1b1e24" stroke-opacity=".55" stroke-width="18"/>
  <path d="M140 186 Q140 110 200 110 Q260 110 260 186" stroke="${leather}" stroke-width="14"/>
</g>
<g ${OUT}>
  <path d="${BAG}" fill="${c}"/><path d="${BAG}" fill="url(#twill)" stroke="none"/><path d="${BAG}" fill="url(#shade)" stroke="none"/><path d="${BAG}" fill="url(#sheen)" stroke="none"/>
  <path d="M120 180 L150 180 L150 412 L120 412 Z" fill="${leather}"/><path d="M250 180 L280 180 L280 412 L250 412 Z" fill="${leather}"/>
  <path d="M40 330 L360 330 L360 392 Q360 412 340 412 L60 412 Q40 412 40 392 Z" fill="${leather}" fill-opacity=".95"/>
</g>
<path d="M70 196 Q200 186 330 196" fill="none" stroke="#1b1e24" stroke-opacity=".6" stroke-width="3"/>
<path d="M70 196 Q200 186 330 196" fill="none" stroke="#c9c2b0" stroke-width="1.2" stroke-dasharray="2 2"/>
<rect x="318" y="190" width="10" height="20" rx="2" fill="#b9b2a2" stroke="#1b1e24" stroke-opacity=".5"/>
<g fill="none" stroke="#f1e6d0" stroke-opacity=".5" stroke-dasharray="3 3"><path d="M124 186 V406 M146 186 V406 M254 186 V406 M276 186 V406 M46 336 H354"/></g>`;
}

function cardHolder(c: string) {
   const BODY = "M90 160 Q90 140 110 140 L290 140 Q310 140 310 160 L310 360 Q310 380 290 380 L110 380 Q90 380 90 360 Z";
   const edge = isDark(c) ? "#6a4b33" : darken(c, 0.35);
   return `<g transform="rotate(-6 200 260)">
<g ${OUT}>
  <path d="${BODY}" fill="${c}"/><path d="${BODY}" fill="url(#grain)" stroke="none"/><path d="${BODY}" fill="url(#shade)" stroke="none"/>
  <path d="M90 200 Q200 214 310 200 L310 360 Q310 380 290 380 L110 380 Q90 380 90 360 Z" fill="${c}"/>
  <path d="M90 200 Q200 214 310 200 L310 360 Q310 380 290 380 L110 380 Q90 380 90 360 Z" fill="#000" fill-opacity=".06"/>
  <path d="M90 250 Q200 262 310 250 L310 360 Q310 380 290 380 L110 380 Q90 380 90 360 Z" fill="${c}"/>
  <path d="M90 250 Q200 262 310 250 L310 360 Q310 380 290 380 L110 380 Q90 380 90 360 Z" fill="#000" fill-opacity=".1"/>
</g>
<rect x="150" y="150" width="100" height="56" rx="6" fill="#e8e1d0" stroke="#1b1e24" stroke-opacity=".35"/>
<rect x="160" y="162" width="40" height="8" rx="2" fill="#2c44d8" fill-opacity=".6"/>
<path d="${BODY}" fill="none" stroke="${edge}" stroke-width="3"/>
${stitch(c, "M100 156 L100 364 Q100 370 106 370 L294 370 Q300 370 300 364 L300 156")}
</g>`;
}

export const GARMENTS: Record<GarmentKind, (color: string) => string> = {
   overshirt, quilted, bomber, coat, trench,
   sweater, cardigan, polo, rollneck,
   shirt, "linen-shirt": linenShirt, blouse, tee,
   pleated, "wide-leg": wideLeg, chino, jean,
   tote, crossbody, weekender, "card-holder": cardHolder,
};

/** Какой рисунок у какого фасона (ключ фасона из prisma/catalog-data.ts) */
export const STYLE_GARMENT: Record<string, GarmentKind> = {
   "field-overshirt": "overshirt",
   "harbour-coat": "coat",
   "quilted-liner-jacket": "quilted",
   "wool-trench": "trench",
   "ripstop-bomber": "bomber",
   "merino-crew": "sweater",
   "cable-cardigan": "cardigan",
   "lambswool-polo": "polo",
   "fine-rollneck": "rollneck",
   "oxford-shirt": "shirt",
   "linen-shirt": "linen-shirt",
   "heavy-tee": "tee",
   "poplin-blouse": "blouse",
   "pleated-trouser": "pleated",
   "wide-leg-wool": "wide-leg",
   "canvas-chino": "chino",
   "selvedge-jean": "jean",
   "everyday-tote": "tote",
   "leather-crossbody": "crossbody",
   "waxed-weekender": "weekender",
   "card-holder": "card-holder",
};

/** Где на вещи интересная деталь: область для крупного плана (x, y, ширина в координатах рамки 400 × 480) */
export const DETAIL_FOCUS: Record<GarmentKind, [number, number, number]> = {
   overshirt: [120, 40, 160], quilted: [110, 60, 170], bomber: [120, 40, 160], coat: [130, 20, 150], trench: [100, 200, 200],
   sweater: [130, 30, 140], cardigan: [140, 140, 120], polo: [130, 40, 140], rollneck: [130, 20, 140],
   shirt: [140, 50, 130], "linen-shirt": [130, 50, 140], blouse: [140, 50, 120], tee: [130, 40, 140],
   pleated: [120, 30, 160], "wide-leg": [110, 30, 180], chino: [110, 30, 180], jean: [190, 40, 110],
   tote: [130, 220, 140], crossbody: [140, 250, 120], weekender: [230, 160, 140], "card-holder": [120, 130, 160],
};

export const isTop = (k: GarmentKind) => !["pleated", "wide-leg", "chino", "jean", "tote", "crossbody", "weekender", "card-holder"].includes(k);
export const isBag = (k: GarmentKind) => ["tote", "crossbody", "weekender", "card-holder"].includes(k);
