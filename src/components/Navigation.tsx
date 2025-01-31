// src/components/Navigation.tsx
import React from "react";

interface NavigationProps {
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  canGoForward: boolean;
  canGoBackward: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  onFirst,
  onPrevious,
  onNext,
  onLast,
  canGoForward,
  canGoBackward,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginTop: "1rem",
        justifyContent: "center",
      }}
    >
      <button
        onClick={onFirst}
        disabled={!canGoBackward}
        style={{
          padding: "4px 8px",
          cursor: canGoBackward ? "pointer" : "default",
          opacity: canGoBackward ? 1 : 0.5,
        }}
      >
        ⏮️
      </button>
      <button
        onClick={onPrevious}
        disabled={!canGoBackward}
        style={{
          padding: "4px 8px",
          cursor: canGoBackward ? "pointer" : "default",
          opacity: canGoBackward ? 1 : 0.5,
        }}
      >
        ⏪
      </button>
      <button
        onClick={onNext}
        disabled={!canGoForward}
        style={{
          padding: "4px 8px",
          cursor: canGoForward ? "pointer" : "default",
          opacity: canGoForward ? 1 : 0.5,
        }}
      >
        ⏩
      </button>
      <button
        onClick={onLast}
        disabled={!canGoForward}
        style={{
          padding: "4px 8px",
          cursor: canGoForward ? "pointer" : "default",
          opacity: canGoForward ? 1 : 0.5,
        }}
      >
        ⏭️
      </button>
    </div>
  );
};
