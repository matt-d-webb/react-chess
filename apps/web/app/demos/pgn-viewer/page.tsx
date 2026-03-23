"use client";

import { useState } from "react";
import { Chessboard } from "@mdwebb/react-chess";
import type { ChessboardThemePreset } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";

const SAMPLE_PGNS: Record<string, { pgn: string; description: string }> = {
  "Fischer vs Byrne (1956)": {
    description: "\"The Game of the Century\" — 13-year-old Bobby Fischer's immortal game",
    pgn: `[Event "Third Rosenwald Trophy"]
[Site "New York, NY USA"]
[Date "1956.10.17"]
[Round "8"]
[White "Donald Byrne"]
[Black "Robert James Fischer"]
[Result "0-1"]
[ECO "D92"]
[WhiteElo "2510"]
[BlackElo "2200"]

1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7
9. Rd1 Nb6 10. Qc5 Bg4 {This is a key position in the Grunfeld Defense. Fischer plays
aggressively, typical of his style.} 11. Bg5 {A mistake. 11. Be2 was better.} Na4 $1
{Brilliant! Fischer begins a magnificent combination.} 12. Qa3 Nxc3 $3 {The beginning of a brilliant
combination.} 13. bxc3 Nxe4 $1 {The point! The knight is immune because of ...Qd4+.}
14. Bxe7 Qb6 15. Bc4 Nxc3 $1 16. Bc5 Rfe8+ 17. Kf1 Be6 $1 {The final finesse. Fischer offers his
bishop.} 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4
25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5
31. Nf3 Ne4 32. Qb8 b5 {Every move by Fischer is precise.} 33. h4 h5 34. Ne5 Kg7
35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+
41. Kc1 Rc2# 0-1`,
  },
  "Kasparov vs Topalov (1999)": {
    description: "Kasparov's Immortal — a king hunt across the entire board",
    pgn: `[Event "Hoogovens A Tournament"]
[Site "Wijk aan Zee NED"]
[Date "1999.01.20"]
[Round "4"]
[White "Garry Kasparov"]
[Black "Veselin Topalov"]
[Result "1-0"]
[ECO "B06"]
[WhiteElo "2812"]
[BlackElo "2700"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6
9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5
16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5
23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5
29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2
35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1
42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0`,
  },
  "Morphy vs Duke & Count (1858)": {
    description: "The Opera Game — Morphy's elegant miniature at the Paris Opera",
    pgn: `[Event "Paris Opera"]
[Site "Paris FRA"]
[Date "1858.??.??"]
[White "Paul Morphy"]
[Black "Duke of Brunswick and Count Isouard"]
[Result "1-0"]
[ECO "C41"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7
8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7
14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
  },
  "Anderssen vs Kieseritzky (1851)": {
    description: "The Immortal Game — sacrificing both rooks, a bishop, and the queen",
    pgn: `[Event "London"]
[Site "London ENG"]
[Date "1851.06.21"]
[White "Adolf Anderssen"]
[Black "Lionel Kieseritzky"]
[Result "1-0"]
[ECO "C33"]

1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5
8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8
15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6
21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
  },
};

export default function PGNViewerDemo() {
  const [selectedGame, setSelectedGame] = useState("Fischer vs Byrne (1956)");
  const [theme, setTheme] = useState<ChessboardThemePreset>("brown");
  const [boardSize, setBoardSize] = useState(450);
  const maxSize = useMaxBoardSize();
  const effectiveSize = Math.min(boardSize, maxSize);

  const game = SAMPLE_PGNS[selectedGame];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-7">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">PGN Viewer</h1>
        <p className="max-w-xl text-(--fg-secondary)">
          Browse famous chess games with move history, annotations, and keyboard navigation.
          Use ← → arrow keys to step through moves.
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-6" size="sm">
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-50 flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Game</label>
              <select
                className="w-full rounded-lg border border-border bg-(--bg-secondary) px-3 py-2 text-sm text-(--fg)"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
              >
                {Object.keys(SAMPLE_PGNS).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Theme</label>
              <select
                className="rounded-lg border border-border bg-(--bg-secondary) px-3 py-2 text-sm text-(--fg)"
                value={theme}
                onChange={(e) => setTheme(e.target.value as ChessboardThemePreset)}
              >
                {(["brown", "blue", "green", "gray"] as const).map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Size</label>
              <select
                className="rounded-lg border border-border bg-(--bg-secondary) px-3 py-2 text-sm text-(--fg)"
                value={boardSize}
                onChange={(e) => setBoardSize(Number(e.target.value))}
              >
                <option value={400}>400px</option>
                <option value={450}>450px</option>
                <option value={500}>500px</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game description */}
      <p className="mb-4 text-sm italic text-(--accent-site)">
        {game.description}
      </p>

      {/* Board */}
      <div>
        <Chessboard
          key={selectedGame}
          width={effectiveSize}
          height={effectiveSize}
          layout={maxSize < 500 ? "vertical" : undefined}
          theme={theme}
          pgn={game.pgn}
          showMoveHistory={true}
          showNavigation={true}
          showBoardControls={true}
          enableKeyboardNavigation={true}
          autoPromoteToQueen={true}
          moveHistoryWidth={maxSize < 500 ? `${effectiveSize}px` : "350px"}
        />
      </div>

      {/* Code */}
      <div className="mt-8">
        <CodeBlock
          title="Usage"
          code={`<Chessboard
  pgn={pgn}
  theme="${theme}"
  showMoveHistory={true}
  showNavigation={true}
  showBoardControls={true}
  enableKeyboardNavigation={true}
  moveHistoryWidth="350px"
/>`}
        />
      </div>
    </div>
  );
}
