import { useEffect, type RefObject } from "react";

interface KeyboardNavOptions {
  onNext: () => void;
  onPrevious: () => void;
  onFirst: () => void;
  onLast: () => void;
  enabled: boolean;
}

export function useKeyboardNavigation(
  containerRef: RefObject<HTMLElement | null>,
  { onNext, onPrevious, onFirst, onLast, enabled }: KeyboardNavOptions
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrevious();
          break;
        case "Home":
          e.preventDefault();
          onFirst();
          break;
        case "End":
          e.preventDefault();
          onLast();
          break;
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("keydown", handler);
      return () => el.removeEventListener("keydown", handler);
    }
  }, [containerRef, enabled, onNext, onPrevious, onFirst, onLast]);
}
