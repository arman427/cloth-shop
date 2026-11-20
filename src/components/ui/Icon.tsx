import type { SVGProps } from "react";
import { cn } from "@/utils";

const PATHS = {
   search: (
      <>
         <circle cx="11" cy="11" r="7" />
         <path d="M20 20l-3.5-3.5" />
      </>
   ),
   user: (
      <>
         <circle cx="12" cy="8" r="4" />
         <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </>
   ),
   heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
   bag: (
      <>
         <path d="M5 8h14l-1 13H6L5 8z" />
         <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
   ),
   chevronLeft: <path d="M15 5l-7 7 7 7" />,
   chevronRight: <path d="M9 5l7 7-7 7" />,
   chevronDown: <path d="M5 9l7 7 7-7" />,
   arrowRight: <path d="M4 12h16M14 6l6 6-6 6" />,
   arrowLeft: <path d="M20 12H4M10 6l-6 6 6 6" />,
   menu: <path d="M4 7h16M4 12h16M4 17h16" />,
   check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
   x: <path d="M6 6l12 12M18 6L6 18" />,
   plus: <path d="M12 5v14M5 12h14" />,
   minus: <path d="M5 12h14" />,
   trash: (
      <>
         <path d="M4 7h16" />
         <path d="M9 7V4h6v3" />
         <path d="M6 7l1 13h10l1-13" />
      </>
   ),
   image: (
      <>
         <rect x="3" y="4" width="18" height="16" rx="2" />
         <circle cx="9" cy="10" r="1.8" />
         <path d="M3 17l5-4.5 4 3.5 3-2.5 6 4.5" />
      </>
   ),
   eye: (
      <>
         <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
         <circle cx="12" cy="12" r="3" />
      </>
   ),
   eyeOff: (
      <>
         <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
         <circle cx="12" cy="12" r="3" />
         <path d="M4 4l16 16" />
      </>
   ),
   mail: (
      <>
         <rect x="3" y="5" width="18" height="14" rx="2" />
         <path d="M3 7l9 6 9-6" />
      </>
   ),
   pin: (
      <>
         <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
         <circle cx="12" cy="10" r="2.5" />
      </>
   ),
   clock: (
      <>
         <circle cx="12" cy="12" r="9" />
         <path d="M12 7v5l3 2" />
      </>
   ),
   phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
   truck: (
      <>
         <path d="M3 6h11v10H3z" />
         <path d="M14 10h4l3 3v3h-7" />
         <circle cx="7" cy="17.5" r="1.8" />
         <circle cx="17" cy="17.5" r="1.8" />
      </>
   ),
   returns: (
      <>
         <path d="M20 12a8 8 0 1 1-2.5-5.8" />
         <path d="M20 4v5h-5" />
      </>
   ),
   ruler: (
      <>
         <path d="M3 15L15 3l6 6L9 21z" />
         <path d="M7 11l2 2M10 8l2 2M13 5l2 2" />
      </>
   ),
   scissors: (
      <>
         <circle cx="6" cy="7" r="2.5" />
         <circle cx="6" cy="17" r="2.5" />
         <path d="M8 8.5L20 18M8 15.5L20 6" />
      </>
   ),
   gift: (
      <>
         <rect x="3" y="9" width="18" height="4" />
         <path d="M5 13v8h14v-8M12 9v12" />
         <path d="M12 9S9 9 8 7s1-3 2-3 2 2 2 5zm0 0s3 0 4-2-1-3-2-3-2 2-2 5z" />
      </>
   ),
   logout: (
      <>
         <path d="M9 4H5v16h4" />
         <path d="M16 8l4 4-4 4M20 12H9" />
      </>
   ),
   package: (
      <>
         <path d="M3 8l9-5 9 5v8l-9 5-9-5z" />
         <path d="M3 8l9 5 9-5M12 13v8" />
      </>
   ),
   lock: (
      <>
         <rect x="5" y="11" width="14" height="9" rx="2" />
         <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
   ),
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
   name: IconName;
   filled?: boolean;
}

export function Icon({ name, filled = false, className, ...rest }: IconProps) {
   return (
      <svg
         viewBox="0 0 24 24"
         fill={filled ? "currentColor" : "none"}
         stroke="currentColor"
         strokeWidth={1.6}
         strokeLinecap="round"
         strokeLinejoin="round"
         aria-hidden="true"
         focusable="false"
         className={cn("size-[22px] shrink-0", className)}
         {...rest}
      >
         {PATHS[name]}
      </svg>
   );
}
