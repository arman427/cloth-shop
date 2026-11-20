"use client";

import { useCallback, useState } from "react";

/** Index state for a looping set of slides. */
export function useCarousel(length: number, initialIndex = 0) {
   const [index, setIndex] = useState(initialIndex);

   const goTo = useCallback((next: number) => setIndex(((next % length) + length) % length), [length]);
   const next = useCallback(() => setIndex((current) => (current + 1) % length), [length]);
   const prev = useCallback(() => setIndex((current) => (current - 1 + length) % length), [length]);

   return { index, goTo, next, prev };
}
