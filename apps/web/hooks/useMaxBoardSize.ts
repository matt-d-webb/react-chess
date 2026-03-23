"use client";

import { useState, useEffect } from "react";

/**
 * Returns the maximum board size that fits within the viewport,
 * accounting for horizontal padding.
 */
export function useMaxBoardSize(padding = 48): number {
  const [maxSize, setMaxSize] = useState(600);

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
