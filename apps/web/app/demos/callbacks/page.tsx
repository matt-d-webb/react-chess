"use client";

import { useState, useRef, useCallback } from "react";
import { Chessboard } from "@mdwebb/react-chess";
import type { ChessboardRef, GameOverResult, PieceColor } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";

interface LogEntry {
  id: number;
  type: "move" | "check" | "gameover" | "promotion" | "illegal" | "flip" | "position";
  message: string;
  timestamp: string;
}

const typeConfig: Record<LogEntry["type"], { color: string; label: string }> = {
  move: { color: "var(--info)", label: "MOVE" },
  check: { color: "var(--warning)", label: "CHECK" },
  gameover: { color: "var(--danger)", label: "GAME OVER" },
  promotion: { color: "var(--purple)", label: "PROMOTE" },
  illegal: { color: "var(--muted-text)", label: "ILLEGAL" },
  flip: { color: "var(--accent-site)", label: "FLIP" },
  position: { color: "var(--success)", label: "POSITION" },
};

const callbacksCode = `<Chessboard
  onMove={(from, to, move) => {
    console.log(move.san); // "e4", "Nf3", etc.
  }}
  onCheck={(color) => {
    // color: "white" | "black"
  }}
  onGameOver={(result) => {
    // result.reason: "checkmate" | "stalemate" | "draw" | ...
    // result.winner?: "white" | "black"
  }}
  onPromotion={(from, to, piece) => {
    // piece: "q" | "r" | "b" | "n"
  }}
  onIllegalMove={(from, to) => {
    // Attempted illegal move
  }}
  onFlip={(orientation) => {
    // orientation: "white" | "black"
  }}
  onPositionChange={(fen, moves) => {
    // Called after every position update
  }}
/>`;

export default function CallbacksDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [enabledCallbacks, setEnabledCallbacks] = useState({
    move: true,
    check: true,
    gameover: true,
    promotion: true,
    flip: true,
    position: false,
  });
  const boardRef = useRef<ChessboardRef>(null);
  const idRef = useRef(0);
  const maxSize = useMaxBoardSize();
  const effectiveSize = Math.min(450, maxSize);

  const addLog = useCallback(
    (type: LogEntry["type"], message: string) => {
      setLogs((prev) => [
        {
          id: ++idRef.current,
          type,
          message,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 99),
      ]);
    },
    []
  );

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-7">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Game Callbacks</h1>
        <p className="max-w-xl text-(--fg-secondary)">
          React to game events with fully typed callbacks. Play moves on the board and
          watch events fire in real-time in the log panel.
        </p>
      </div>

      {/* Callback toggles */}
      <Card className="mb-6" size="sm">
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">
              Active callbacks:
            </span>
            {Object.entries(enabledCallbacks).map(([key, enabled]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-1.5 text-[0.8125rem]"
                style={{ color: enabled ? typeConfig[key as LogEntry["type"]]?.color ?? "var(--fg)" : "var(--muted-text)" }}
              >
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) =>
                    setEnabledCallbacks((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                />
                {key}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-6">
        {/* Board */}
        <div>
          <Chessboard
            ref={boardRef}
            width={effectiveSize}
            height={effectiveSize}
            theme="green"
            showBoardControls={true}
            onMove={
              enabledCallbacks.move
                ? (from, to, move) => addLog("move", `${move.san} (${from} → ${to})`)
                : undefined
            }
            onCheck={
              enabledCallbacks.check
                ? (color: PieceColor) => addLog("check", `${color} is in check!`)
                : undefined
            }
            onGameOver={
              enabledCallbacks.gameover
                ? (result: GameOverResult) => {
                    const msg = result.winner
                      ? `${result.winner} wins by ${result.reason}`
                      : `Draw: ${result.reason}`;
                    addLog("gameover", msg);
                  }
                : undefined
            }
            onPromotion={
              enabledCallbacks.promotion
                ? (from, to, piece) => {
                    const names: Record<string, string> = { q: "queen", r: "rook", b: "bishop", n: "knight" };
                    addLog("promotion", `Promoted to ${names[piece]} (${from} → ${to})`);
                  }
                : undefined
            }
            onFlip={
              enabledCallbacks.flip
                ? (orientation) => addLog("flip", `Board flipped to ${orientation}`)
                : undefined
            }
            onPositionChange={
              enabledCallbacks.position
                ? (fen) => addLog("position", fen.split(" ")[0])
                : undefined
            }
          />
        </div>

        {/* Event log */}
        <div className="flex max-h-125 min-w-0 flex-1 flex-col sm:min-w-70">
          <Card className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-bold">
                Event Log
                {logs.length > 0 && (
                  <span className="ml-2 font-normal text-(--muted-text)">
                    ({logs.length})
                  </span>
                )}
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setLogs([])}
              >
                Clear
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {logs.length === 0 && (
                <div className="py-8 text-center text-[0.8125rem] text-(--muted-text)">
                  Play some moves to see events appear here...
                </div>
              )}
              {logs.map((log) => {
                const config = typeConfig[log.type];
                return (
                  <div
                    key={log.id}
                    className="flex items-baseline gap-2 border-b border-border px-2 py-1.5 font-mono text-xs"
                  >
                    <span className="shrink-0 text-[0.625rem]" style={{ color: "var(--muted-text)" }}>
                      {log.timestamp}
                    </span>
                    <span
                      className="min-w-20 shrink-0 text-[0.625rem] font-bold"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>
                    <span className="text-(--fg-secondary)">{log.message}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Code reference */}
      <div className="mt-8">
        <CodeBlock code={callbacksCode} title="All Callbacks" showLineNumbers />
      </div>
    </div>
  );
}
