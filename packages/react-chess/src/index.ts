// CSS imports - bundled by rollup-plugin-postcss
import "./styles/board.css";

// Convenience wrapper (backward compatible)
export { Chessboard } from "./Chessboard";

// Compound components
export { ChessProvider, useChess } from "./context/ChessProvider";
export { Board } from "./components/Board";
export { MoveHistory } from "./components/MoveHistory";
export { Navigation } from "./components/Navigation";
export { BoardControls } from "./components/BoardControls";

// Hooks
export { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

// Theme utilities
export { resolveTheme, themeToCSSSVars, generateBoardSVG, themePresets } from "./themes/presets";

// Types
export type {
  ChessboardProps,
  ChessboardRef,
  ChessProviderProps,
  BoardProps,
  MoveHistoryProps,
  NavigationProps,
  BoardControlsProps,
  PromotionDialogProps,
  ChessboardCallbacks,
  ChessboardTheme,
  ChessboardThemePreset,
  CustomTheme,
  ChessboardLayout,
  PieceColor,
  PromotionPiece,
  GameOverResult,
  PGNMetadata,
  PGNHeaders,
  ChessContextValue,
} from "./types";
