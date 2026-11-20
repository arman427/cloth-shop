import { CoatSymbol } from "./symbols/Coat";
import { OvershirtSymbol } from "./symbols/Overshirt";
import { SweaterSymbol } from "./symbols/Sweater";
import { TeeSymbol } from "./symbols/Tee";
import { ToteSymbol } from "./symbols/Tote";
import { TrouserSymbol } from "./symbols/Trouser";

/**
 * Hidden SVG sprite with every garment flat plus the shared shading,
 * fabric textures and drop shadow. Rendered once in the root layout;
 * <Garment /> references the symbols with <use>.
 */
export function GarmentSprite() {
   return (
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
         <defs>
            <linearGradient id="garment-shade" x1="0" x2="1">
               <stop offset="0" stopColor="#000" stopOpacity={0.16} />
               <stop offset="0.28" stopColor="#000" stopOpacity={0} />
               <stop offset="0.62" stopColor="#fff" stopOpacity={0.08} />
               <stop offset="1" stopColor="#000" stopOpacity={0.18} />
            </linearGradient>
            <pattern id="garment-knit" width="7" height="8" patternUnits="userSpaceOnUse">
               <path d="M0 0 L3.5 6 L7 0" fill="none" stroke="#000" strokeOpacity={0.1} strokeWidth={1} />
            </pattern>
            <pattern
               id="garment-twill"
               width="6"
               height="6"
               patternUnits="userSpaceOnUse"
               patternTransform="rotate(35)"
            >
               <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeOpacity={0.06} strokeWidth={2} />
            </pattern>
            <pattern id="garment-rib" width="6" height="10" patternUnits="userSpaceOnUse">
               <line x1="3" y1="0" x2="3" y2="10" stroke="#000" strokeOpacity={0.22} strokeWidth={1.2} />
            </pattern>
            <filter id="garment-drop" x="-20%" y="-20%" width="140%" height="150%">
               <feDropShadow dx="0" dy="30" stdDeviation="20" floodColor="rgb(60 40 10)" floodOpacity={0.18} />
            </filter>

            <OvershirtSymbol />
            <TrouserSymbol />
            <SweaterSymbol />
            <CoatSymbol />
            <ToteSymbol />
            <TeeSymbol />
         </defs>
      </svg>
   );
}
