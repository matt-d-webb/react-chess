"use client";

import { useState, useRef, useCallback } from "react";
import { Chessboard } from "@mdwebb/react-chess";
import type { ChessboardRef, GameOverResult, PieceColor } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";

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
  illegal: { color: "var(--muted)", label: "ILLEGAL" },
  flip: { color: "var(--accent)", label: "FLIP" },
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
    <div style={{ padding: "2.5rem 1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Game Callbacks</h1>
        <p>
          React to game events with fully typed callbacks. Play moves on the board and
          watch events fire in real-time in the log panel.
        </p>
      </div>

      {/* Callback toggles */}
      <div
        className="card"
        style={{
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Active callbacks:
        </span>
        {Object.entries(enabledCallbacks).map(([key, enabled]) => (
          <label
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.8125rem",
              cursor: "pointer",
              color: enabled ? typeConfig[key as LogEntry["type"]]?.color ?? "var(--fg)" : "var(--muted)",
            }}
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

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {/* Board */}
        <div >
          <Chessboard
            ref={boardRef}
            width={450}
            height={450}
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
        <div
          
          style={{
            flex: 1,
            minWidth: "300px",
            maxHeight: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="card"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                Event Log
                {logs.length > 0 && (
                  <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: "0.5rem" }}>
                    ({logs.length})
                  </span>
                )}
              </span>
              <button
                className="btn btn--outline btn--sm"
                onClick={() => setLogs([])}
                style={{ padding: "0.25rem 0.5rem", fontSize: "0.6875rem" }}
              >
                Clear
              </button>
            </div>
            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "0.5rem",
              }}
            >
              {logs.length === 0 && (
                <div style={{
                  color: "var(--muted)",
                  padding: "2rem 0",
                  textAlign: "center",
                  fontSize: "0.8125rem",
                }}>
                  Play some moves to see events appear here...
                </div>
              )}
              {logs.map((log) => {
                const config = typeConfig[log.type];
                return (
                  <div
                    key={log.id}
                    
                    style={{
                      padding: "0.375rem 0.5rem",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "baseline",
                      fontFamily: "ui-monospace, monospace",
                      fontSize: "0.75rem",
                    }}
                  >
                    <span style={{ color: "var(--muted)", fontSize: "0.625rem", flexShrink: 0 }}>
                      {log.timestamp}
                    </span>
                    <span
                      style={{
                        color: config.color,
                        fontWeight: 700,
                        fontSize: "0.625rem",
                        flexShrink: 0,
                        minWidth: "5rem",
                      }}
                    >
                      {config.label}
                    </span>
                    <span style={{ color: "var(--fg-secondary)" }}>{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Code reference */}
      <div style={{ marginTop: "2rem" }}>
        <CodeBlock code={callbacksCode} title="All Callbacks" showLineNumbers />
      </div>
    </div>
  );
}
