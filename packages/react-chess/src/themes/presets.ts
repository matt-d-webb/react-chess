import type { CustomTheme, ChessboardThemePreset } from "../types";

export const themePresets: Record<ChessboardThemePreset, CustomTheme> = {
  brown: {
    lightSquare: "#f0d9b5",
    darkSquare: "#b58863",
    selectedSquare: "rgba(20, 85, 30, 0.5)",
    lastMoveHighlight: "rgba(155, 199, 0, 0.41)",
    moveDestination: "rgba(20, 85, 30, 0.5)",
    checkHighlight: "rgba(255, 0, 0, 0.5)",
  },
  blue: {
    lightSquare: "#dee3e6",
    darkSquare: "#8ca2ad",
    selectedSquare: "rgba(20, 85, 150, 0.5)",
    lastMoveHighlight: "rgba(0, 155, 199, 0.41)",
    moveDestination: "rgba(20, 85, 150, 0.5)",
    checkHighlight: "rgba(255, 0, 0, 0.5)",
  },
  green: {
    lightSquare: "#ffffdd",
    darkSquare: "#86a666",
    selectedSquare: "rgba(20, 150, 30, 0.5)",
    lastMoveHighlight: "rgba(155, 199, 0, 0.41)",
    moveDestination: "rgba(20, 150, 30, 0.5)",
    checkHighlight: "rgba(255, 0, 0, 0.5)",
  },
  gray: {
    lightSquare: "#e8e8e8",
    darkSquare: "#a0a0a0",
    selectedSquare: "rgba(85, 85, 85, 0.5)",
    lastMoveHighlight: "rgba(128, 128, 128, 0.41)",
    moveDestination: "rgba(85, 85, 85, 0.5)",
    checkHighlight: "rgba(255, 0, 0, 0.5)",
  },
};

export function resolveTheme(
  theme: string | CustomTheme
): CustomTheme {
  if (typeof theme === "string") {
    return themePresets[theme as ChessboardThemePreset] ?? themePresets.brown;
  }
  return {
    ...themePresets.brown,
    ...theme,
  };
}

export function themeToCSSSVars(theme: CustomTheme): Record<string, string> {
  return {
    "--rc-selected": theme.selectedSquare ?? "rgba(20, 85, 30, 0.5)",
    "--rc-last-move": theme.lastMoveHighlight ?? "rgba(155, 199, 0, 0.41)",
    "--rc-move-dest": theme.moveDestination ?? "rgba(20, 85, 30, 0.5)",
    "--rc-check": theme.checkHighlight ?? "rgba(255, 0, 0, 0.5)",
  };
}

/**
 * Generate an SVG checkerboard background for the board.
 * This is the same pattern chessground uses, but with custom colors.
 */
export function generateBoardSVG(light: string, dark: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink" viewBox="0 0 8 8" shape-rendering="crispEdges"><g id="a"><g id="b"><g id="c"><g id="d"><rect width="1" height="1" id="e" fill="${light}"/><use x="1" y="1" href="#e" x:href="#e"/><rect y="1" width="1" height="1" id="f" fill="${dark}"/><use x="1" y="-1" href="#f" x:href="#f"/></g><use x="2" href="#d" x:href="#d"/></g><use x="4" href="#c" x:href="#c"/></g><use y="2" href="#b" x:href="#b"/></g><use y="4" href="#a" x:href="#a"/></svg>`;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
}
