"use client";

import { useState } from "react";
import { Chessboard } from "@mdwebb/react-chess";
import type { PieceColor, ChessboardThemePreset, ChessboardLayout } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { FadeIn } from "@/components/Motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";

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
  const maxSize = useMaxBoardSize();
  const effectiveSize = Math.min(boardSize, maxSize);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <FadeIn>
        <div className="mb-7">
          <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Basic Board</h1>
          <p className="max-w-xl text-(--fg-secondary)">
            Interactive chess board with drag-and-drop moves, board flip, coordinate labels,
            and pawn promotion UI. Configure every option below.
          </p>
        </div>
      </FadeIn>

      <div className="flex flex-wrap gap-6">
        {/* Board */}
        <div>
          <Chessboard
            width={effectiveSize}
            height={effectiveSize}
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
        <div className="min-w-70 flex-1">
          {/* Stats */}
          <Card className="mb-4" size="sm">
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-extrabold text-(--accent-site)">{moveCount}</div>
                  <div className="text-[0.6875rem] uppercase tracking-wider text-(--muted-text)">Moves</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-(--accent-site)">{lastMove || "—"}</div>
                  <div className="text-[0.6875rem] uppercase tracking-wider text-(--muted-text)">Last</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-(--accent-site)">{orientation === "white" ? "♔" : "♚"}</div>
                  <div className="text-[0.6875rem] uppercase tracking-wider text-(--muted-text)">Side</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="mb-4" size="sm">
            <CardContent>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
                Configuration
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Theme</label>
                  <select
                    className="w-full rounded-lg border border-border bg-(--bg-secondary) px-3 py-2 text-sm text-(--fg)"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as ChessboardThemePreset)}
                  >
                    <option value="brown">Brown</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Board Size</label>
                  <select
                    className="w-full rounded-lg border border-border bg-(--bg-secondary) px-3 py-2 text-sm text-(--fg)"
                    value={boardSize}
                    onChange={(e) => setBoardSize(Number(e.target.value))}
                  >
                    <option value={350}>350px</option>
                    <option value={400}>400px</option>
                    <option value={450}>450px</option>
                    <option value={500}>500px</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Layout</label>
                  <select
                    className="w-full rounded-lg border border-border bg-(--bg-secondary) px-3 py-2 text-sm text-(--fg)"
                    value={layout}
                    onChange={(e) => setLayout(e.target.value as ChessboardLayout)}
                  >
                    <option value="board-only">Board Only</option>
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Orientation</label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}
                  >
                    🔄 {orientation}
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-[0.8125rem] text-(--fg-secondary)">
                  <input type="checkbox" checked={showCoords} onChange={(e) => setShowCoords(e.target.checked)} />
                  Coordinates
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[0.8125rem] text-(--fg-secondary)">
                  <input type="checkbox" checked={showControls} onChange={(e) => setShowControls(e.target.checked)} />
                  Controls
                </label>
              </div>
            </CardContent>
          </Card>

          {/* FEN */}
          {fen && (
            <Card className="mb-4" size="sm">
              <CardContent>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Current FEN</label>
                <code className="block break-all rounded-md bg-(--bg-tertiary) px-3 py-2.5 font-mono text-[0.6875rem] text-(--fg-secondary)">
                  {fen}
                </code>
              </CardContent>
            </Card>
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
