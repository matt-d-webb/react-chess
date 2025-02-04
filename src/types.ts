import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key } from "chessground/types";
import { Chess, Move } from "chess.js";

// Pick all properties from HTMLAttributes except 'draggable'
type HTMLDivPropsWithoutDraggable = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "draggable"
>;

export interface ChessboardProps
  extends Partial<Config>,
    HTMLDivPropsWithoutDraggable {
  width?: string | number;
  height?: string | number;
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
