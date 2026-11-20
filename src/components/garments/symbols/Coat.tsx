const BODY =
   "M166 30 L116 54 L122 150 L110 462 L290 462 L278 150 L284 54 L234 30 Q200 40 166 30 Z";
const SLEEVE_L = "M116 54 L82 74 Q62 210 56 368 L104 374 Q112 260 122 150 Z";
const SLEEVE_R = "M284 54 L318 74 Q338 210 344 368 L296 374 Q288 260 278 150 Z";
const LAPEL_R = "M234 30 L252 62 L234 82 L246 98 L216 196 L200 70 Z";
const POCKET_R = "M222 316 L274 316 L274 332 L222 332 Z";

export function CoatSymbol() {
   return (
      <symbol id="g-coat" viewBox="0 0 400 480">
         <g stroke="#0e1118" strokeOpacity={0.7} strokeWidth={1.5} strokeLinejoin="round">
            <path d={SLEEVE_L} fill="currentColor" />
            <path d={SLEEVE_R} fill="currentColor" />
            <path d={SLEEVE_L} fill="#000" fillOpacity={0.14} />
            <path d={SLEEVE_R} fill="#000" fillOpacity={0.2} />
            <path d={BODY} fill="currentColor" />
            <path d={BODY} fill="url(#garment-shade)" stroke="none" />
            <path d={BODY} fill="url(#garment-twill)" stroke="none" />
            <path d="M166 30 Q200 40 234 30 Q200 56 166 30 Z" fill="#000" fillOpacity={0.4} />
            <path d="M214 196 L214 462" fill="none" />
            <path d="M166 30 L148 62 L166 82 L154 98 L200 212 L200 70 Z" fill="currentColor" />
            <path d={LAPEL_R} fill="currentColor" />
            <path d={LAPEL_R} fill="#000" fillOpacity={0.12} />
            <path d="M126 316 L178 316 L178 332 L126 332 Z" fill="currentColor" />
            <path d={POCKET_R} fill="currentColor" />
            <path d={POCKET_R} fill="#000" fillOpacity={0.1} />
            <path d="M136 168 L172 168" fill="none" />
         </g>
         <g fill="#0e1118" fillOpacity={0.85}>
            <circle cx="182" cy="232" r="6" />
            <circle cx="246" cy="232" r="6" />
            <circle cx="182" cy="290" r="6" />
            <circle cx="246" cy="290" r="6" />
         </g>
         <g fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={1} strokeDasharray="3 3">
            <path d="M118 450 L282 450" />
            <path d="M58 356 L104 362 M342 356 L296 362" />
            <path d="M160 82 L198 196" />
         </g>
         <g fill="none" stroke="#000" strokeOpacity={0.18} strokeWidth={2} strokeLinecap="round">
            <path d="M150 350 Q146 400 140 452" />
            <path d="M260 350 Q264 400 262 452" />
         </g>
      </symbol>
   );
}
