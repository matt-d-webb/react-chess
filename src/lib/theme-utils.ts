import { ChessboardTheme } from "../types";

export const getThemeClasses = (theme: ChessboardTheme = "brown") => {
  const themes = {
    brown: {
      light: "bg-amber-200",
      dark: "bg-amber-800",
      selected: "bg-yellow-300/50",
      moved: "bg-yellow-200/50",
    },
    blue: {
      light: "bg-blue-200",
      dark: "bg-blue-600",
      selected: "bg-blue-300/50",
      moved: "bg-blue-200/50",
    },
    green: {
      light: "bg-emerald-200",
      dark: "bg-emerald-700",
      selected: "bg-emerald-300/50",
      moved: "bg-emerald-200/50",
    },
    gray: {
      light: "bg-gray-200",
      dark: "bg-gray-600",
      selected: "bg-gray-300/50",
      moved: "bg-gray-200/50",
    },
  };

  return themes[theme];
};
