import { getT } from "@/lib/i18n/server";

const FRONT = "M60 70 L150 52 Q170 92 214 84 L232 116 Q222 176 238 226 L254 560 L76 580 Z";
const BACK = "M286 60 L396 48 L430 92 Q420 166 436 222 L452 560 L298 572 Z";
const SLEEVE = "M478 170 Q544 52 610 170 L596 420 L492 420 Z";
const PIECE_FILL = "rgba(124,140,255,.06)";

/** Inset copy of a piece, used for the dashed seam allowance line. */
const inset = (cx: number, cy: number, scale: number) =>
   `translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`;

const grainline = (x: number, y1: number, y2: number) =>
   `M${x} ${y1} L${x} ${y2} M${x - 6} ${y1 + 12} L${x} ${y1} L${x + 6} ${y1 + 12} M${x - 6} ${y2 - 12} L${x} ${y2} L${x + 6} ${y2 - 12}`;

const LABELS = [
   { x: 82, y: 250, title: "Front panel", note: "Cut 2, self" },
   { x: 306, y: 250, title: "Back panel", note: "Cut 1 on fold" },
   { x: 494, y: 300, title: "Sleeve", note: "Cut 2" },
   { x: 514, y: 562, title: "Pocket", note: "Cut 4", noteOffset: 16 },
];

export async function PatternPieces() {
   const t = await getT();
   return (
      <svg
         viewBox="0 0 640 640"
         role="img"
         aria-label={t("Pattern pieces for the Harbour Coat: front, back, sleeve, collar and pocket")}
         className="size-full font-sans"
      >
         <g fill="none" stroke="#7C8CFF" strokeWidth={1.6} strokeLinejoin="round">
            <path d={FRONT} fill={PIECE_FILL} />
            <path d={FRONT} strokeDasharray="5 5" strokeOpacity={0.55} transform={inset(157, 316, 0.92)} />
            <path d="M98 300 L110 410 L122 300" strokeOpacity={0.8} />

            <path d={BACK} fill={PIECE_FILL} />
            <path d={BACK} strokeDasharray="5 5" strokeOpacity={0.55} transform={inset(369, 310, 0.92)} />

            <path d={SLEEVE} fill={PIECE_FILL} />
            <path d={SLEEVE} strokeDasharray="5 5" strokeOpacity={0.55} transform={inset(544, 270, 0.9)} />

            <path d="M478 470 Q544 446 610 470 L604 500 Q544 480 484 500 Z" fill={PIECE_FILL} />
            <rect x="494" y="526" width="100" height="62" rx="4" fill={PIECE_FILL} />

            <g stroke="#C9D0FF">
               <path d={grainline(150, 180, 500)} />
               <path d={grainline(394, 180, 500)} />
               <path d={grainline(544, 190, 380)} />
            </g>

            <g stroke="#fff" strokeWidth={2}>
               <path d="M230 160 L244 158" />
               <path d="M228 140 L242 138" />
               <path d="M426 170 L440 168" />
               <path d="M519 108 L528 122" />
               <path d="M569 108 L560 122" />
               <path d="M62 330 L76 330" />
               <path d="M290 330 L304 330" />
            </g>
         </g>

         <g className="text-[13px] font-semibold">
            {LABELS.map((label) => (
               <g key={label.title}>
                  <text x={label.x} y={label.y} className="fill-cobalt-soft">
                     {t(label.title)}
                  </text>
                  <text x={label.x} y={label.y + (label.noteOffset ?? 18)} className="fill-[#8189A3] text-[12px] font-medium">
                     {t(label.note)}
                  </text>
               </g>
            ))}
            <text x="520" y="520" className="fill-[#8189A3] text-[12px] font-medium">
               {t("Collar, cut 2")}
            </text>
            <text x="60" y="36" className="fill-[#8189A3] text-[12px] font-medium">
               {t("Pattern 022, Harbour Coat, size M")}
            </text>
         </g>
      </svg>
   );
}
