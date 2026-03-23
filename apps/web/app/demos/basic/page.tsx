"use client";

import { useState } from "react";
import { Chessboard } from "@mdwebb/react-chess";
import type { PieceColor, ChessboardThemePreset, ChessboardLayout } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { FadeIn } from "@/components/Motion";

export default function BasicDemo() {
  const [orientation, setOrientation] = useState<PieceColor>("white");
  const [theme, setTheme] = useState<ChessboardThemePreset>("brown");
  const [fen, setFen] = useState("");
  const [moveCount, setMoveCount] = useState(0);
  const [showCoords, setShowCoords] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [boardSize, setBoardSize] = useState(450);
  const [layout, setLayout] = useState<ChessboardLayout>("board-only");
  const [lastMove, setLastMove] = useState("");

  return (
    <div style={{ padding: "2.5rem 1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
      <FadeIn className="page-header">
        <h1>Basic Board</h1>
        <p>
          Interactive chess board with drag-and-drop moves, board flip, coordinate labels,
          and pawn promotion UI. Configure every option below.
        </p>
      </FadeIn>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Board */}
        <div className="">
          <Chessboard
            width={boardSize}
            height={boardSize}
            theme={theme}
            orientation={orientation}
            showBoardControls={showControls}
            showCoordinates={showCoords}
            showMoveHistory={layout === "horizontal"}
            showNavigation={layout !== "board-only"}
            layout={layout}
            autoPromoteToQueen={false}
            onMove={(from, to, move) => {
              setFen(move.after);
              setMoveCount((c) => c + 1);
              setLastMove(move.san);
            }}
            onCheck={(color) => {
              console.log(`${color} is in check!`);
            }}
            onGameOver={(result) => {
              alert(
                result.winner
                  ? `Game over! ${result.winner} wins by ${result.reason}`
                  : `Game over! ${result.reason}`
              );
            }}
          />
        </div>

        {/* Controls panel */}
        <div
          className=""
          style={{ flex: 1, minWidth: "280px" }}
        >
          {/* Stats */}
          <div
            className="card"
            style={{
              padding: "1rem 1.25rem",
              marginBottom: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{moveCount}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Moves</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{lastMove || "—"}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{orientation === "white" ? "♔" : "♚"}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Side</div>
            </div>
          </div>

          {/* Configuration */}
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-secondary)" }}>
              Configuration
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label className="label">Theme</label>
                <select
                  className="select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ChessboardThemePreset)}
                  style={{ width: "100%" }}
                >
                  <option value="brown">Brown</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="gray">Gray</option>
                </select>
              </div>

              <div>
                <label className="label">Board Size</label>
                <select
                  className="select"
                  value={boardSize}
                  onChange={(e) => setBoardSize(Number(e.target.value))}
                  style={{ width: "100%" }}
                >
                  <option value={350}>350px</option>
                  <option value={400}>400px</option>
                  <option value={450}>450px</option>
                  <option value={500}>500px</option>
                </select>
              </div>

              <div>
                <label className="label">Layout</label>
                <select
                  className="select"
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as ChessboardLayout)}
                  style={{ width: "100%" }}
                >
                  <option value="board-only">Board Only</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>

              <div>
                <label className="label">Orientation</label>
                <button
                  className="btn btn--outline btn--sm"
                  onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}
                  style={{ width: "100%" }}
                >
                  🔄 {orientation}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--fg-secondary)", cursor: "pointer" }}>
                <input type="checkbox" checked={showCoords} onChange={(e) => setShowCoords(e.target.checked)} />
                Coordinates
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--fg-secondary)", cursor: "pointer" }}>
                <input type="checkbox" checked={showControls} onChange={(e) => setShowControls(e.target.checked)} />
                Controls
              </label>
            </div>
          </div>

          {/* FEN */}
          {fen && (
            <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <label className="label">Current FEN</label>
              <code
                style={{
                  display: "block",
                  padding: "0.625rem 0.75rem",
                  background: "var(--bg-tertiary)",
                  borderRadius: "0.375rem",
                  fontSize: "0.6875rem",
                  wordBreak: "break-all",
                  color: "var(--fg-secondary)",
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                {fen}
              </code>
            </div>
          )}

          {/* Code */}
          <CodeBlock
            title="Usage"
            code={`<Chessboard
  width={${boardSize}}
  height={${boardSize}}
  theme="${theme}"
  orientation="${orientation}"
  showBoardControls={${showControls}}
  showCoordinates={${showCoords}}
  layout="${layout}"
  onMove={(from, to, move) => {
    console.log(move.san);
  }}
  onGameOver={(result) => {
    alert(result.reason);
  }}
/>`}
          />
        </div>
      </div>
    </div>
  );
}
