const LEGS = "M127 52 L112 420 L190 422 L200 150 L210 422 L288 420 L273 52 Z";
const WAISTBAND = "M128 28 L272 28 L273 54 L127 54 Z";

export function TrouserSymbol() {
   return (
      <symbol id="g-trouser" viewBox="0 0 400 440">
         <g stroke="#1b1e24" strokeOpacity={0.6} strokeWidth={1.5} strokeLinejoin="round">
            <path d={LEGS} fill="currentColor" />
            <path d={LEGS} fill="url(#garment-shade)" stroke="none" />
            <path d={WAISTBAND} fill="currentColor" />
            <path d={WAISTBAND} fill="#000" fillOpacity={0.08} />
            <rect x="148" y="24" width="8" height="34" rx="2" fill="currentColor" />
            <rect x="244" y="24" width="8" height="34" rx="2" fill="currentColor" />
            <rect x="196" y="24" width="8" height="34" rx="2" fill="currentColor" />
            <path d="M142 54 Q154 86 128 104" fill="none" />
            <path d="M258 54 Q246 86 272 104" fill="none" />
            <path d="M200 54 L200 150" fill="none" />
         </g>
         <circle cx="212" cy="41" r="4" fill="#1b1e24" fillOpacity={0.7} />
         <g fill="none" stroke="#1b1e24" strokeOpacity={0.45} strokeWidth={1} strokeDasharray="3 3">
            <path d="M212 56 L212 124 Q212 140 200 144" />
            <path d="M118 408 L188 410 M212 410 L282 408" />
         </g>
         <g fill="none" stroke="#000" strokeOpacity={0.16} strokeWidth={1.6} strokeLinecap="round">
            <path d="M172 54 L164 190" />
            <path d="M228 54 L236 190" />
            <path d="M160 110 L152 418" strokeOpacity={0.1} />
            <path d="M240 110 L248 418" strokeOpacity={0.1} />
            <path d="M190 160 Q184 200 188 230" />
            <path d="M210 160 Q216 200 212 230" />
         </g>
      </symbol>
   );
}
