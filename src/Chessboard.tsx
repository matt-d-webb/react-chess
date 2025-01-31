import React, { useEffect, useRef, useState, forwardRef } from "react";
import { Chessground } from "chessground";
import { Chess, Move } from "chess.js";

import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import type { ChessboardProps, ChessboardRef } from "./types";

import { MoveHistory } from "./components/MoveHistory";
import { Navigation } from "./components/Navigation";

export const Chessboard = forwardRef<ChessboardRef, ChessboardProps>(
  (
    {
      width = "400px",
      height = "400px",
      fen = "start",
      orientation = "white",
      onMove,
      pgn,
      showMoveHistory = false,
      showNavigation = false,
      onPositionChange,
    },
    ref
  ) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<Api>();
    const gameRef = useRef<Chess>(new Chess(fen === "start" ? undefined : fen));
    const [moveHistory, setMoveHistory] = useState<Move[]>([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);

    useEffect(() => {
      if (pgn && gameRef.current) {
        try {
          gameRef.current.loadPgn(pgn);
          const moves = gameRef.current.history({ verbose: true });
          setMoveHistory(moves);
          setCurrentMoveIndex(moves.length - 1);
          apiRef.current?.set({ fen: gameRef.current.fen() });
        } catch (e) {
          console.error("Invalid PGN:", e);
        }
      }
    }, [pgn]);

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
              promotion: "q", // TODO: Allow promotion selection
            });

            if (move) {
              onMove?.(orig as Key, dest as Key);

              const moves = chess.history({ verbose: true });
              setMoveHistory(moves);
              setCurrentMoveIndex(moves.length - 1);
              onPositionChange?.(chess.fen(), moves);

              cg.set({
                fen: chess.fen(),
                movable: {
                  dests: getDests(chess),
                },
              });
            }
          },
        },
      });

      apiRef.current = cg;

      return () => {
        cg.destroy();
      };
    }, []);

    useEffect(() => {
      if (apiRef.current && fen !== "start") {
        apiRef.current.set({ fen });
        gameRef.current.load(fen);
      }
    }, [fen]);

    const navigateToMove = (index: number) => {
      if (!gameRef.current || !apiRef.current) return;

      const chess = gameRef.current;
      chess.reset();

      const moves = moveHistory.slice(0, index + 1);
      moves.forEach((move) => {
        chess.move(move);
      });

      apiRef.current.set({
        fen: chess.fen(),
        movable: {
          dests: getDests(chess),
        },
      });
      setCurrentMoveIndex(index);
      onPositionChange?.(chess.fen(), moves);
    };

    const handleFirst = () => navigateToMove(-1);
    const handlePrevious = () => navigateToMove(currentMoveIndex - 1);
    const handleNext = () => navigateToMove(currentMoveIndex + 1);
    const handleLast = () => navigateToMove(moveHistory.length - 1);

    return (
      <div>
        <div
          ref={boardRef}
          style={{
            width,
            height,
          }}
        />
        {showMoveHistory && (
          <MoveHistory
            moves={moveHistory}
            onMoveClick={navigateToMove}
            currentMoveIndex={currentMoveIndex}
          />
        )}
        {showNavigation && (
          <Navigation
            onFirst={handleFirst}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onLast={handleLast}
            canGoBackward={currentMoveIndex > -1}
            canGoForward={currentMoveIndex < moveHistory.length - 1}
          />
        )}
      </div>
    );
  }
);

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
