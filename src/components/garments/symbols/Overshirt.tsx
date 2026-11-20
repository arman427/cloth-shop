const BODY =
   "M166 34 L120 62 L127 152 L128 404 Q200 412 272 404 L273 152 L280 62 L234 34 Q200 46 166 34 Z";
const SLEEVE_L = "M120 62 L86 80 Q66 190 56 334 L100 340 Q112 236 127 152 Z";
const SLEEVE_R = "M280 62 L314 80 Q334 190 344 334 L300 340 Q288 236 273 152 Z";
const COLLAR_R = "M234 34 L248 68 L220 100 L200 62 Q214 48 234 34 Z";

export function OvershirtSymbol() {
   return (
      <symbol id="g-overshirt" viewBox="0 0 400 440">
         <g stroke="#1b1e24" strokeOpacity={0.6} strokeWidth={1.5} strokeLinejoin="round">
            <path d={SLEEVE_L} fill="currentColor" />
            <path d={SLEEVE_R} fill="currentColor" />
            <path d={SLEEVE_L} fill="#000" fillOpacity={0.09} />
            <path d={SLEEVE_R} fill="#000" fillOpacity={0.13} />
            <path d="M56 334 L100 340 L98 368 L53 362 Z" fill="currentColor" />
            <path d="M344 334 L300 340 L302 368 L347 362 Z" fill="currentColor" />
            <path d={BODY} fill="currentColor" />
            <path d={BODY} fill="url(#garment-shade)" stroke="none" />
            <path d={BODY} fill="url(#garment-twill)" stroke="none" />
            <path d="M166 34 Q200 46 234 34 Q200 60 166 34 Z" fill="#000" fillOpacity={0.35} />
            <path d="M192 64 L208 64 L208 409 L192 409 Z" fill="currentColor" />
            <path d="M166 34 L152 68 L180 100 L200 62 Q186 48 166 34 Z" fill="currentColor" />
            <path d={COLLAR_R} fill="currentColor" />
            <path d={COLLAR_R} fill="#000" fillOpacity={0.08} />
            <rect x="138" y="152" width="46" height="56" rx="2" fill="currentColor" />
            <path d="M135 146 L187 146 L187 164 L161 172 L135 164 Z" fill="currentColor" />
            <rect x="216" y="152" width="46" height="56" rx="2" fill="currentColor" />
            <path d="M213 146 L265 146 L265 164 L239 172 L213 164 Z" fill="currentColor" />
            <rect x="216" y="152" width="46" height="56" rx="2" fill="#000" fillOpacity={0.07} />
         </g>
         <g fill="none" stroke="#1b1e24" strokeOpacity={0.45} strokeWidth={1} strokeDasharray="3 3">
            <path d="M124 96 Q200 104 276 96" />
            <path d="M134 396 Q200 402 266 396" />
            <path d="M196 68 L196 404 M204 68 L204 404" />
            <path d="M142 168 L142 204 L180 204 L180 168" />
            <path d="M220 168 L220 204 L258 204 L258 168" />
            <path d="M58 346 L100 352 M342 346 L300 352" />
            <path d="M139 150 L183 150 M217 150 L261 150" />
         </g>
         <g fill="#2a2620">
            {[118, 170, 222, 274, 326, 378].map((cy) => (
               <circle key={cy} cx="200" cy={cy} r="5" />
            ))}
            <circle cx="161" cy="164" r="3.5" />
            <circle cx="239" cy="164" r="3.5" />
            <circle cx="77" cy="355" r="3.5" />
            <circle cx="323" cy="355" r="3.5" />
         </g>
         <g fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={2} strokeLinecap="round">
            <path d="M150 230 Q160 300 152 388" />
            <path d="M252 240 Q244 310 250 390" />
            <path d="M86 150 Q80 220 78 300" />
            <path d="M318 160 Q322 240 324 310" />
         </g>
      </symbol>
   );
}
