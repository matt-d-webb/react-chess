import React, { useEffect, useRef } from "react";
import { Chessground } from "chessground";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import { useChessOptional } from "../context/ChessProvider";
import { resolveTheme, themeToCSSSVars, generateBoardSVG } from "../themes/presets";
import { getDests, isPromotionMove, cn, toPx } from "../lib/utils";
import type { BoardProps } from "../types";

export const Board = React.forwardRef<HTMLDivElement, BoardProps>(
  (
    {
      width = "400px",
      height = "400px",
      theme: themeProp,
      showCoordinates = true,
      className,
      style,
      draggable,
      movable,
      premovable,
      predroppable,
      drawable,
      highlight,
      animation,
      ...divProps
    },
    ref
  ) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<Api>();
    const ctx = useChessOptional();

    const theme = themeProp ?? ctx?.theme ?? "brown";
    const resolvedTheme = resolveTheme(theme);
    const cssVars = themeToCSSSVars(resolvedTheme);

    useEffect(() => {
      const el = boardRef.current;
      if (!el) return;

      const chess = ctx?.game;
      if (!chess) return;

      const config: Record<string, unknown> = {
        orientation: ctx.orientation,
        fen: chess.fen(),
        coordinates: showCoordinates,
        movable: movable ?? {
          free: false,
          color: "both",
          dests: getDests(chess) as Map<Key, Key[]>,
        },
        draggable: draggable ?? { enabled: true },
        highlight: highlight ?? { lastMove: true, check: true },
        animation: animation ?? { enabled: true, duration: 200 },
        check: chess.isCheck(),
        events: {
          move: (orig: string, dest: string) => {
            if (ctx) {
              ctx.makeMove(orig, dest);
            }
          },
        },
      };

      // Only include optional chessground config if explicitly provided,
      // otherwise chessground's own defaults apply
      if (premovable !== undefined) config.premovable = premovable;
      if (predroppable !== undefined) config.predroppable = predroppable;
      if (drawable !== undefined) config.drawable = drawable;

      const cg = Chessground(el, config as Parameters<typeof Chessground>[1]);

      // Apply theme board background
      const board = el.querySelector("cg-board") as HTMLElement | null;
      if (board) {
        board.style.backgroundColor = resolvedTheme.lightSquare;
        board.style.backgroundImage = generateBoardSVG(
          resolvedTheme.lightSquare,
          resolvedTheme.darkSquare
        );
      }

      apiRef.current = cg;
      ctx?.setApi(cg);

      // Chessground calculates piece positions from container dimensions at
      // init time. If CSS hasn't fully applied yet (common on first render),
      // pieces can be misaligned. Redrawing after the browser completes
      // layout ensures correct positioning.
      const rafId = requestAnimationFrame(() => cg.redrawAll());

      return () => {
        cancelAnimationFrame(rafId);
        cg.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync board with context state
    useEffect(() => {
      const cg = apiRef.current;
      if (!cg || !ctx) return;

      cg.set({
        fen: ctx.fen,
        orientation: ctx.orientation,
        check: ctx.isCheck,
        movable: {
          dests: getDests(ctx.game) as Map<Key, Key[]>,
        },
      });
    }, [ctx?.fen, ctx?.orientation, ctx?.isCheck]);

    // Update board colors when theme changes
    useEffect(() => {
      const el = boardRef.current;
      if (!el) return;
      const board = el.querySelector("cg-board") as HTMLElement | null;
      if (board) {
        board.style.backgroundColor = resolvedTheme.lightSquare;
        board.style.backgroundImage = generateBoardSVG(
          resolvedTheme.lightSquare,
          resolvedTheme.darkSquare
        );
      }
    }, [resolvedTheme.lightSquare, resolvedTheme.darkSquare]);

    return (
      <div
        ref={ref}
        className={cn("rc-board-wrapper", className)}
        style={{
          width: toPx(width),
          height: toPx(height),
          ...style,
        }}
      >
        <div
          ref={boardRef}
          data-chessboard
          style={{
            width: "100%",
            height: "100%",
            ...cssVars as React.CSSProperties,
          }}
        />
        {ctx?.pendingPromotion && !ctx.autoPromoteToQueen && (
          <PromotionOverlay
            color={ctx.game.turn() === "w" ? "black" : "white"}
            onSelect={ctx.resolvePromotion}
            onCancel={ctx.cancelPromotion}
          />
        )}
      </div>
    );
  }
);

Board.displayName = "Board";

// Inline promotion overlay for the Board component
function PromotionOverlay({
  color,
  onSelect,
  onCancel,
}: {
  color: "white" | "black";
  onSelect: (piece: "q" | "r" | "b" | "n") => void;
  onCancel: () => void;
}) {
  const pieces =
    color === "white"
      ? { q: "\u2655", r: "\u2656", b: "\u2657", n: "\u2658" }
      : { q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E" };

  return (
    <div className="rc-promotion-overlay" onClick={onCancel}>
      <div
        className="rc-promotion-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {(Object.entries(pieces) as [("q" | "r" | "b" | "n"), string][]).map(
          ([piece, symbol]) => (
            <button
              key={piece}
              className="rc-promotion-piece"
              onClick={() => onSelect(piece)}
              aria-label={`Promote to ${piece === "q" ? "queen" : piece === "r" ? "rook" : piece === "b" ? "bishop" : "knight"}`}
            >
              {symbol}
            </button>
          )
        )}
      </div>
    </div>
  );
}
