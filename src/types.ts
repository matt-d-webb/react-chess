import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key } from "chessground/types";
import { Chess, Move } from "chess.js";

type HTMLDivPropsWithoutDraggable = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "draggable"
>;

export type ChessboardTheme = "brown" | "blue" | "green" | "gray";

export interface ChessboardProps
  extends Partial<Config>,
    HTMLDivPropsWithoutDraggable {
  width?: string | number;
  height?: string | number;
  theme?: ChessboardTheme;
  fen?: string;
  orientation?: "white" | "black";
  onMove?: (from: Key, to: Key) => void;
  pgn?: string;
  showMoveHistory?: boolean;
  showNavigation?: boolean;
  onPositionChange?: (fen: string, moves: Move[]) => void;
  // We prioritize Chessground's draggable type over HTML's
  draggable?: Config["draggable"];
}

export interface ChessboardRef {
  api: Api | null;
  game: Chess | null;
}

export interface PGNMetadata {
  annotations: Record<number, string>;
  comments: Record<number, string>;
  variations: Record<number, string[]>;
  clockTimes: Record<number, string>;
  evaluations: Record<number, string>;
  ravs: Record<number, { moves: string; comment?: string }[]>;
  headers: {
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
  };
}
