const BODY =
   "M162 34 L112 60 L120 160 L122 372 L278 372 L280 160 L288 60 L238 34 Q200 76 162 34 Z";
const SLEEVE_L = "M112 60 L76 86 Q58 200 52 338 L102 344 Q114 240 120 160 Z";
const SLEEVE_R = "M288 60 L324 86 Q342 200 348 338 L298 344 Q286 240 280 160 Z";
const CUFF_L = "M52 338 L102 344 L100 382 L50 376 Z";
const CUFF_R = "M348 338 L298 344 L300 382 L350 376 Z";
const HEM = "M122 372 L278 372 L280 412 L120 412 Z";
const NECK = "M154 30 Q200 92 246 30 L238 34 Q200 76 162 34 Z";

export function SweaterSymbol() {
   return (
      <symbol id="g-sweater" viewBox="0 0 400 440">
         <g stroke="#1b1e24" strokeOpacity={0.55} strokeWidth={1.5} strokeLinejoin="round">
            <path d={SLEEVE_L} fill="currentColor" />
            <path d={SLEEVE_R} fill="currentColor" />
            <path d={SLEEVE_L} fill="#000" fillOpacity={0.1} />
            <path d={SLEEVE_R} fill="#000" fillOpacity={0.14} />
            <path d={CUFF_L} fill="currentColor" />
            <path d={CUFF_R} fill="currentColor" />
            <path d={CUFF_L} fill="url(#garment-rib)" />
            <path d={CUFF_R} fill="url(#garment-rib)" />
            <path d={BODY} fill="currentColor" />
            <path d={BODY} fill="url(#garment-knit)" stroke="none" />
            <path d={BODY} fill="url(#garment-shade)" stroke="none" />
            <path d={HEM} fill="currentColor" />
            <path d={HEM} fill="url(#garment-rib)" />
            <path d="M162 34 Q200 46 238 34 Q200 58 162 34 Z" fill="#000" fillOpacity={0.3} />
            <path d={NECK} fill="currentColor" />
            <path d={NECK} fill="url(#garment-rib)" />
         </g>
         <g fill="none" stroke="#000" strokeOpacity={0.14} strokeWidth={2} strokeLinecap="round">
            <path d="M150 220 Q160 290 152 360" />
            <path d="M252 230 Q244 300 250 362" />
            <path d="M80 170 Q74 240 72 300" />
         </g>
      </symbol>
   );
}
