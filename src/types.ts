import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key } from "chessground/types";
import { Chess, Move } from "chess.js";

export interface ChessboardProps extends Partial<Config> {
  width?: string | number;
  height?: string | number;
  fen?: string;
  orientation?: "white" | "black";
  onMove?: (from: Key, to: Key) => void;
  pgn?: string;
  showMoveHistory?: boolean;
  showNavigation?: boolean;
  onPositionChange?: (fen: string, moves: Move[]) => void;
}

export interface ChessboardRef {
  api: Api | undefined;
  game: Chess | undefined;
}
