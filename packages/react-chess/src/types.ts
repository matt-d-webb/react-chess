import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key } from "chessground/types";
import type { Chess, Move } from "chess.js";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

// ─── Theme Types ─────────────────────────────────────────────────────────────

export type ChessboardThemePreset = "brown" | "blue" | "green" | "gray";

export interface CustomTheme {
  lightSquare: string;
  darkSquare: string;
  selectedSquare?: string;
  lastMoveHighlight?: string;
  moveDestination?: string;
  checkHighlight?: string;
}

export type ChessboardTheme = ChessboardThemePreset | CustomTheme;

// ─── Game State Types ────────────────────────────────────────────────────────

export type PieceColor = "white" | "black";
export type PromotionPiece = "q" | "r" | "b" | "n";

export interface GameOverResult {
  winner?: PieceColor;
  reason:
    | "checkmate"
    | "stalemate"
    | "insufficient_material"
    | "threefold_repetition"
    | "fifty_move_rule"
    | "draw";
}

export interface PGNMetadata {
  annotations: Record<number, string>;
  comments: Record<number, string>;
  variations: Record<number, string[]>;
  clockTimes: Record<number, string>;
  evaluations: Record<number, string>;
  ravs: Record<number, { moves: string; comment?: string }[]>;
  headers: PGNHeaders;
}

export interface PGNHeaders {
  White?: string;
  Black?: string;
  Date?: string;
  Event?: string;
  Site?: string;
  Result?: string;
  Round?: string;
  WhiteElo?: string;
  BlackElo?: string;
  ECO?: string;
  [key: string]: string | undefined;
}

// ─── Callback Types ──────────────────────────────────────────────────────────

export interface ChessboardCallbacks {
  onMove?: (from: Key, to: Key, move: Move) => void;
  onPositionChange?: (fen: string, moves: Move[]) => void;
  onCheck?: (color: PieceColor) => void;
  onGameOver?: (result: GameOverResult) => void;
  onIllegalMove?: (from: string, to: string) => void;
  onFlip?: (orientation: PieceColor) => void;
  onPromotion?: (from: Key, to: Key, piece: PromotionPiece) => void;
}

// ─── Layout Types ────────────────────────────────────────────────────────────

export type ChessboardLayout = "horizontal" | "vertical" | "board-only";

// ─── Component Props ─────────────────────────────────────────────────────────

type HTMLDivPropsWithoutDraggable = Omit<
  HTMLAttributes<HTMLDivElement>,
  "draggable"
>;

export interface BoardProps extends HTMLDivPropsWithoutDraggable {
  width?: string | number;
  height?: string | number;
  theme?: ChessboardTheme;
  showCoordinates?: boolean;
  draggable?: Config["draggable"];
  movable?: Config["movable"];
  premovable?: Config["premovable"];
  predroppable?: Config["predroppable"];
  drawable?: Config["drawable"];
  highlight?: Config["highlight"];
  animation?: Config["animation"];
}

export interface MoveHistoryProps extends HTMLAttributes<HTMLDivElement> {
  moves?: Move[];
  onMoveClick?: (moveIndex: number) => void;
  currentMoveIndex?: number;
  annotations?: Record<number, string>;
  comments?: Record<number, string>;
  variations?: Record<number, string[]>;
  clockTimes?: Record<number, string>;
  evaluations?: Record<number, string>;
  ravs?: Record<number, { moves: string; comment?: string }[]>;
  headers?: PGNHeaders;
  width?: string | number;
}

export interface NavigationProps extends HTMLAttributes<HTMLDivElement> {
  onFirst?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onLast?: () => void;
  canGoForward?: boolean;
  canGoBackward?: boolean;
}

export interface BoardControlsProps extends HTMLAttributes<HTMLDivElement> {
  onFlip?: () => void;
  showFlipButton?: boolean;
}

export interface PromotionDialogProps {
  isOpen: boolean;
  color: PieceColor;
  onSelect: (piece: PromotionPiece) => void;
  onCancel: () => void;
  position?: { x: number; y: number };
}

// ─── Provider Props ──────────────────────────────────────────────────────────

export interface ChessProviderProps extends ChessboardCallbacks {
  children: ReactNode;
  fen?: string;
  pgn?: string;
  orientation?: PieceColor;
  theme?: ChessboardTheme;
  autoPromoteToQueen?: boolean;
  enableKeyboardNavigation?: boolean;
}

// ─── Convenience Wrapper Props ───────────────────────────────────────────────

export interface ChessboardProps
  extends Omit<ChessProviderProps, "children">,
    Omit<HTMLDivPropsWithoutDraggable, "children"> {
  width?: string | number;
  height?: string | number;
  showMoveHistory?: boolean;
  showNavigation?: boolean;
  showBoardControls?: boolean;
  showCoordinates?: boolean;
  layout?: ChessboardLayout;
  moveHistoryWidth?: string | number;
  boardClassName?: string;
  boardStyle?: CSSProperties;
  moveHistoryClassName?: string;
  moveHistoryStyle?: CSSProperties;
  navigationClassName?: string;
  navigationStyle?: CSSProperties;
  children?: ReactNode;
  draggable?: Config["draggable"];
  movable?: Config["movable"];
  animation?: Config["animation"];
}

// ─── Ref Types ───────────────────────────────────────────────────────────────

export interface ChessboardRef {
  api: Api | null;
  game: Chess | null;
  flip: () => void;
  navigateToMove: (index: number) => void;
  goFirst: () => void;
  goPrevious: () => void;
  goNext: () => void;
  goLast: () => void;
}

// ─── Context Types ───────────────────────────────────────────────────────────

export interface ChessContextValue {
  game: Chess;
  api: Api | null;
  fen: string;
  orientation: PieceColor;
  moveHistory: Move[];
  currentMoveIndex: number;
  pgnMetadata: PGNMetadata;
  isCheck: boolean;
  isGameOver: boolean;
  pendingPromotion: { from: Key; to: Key } | null;

  setApi: (api: Api) => void;
  navigateToMove: (index: number) => void;
  goFirst: () => void;
  goPrevious: () => void;
  goNext: () => void;
  goLast: () => void;
  flipBoard: () => void;
  makeMove: (from: string, to: string, promotion?: PromotionPiece) => boolean;
  resolvePromotion: (piece: PromotionPiece) => void;
  cancelPromotion: () => void;

  theme: ChessboardTheme;
  autoPromoteToQueen: boolean;
  enableKeyboardNavigation: boolean;
}
