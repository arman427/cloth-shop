const BODY =
   "M162 40 L108 60 L56 116 L90 166 L124 140 L126 404 L274 404 L276 140 L310 166 L344 116 L292 60 L238 40 Q200 70 162 40 Z";

export function TeeSymbol() {
   return (
      <symbol id="g-tee" viewBox="0 0 400 440">
         <g stroke="#1b1e24" strokeOpacity={0.55} strokeWidth={1.5} strokeLinejoin="round">
            <path d={BODY} fill="currentColor" />
            <path d={BODY} fill="url(#garment-shade)" stroke="none" />
            <path d="M162 40 Q200 52 238 40 Q200 62 162 40 Z" fill="#000" fillOpacity={0.25} />
            <path d="M156 37 Q200 84 244 37 L238 40 Q200 70 162 40 Z" fill="currentColor" />
         </g>
         <g fill="none" stroke="#1b1e24" strokeOpacity={0.4} strokeDasharray="3 3">
            <path d="M130 392 L270 392" />
            <path d="M64 126 L94 156 M336 126 L306 156" />
         </g>
      </symbol>
   );
}
