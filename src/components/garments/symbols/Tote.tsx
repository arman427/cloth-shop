const HANDLE = "M150 156 Q146 40 200 40 Q254 40 250 156";
const BAG = "M98 150 L302 150 L322 412 L78 412 Z";

export function ToteSymbol() {
   return (
      <symbol id="g-tote" viewBox="0 0 400 440">
         <g fill="none" strokeLinecap="round">
            <path d={HANDLE} stroke="#1b1e24" strokeOpacity={0.55} strokeWidth={18} />
            <path d={HANDLE} stroke="currentColor" strokeWidth={14} />
            <path d={HANDLE} stroke="#000" strokeOpacity={0.12} strokeWidth={14} />
         </g>
         <g stroke="#1b1e24" strokeOpacity={0.55} strokeWidth={1.5} strokeLinejoin="round">
            <path d={BAG} fill="currentColor" />
            <path d={BAG} fill="url(#garment-shade)" stroke="none" />
            <path d={BAG} fill="url(#garment-twill)" stroke="none" />
            <path d="M98 150 L302 150 L304 178 L96 178 Z" fill="currentColor" />
            <rect x="160" y="250" width="80" height="40" rx="3" fill="#1b1e24" fillOpacity={0.85} />
         </g>
         <text
            x="200"
            y="276"
            textAnchor="middle"
            fontSize="18"
            letterSpacing="3"
            fill="#E8E1D0"
            style={{ fontFamily: "var(--font-anton), 'Arial Narrow', sans-serif" }}
         >
            VELLUM
         </text>
         <g fill="none" stroke="#1b1e24" strokeOpacity={0.4} strokeDasharray="3 3">
            <path d="M100 172 L300 172" />
            <path d="M84 400 L316 400" />
            <path d="M146 150 L146 190 M254 150 L254 190" />
         </g>
      </symbol>
   );
}
