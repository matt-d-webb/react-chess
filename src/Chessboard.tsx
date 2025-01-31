import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import { Chessground } from "chessground";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import { Chess } from "chess.js";
import type { ChessboardProps, ChessboardRef } from "./types";

export const Chessboard = forwardRef<ChessboardRef, ChessboardProps>(
  (
    {
      width = "100%",
      height = "100%",
      fen = "start",
      orientation = "white",
      onMove,
      onDrop,
      gameInstance,
      ...config
    },
    ref
  ) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<Api>();
    const gameRef = useRef<Chess>(
      gameInstance || new Chess(fen === "start" ? undefined : fen)
    );

    useImperativeHandle(ref, () => ({
      get api() {
        return apiRef.current;
      },
      get game() {
        return gameRef.current;
      },
    }));

    useEffect(() => {
      if (!boardRef.current) return;

      const chess = gameRef.current;

      const cg = Chessground(boardRef.current, {
        orientation,
        fen: chess.fen(),
        movable: {
          free: false,
          color: "both",
          dests: getDests(chess),
        },
        events: {
          move: (orig, dest) => {
            const move = chess.move({
              from: orig,
              to: dest,
              promotion: "q", // always promote to queen for simplicity
            });

            if (move) {
              onMove?.(orig, dest);
              cg.set({ fen: chess.fen() });
            }
          },
          dropNewPiece: (piece, key) => {
            onDrop?.(key as Key, key as Key);
          },
        },
        ...config,
      });

      apiRef.current = cg;

      return () => {
        cg.destroy();
      };
    }, []);

    // Update FEN if changed externally
    useEffect(() => {
      if (apiRef.current && fen !== "start") {
        apiRef.current.set({ fen });
        gameRef.current.load(fen);
      }
    }, [fen]);

    return (
      <div
        ref={boardRef}
        style={{
          width,
          height,
          position: "relative",
        }}
      />
    );
  }
);

// Helper function to get possible moves
function getDests(chess: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  chess.moves({ verbose: true }).forEach((move) => {
    const from = move.from as Key;
    const to = move.to as Key;
    if (!dests.has(from)) dests.set(from, []);
    dests.get(from)?.push(to);
  });
  return dests;
}

Chessboard.displayName = "Chessboard";
