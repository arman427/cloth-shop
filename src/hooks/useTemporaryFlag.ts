"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** A boolean that switches itself off after `duration` ms, e.g. an "Added" confirmation. */
export function useTemporaryFlag(duration = 1600): [boolean, () => void] {
   const [active, setActive] = useState(false);
   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

   const trigger = useCallback(() => {
      setActive(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(false), duration);
   }, [duration]);

   useEffect(() => () => {
      if (timer.current) clearTimeout(timer.current);
   }, []);

   return [active, trigger];
}
