"use client";

import { useState, useEffect } from "react";

/**
 * Returns the maximum board size that fits within the viewport,
 * accounting for horizontal padding. Starts conservatively small
 * so SSR/first-paint doesn't overflow on mobile.
 */
export function useMaxBoardSize(padding = 48): number {
  const [maxSize, setMaxSize] = useState(320);

  useEffect(() => {
    function update() {
      setMaxSize(window.innerWidth - padding);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [padding]);

  return maxSize;
}
