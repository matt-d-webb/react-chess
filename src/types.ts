import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key } from "chessground/types";
import { Chess } from "chess.js";

export interface ChessboardProps extends Partial<Config> {
  width?: string | number;
  height?: string | number;
  fen?: string;
  orientation?: "white" | "black";
  onMove?: (from: Key, to: Key) => void;
  onDrop?: (key: Key, to: Key) => void;
  gameInstance?: Chess;
}

export interface ChessboardRef {
  api: Api | undefined;
  game: Chess | undefined;
}
