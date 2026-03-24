"use client";

import { useState, useRef, useCallback } from "react";
import {
  Chessboard,
  ChessProvider,
  Board,
  MoveHistory,
  Navigation,
  BoardControls,
  themePresets,
} from "@mdwebb/react-chess";
import type {
  ChessboardRef,
  ChessboardThemePreset,
  ChessboardLayout,
  PieceColor,
} from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { FadeIn } from "@/components/Motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";

/* ─── Section nav ──────────────────────────────────────────────── */

const sections = [
  { id: "playground", label: "Playground" },
  { id: "chessboard", label: "Chessboard" },
  { id: "compound", label: "Compound API" },
  { id: "callbacks", label: "Callbacks" },
  { id: "ref-api", label: "Ref API" },
  { id: "themes", label: "Themes" },
  { id: "types", label: "Types" },
];

/* ─── Sample PGN ───────────────────────────────────────────────── */

const samplePgn = `[Event "Paris Opera"]
[White "Paul Morphy"]
[Black "Duke of Brunswick and Count Isouard"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7
8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7
14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`;

/* ─── Prop table helper ────────────────────────────────────────── */

interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

function PropTable({ data }: { data: PropDef[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-(--bg-secondary)">
            <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
              Prop
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
              Type
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
              Default
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((prop, i) => (
            <tr
              key={prop.name}
              className={i % 2 === 0 ? "bg-(--card-bg)" : ""}
            >
              <td className="px-4 py-2 font-mono text-xs font-semibold text-(--accent-site) whitespace-nowrap">
                {prop.name}
                {prop.required && (
                  <span className="text-(--danger)">*</span>
                )}
              </td>
              <td className="px-4 py-2 font-mono text-xs text-(--fg-secondary) whitespace-nowrap">
                {prop.type}
              </td>
              <td className="px-4 py-2 font-mono text-xs text-(--muted-text)">
                {prop.default ?? "\u2014"}
              </td>
              <td className="px-4 py-2 text-xs text-(--fg-secondary)">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Toggle control ───────────────────────────────────────────── */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[0.8125rem]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border transition-colors"
        style={{ background: checked ? "var(--accent-site)" : "var(--bg-tertiary)" }}
      >
        <span
          className="inline-block size-3.5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(17px)" : "translateX(2px)" }}
        />
      </button>
      <span className="text-(--fg-secondary)">{label}</span>
    </label>
  );
}

/* ─── Select control ───────────────────────────────────────────── */

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">
        {label}
      </label>
      <select
        className="w-full rounded-lg border border-border bg-(--bg-secondary) px-3 py-2 text-sm text-(--fg)"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── Section heading ──────────────────────────────────────────── */

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 pt-12 pb-4">
      <h2 className="mb-1 text-xl font-bold tracking-tight">{title}</h2>
      <p className="max-w-2xl text-sm text-(--fg-secondary)">{description}</p>
    </div>
  );
}

/* ─── Prop data ────────────────────────────────────────────────── */

const chessboardProps: PropDef[] = [
  { name: "width", type: "string | number", default: '"400px"', description: "Board width" },
  { name: "height", type: "string | number", default: '"400px"', description: "Board height" },
  { name: "theme", type: "ChessboardTheme", default: '"brown"', description: "Theme preset name or custom theme object" },
  { name: "orientation", type: "PieceColor", default: '"white"', description: 'Board orientation: "white" or "black"' },
  { name: "layout", type: "ChessboardLayout", default: '"horizontal"', description: 'Layout: "horizontal", "vertical", or "board-only"' },
  { name: "fen", type: "string", default: '"start"', description: "FEN string for initial position" },
  { name: "pgn", type: "string", description: "PGN string to load a game" },
  { name: "showMoveHistory", type: "boolean", default: "false", description: "Display the move history panel" },
  { name: "showNavigation", type: "boolean", default: "false", description: "Display navigation buttons (First/Prev/Next/Last)" },
  { name: "showBoardControls", type: "boolean", default: "false", description: "Display board control buttons (flip, reset)" },
  { name: "showCoordinates", type: "boolean", default: "true", description: "Show a\u20131h / 1\u20138 coordinate labels" },
  { name: "moveHistoryWidth", type: "string | number", default: '"300px"', description: "Width of the move history panel" },
  { name: "autoPromoteToQueen", type: "boolean", default: "false", description: "Auto-promote pawns to queen without dialog" },
  { name: "enableKeyboardNavigation", type: "boolean", default: "true", description: "Enable arrow key / Home / End navigation" },
  { name: "draggable", type: "Config['draggable']", description: "Chessground draggable configuration pass-through" },
  { name: "movable", type: "Config['movable']", description: "Chessground movable configuration pass-through" },
  { name: "animation", type: "Config['animation']", description: "Chessground animation configuration pass-through" },
  { name: "className", type: "string", description: "CSS class for the root container" },
  { name: "style", type: "CSSProperties", description: "Inline styles for the root container" },
  { name: "boardClassName", type: "string", description: "CSS class for the board wrapper" },
  { name: "boardStyle", type: "CSSProperties", description: "Inline styles for the board wrapper" },
  { name: "moveHistoryClassName", type: "string", description: "CSS class for move history panel" },
  { name: "navigationClassName", type: "string", description: "CSS class for navigation controls" },
  { name: "children", type: "ReactNode", description: "Additional children rendered after the board layout" },
];

const providerProps: PropDef[] = [
  { name: "children", type: "ReactNode", required: true, description: "Child components that consume chess context" },
  { name: "fen", type: "string", default: '"start"', description: "FEN string for initial position" },
  { name: "pgn", type: "string", description: "PGN string to load a game" },
  { name: "orientation", type: "PieceColor", default: '"white"', description: "Initial board orientation" },
  { name: "theme", type: "ChessboardTheme", default: '"brown"', description: "Theme preset or custom theme object" },
  { name: "autoPromoteToQueen", type: "boolean", default: "false", description: "Skip promotion dialog, always promote to queen" },
  { name: "enableKeyboardNavigation", type: "boolean", default: "true", description: "Enable keyboard navigation for child components" },
];

const boardProps: PropDef[] = [
  { name: "width", type: "string | number", default: '"400px"', description: "Board width" },
  { name: "height", type: "string | number", default: '"400px"', description: "Board height" },
  { name: "showCoordinates", type: "boolean", default: "true", description: "Show coordinate labels" },
  { name: "draggable", type: "Config['draggable']", description: "Chessground draggable config" },
  { name: "movable", type: "Config['movable']", description: "Chessground movable config" },
  { name: "premovable", type: "Config['premovable']", description: "Chessground premove config" },
  { name: "drawable", type: "Config['drawable']", description: "Chessground drawing config" },
  { name: "highlight", type: "Config['highlight']", description: "Chessground highlight config" },
  { name: "animation", type: "Config['animation']", description: "Chessground animation config" },
  { name: "className", type: "string", description: "CSS class for the board wrapper" },
  { name: "style", type: "CSSProperties", description: "Inline styles for the board wrapper" },
];

const moveHistoryProps: PropDef[] = [
  { name: "moves", type: "Move[]", description: "Move array (uses context if omitted)" },
  { name: "onMoveClick", type: "(index: number) => void", description: "Called when a move is clicked" },
  { name: "currentMoveIndex", type: "number", description: "Index of the active move (-1 = start)" },
  { name: "annotations", type: "Record<number, string>", description: 'Move annotations (e.g. "!!", "?!")' },
  { name: "comments", type: "Record<number, string>", description: "Move comments from PGN" },
  { name: "variations", type: "Record<number, string[]>", description: "Variation lines" },
  { name: "clockTimes", type: "Record<number, string>", description: "Clock times per move" },
  { name: "evaluations", type: "Record<number, string>", description: "Position evaluations per move" },
  { name: "ravs", type: "Record<number, RAV[]>", description: "Recursive annotation variations" },
  { name: "headers", type: "PGNHeaders", description: "PGN header metadata (Event, Players, etc.)" },
  { name: "width", type: "string | number", description: "Panel width" },
  { name: "className", type: "string", description: "CSS class" },
  { name: "style", type: "CSSProperties", description: "Inline styles" },
];

const navigationProps: PropDef[] = [
  { name: "onFirst", type: "() => void", description: "Called when First button clicked (uses context if omitted)" },
  { name: "onPrevious", type: "() => void", description: "Called when Previous button clicked" },
  { name: "onNext", type: "() => void", description: "Called when Next button clicked" },
  { name: "onLast", type: "() => void", description: "Called when Last button clicked" },
  { name: "canGoForward", type: "boolean", description: "Enable/disable next and last buttons" },
  { name: "canGoBackward", type: "boolean", description: "Enable/disable first and previous buttons" },
  { name: "className", type: "string", description: "CSS class" },
];

const boardControlsProps: PropDef[] = [
  { name: "onFlip", type: "() => void", description: "Called when flip button clicked (uses context if omitted)" },
  { name: "showFlipButton", type: "boolean", default: "true", description: "Show the flip board button" },
  { name: "className", type: "string", description: "CSS class" },
];

const callbacksData: PropDef[] = [
  { name: "onMove", type: "(from: Key, to: Key, move: Move) => void", description: "Fires after every legal move. Receives origin/destination squares and the chess.js Move object." },
  { name: "onCheck", type: "(color: PieceColor) => void", description: "Fires when a side is placed in check. Receives the color in check." },
  { name: "onGameOver", type: "(result: GameOverResult) => void", description: "Fires on checkmate, stalemate, or draw. Result includes winner and reason." },
  { name: "onPromotion", type: "(from: Key, to: Key, piece: PromotionPiece) => void", description: "Fires after pawn promotion. Receives the chosen piece type." },
  { name: "onIllegalMove", type: "(from: string, to: string) => void", description: "Fires when a player attempts an illegal move." },
  { name: "onFlip", type: "(orientation: PieceColor) => void", description: "Fires when the board orientation changes." },
  { name: "onPositionChange", type: "(fen: string, moves: Move[]) => void", description: "Fires after any position update. Receives current FEN and full move history." },
];

const refMethods: PropDef[] = [
  { name: "api", type: "Api | null", description: "Raw Chessground API instance for advanced control" },
  { name: "game", type: "Chess | null", description: "chess.js game instance for direct game state access" },
  { name: "flip()", type: "() => void", description: "Flip the board orientation" },
  { name: "navigateToMove(i)", type: "(index: number) => void", description: "Jump to a specific move by index" },
  { name: "goFirst()", type: "() => void", description: "Navigate to the starting position" },
  { name: "goPrevious()", type: "() => void", description: "Navigate to the previous move" },
  { name: "goNext()", type: "() => void", description: "Navigate to the next move" },
  { name: "goLast()", type: "() => void", description: "Navigate to the last move" },
];

/* ─── Page ─────────────────────────────────────────────────────── */

export default function DocsPage() {
  /* Playground state */
  const [theme, setTheme] = useState<ChessboardThemePreset>("brown");
  const [orientation, setOrientation] = useState<PieceColor>("white");
  const [layout, setLayout] = useState<ChessboardLayout>("horizontal");
  const [showMoveHistory, setShowMoveHistory] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showBoardControls, setShowBoardControls] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [autoPromote, setAutoPromote] = useState(false);
  const [enableKeyboard, setEnableKeyboard] = useState(true);
  const [usePgn, setUsePgn] = useState(true);

  /* Ref demo state */
  const refBoard = useRef<ChessboardRef>(null);
  const [refLog, setRefLog] = useState<string[]>([]);
  const logRef = useCallback(
    (msg: string) => setRefLog((prev) => [msg, ...prev.slice(0, 9)]),
    []
  );

  const maxSize = useMaxBoardSize();
  const boardSize = Math.min(400, maxSize);
  const isMobile = maxSize < 500;

  /* Generated code for playground */
  const playgroundCode = `<Chessboard
  width={${boardSize}}
  height={${boardSize}}
  theme="${theme}"
  orientation="${orientation}"
  layout="${layout}"${usePgn ? '\n  pgn="..."' : ""}
  showMoveHistory={${showMoveHistory}}
  showNavigation={${showNavigation}}
  showBoardControls={${showBoardControls}}
  showCoordinates={${showCoordinates}}
  autoPromoteToQueen={${autoPromote}}
  enableKeyboardNavigation={${enableKeyboard}}
  onMove={(from, to, move) => {
    console.log(move.san);
  }}
/>`;

  const compoundCode = `import {
  ChessProvider, Board,
  MoveHistory, Navigation, BoardControls,
} from "@mdwebb/react-chess";

<ChessProvider pgn={pgn} theme="blue">
  <div style={{ display: "flex", gap: "1rem" }}>
    <div>
      <Board width={400} height={400} />
      <Navigation />
      <BoardControls />
    </div>
    <MoveHistory />
  </div>
</ChessProvider>`;

  const refCode = `const boardRef = useRef<ChessboardRef>(null);

<Chessboard ref={boardRef} pgn="..." />

// Imperative methods:
boardRef.current?.flip();
boardRef.current?.goNext();
boardRef.current?.goFirst();
boardRef.current?.navigateToMove(5);

// Access underlying instances:
boardRef.current?.game;  // chess.js
boardRef.current?.api;   // chessground`;

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10">
      {/* Title */}
      <FadeIn>
        <div className="mb-2">
          <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            API Reference
          </h1>
          <p className="max-w-xl text-(--fg-secondary)">
            Complete component documentation with interactive examples.
            Toggle any prop and see the board update in real time.
          </p>
        </div>
      </FadeIn>

      {/* Section nav */}
      <nav className="sticky top-14 z-10 -mx-4 mb-4 overflow-x-auto border-b border-border bg-(--bg)/90 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex gap-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-(--fg-secondary) transition-colors hover:bg-(--bg-secondary) hover:text-(--accent-site)"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ─── Playground ─────────────────────────────────────────── */}
      <SectionHeading
        id="playground"
        title="Interactive Playground"
        description="Toggle props and watch the board update live. The generated code below stays in sync."
      />

      <div className="flex flex-wrap gap-6">
        {/* Board */}
        <div className="shrink-0">
          <Chessboard
            key={`${usePgn}`}
            width={boardSize}
            height={boardSize}
            theme={theme}
            orientation={orientation}
            layout={isMobile ? "vertical" : layout}
            pgn={usePgn ? samplePgn : undefined}
            showMoveHistory={showMoveHistory}
            showNavigation={showNavigation}
            showBoardControls={showBoardControls}
            showCoordinates={showCoordinates}
            autoPromoteToQueen={autoPromote}
            enableKeyboardNavigation={enableKeyboard}
            moveHistoryWidth={isMobile ? `${boardSize}px` : "260px"}
          />
        </div>

        {/* Controls */}
        <div className="min-w-0 flex-1 sm:min-w-64">
          <Card className="mb-4" size="sm">
            <CardContent>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
                Appearance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <SelectControl
                  label="Theme"
                  value={theme}
                  options={[
                    { value: "brown", label: "Brown" },
                    { value: "blue", label: "Blue" },
                    { value: "green", label: "Green" },
                    { value: "gray", label: "Gray" },
                  ]}
                  onChange={setTheme}
                />
                <SelectControl
                  label="Orientation"
                  value={orientation}
                  options={[
                    { value: "white", label: "White" },
                    { value: "black", label: "Black" },
                  ]}
                  onChange={setOrientation}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4" size="sm">
            <CardContent>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
                Layout & Display
              </h3>
              <div className="mb-3">
                <SelectControl
                  label="Layout"
                  value={layout}
                  options={[
                    { value: "horizontal", label: "Horizontal" },
                    { value: "vertical", label: "Vertical" },
                    { value: "board-only", label: "Board Only" },
                  ]}
                  onChange={setLayout}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <Toggle label="showMoveHistory" checked={showMoveHistory} onChange={setShowMoveHistory} />
                <Toggle label="showNavigation" checked={showNavigation} onChange={setShowNavigation} />
                <Toggle label="showBoardControls" checked={showBoardControls} onChange={setShowBoardControls} />
                <Toggle label="showCoordinates" checked={showCoordinates} onChange={setShowCoordinates} />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4" size="sm">
            <CardContent>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
                Behavior
              </h3>
              <div className="flex flex-col gap-2.5">
                <Toggle label="Load PGN" checked={usePgn} onChange={setUsePgn} />
                <Toggle label="autoPromoteToQueen" checked={autoPromote} onChange={setAutoPromote} />
                <Toggle label="enableKeyboardNavigation" checked={enableKeyboard} onChange={setEnableKeyboard} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <CodeBlock code={playgroundCode} title="Generated Code" />
      </div>

      {/* ─── Chessboard ────────────────────────────────────────── */}
      <SectionHeading
        id="chessboard"
        title="Chessboard"
        description="All-in-one convenience component. Wraps ChessProvider, Board, MoveHistory, Navigation, and BoardControls into a single element with a flat prop API."
      />

      <div className="mb-4">
        <CodeBlock
          code={`import { Chessboard } from "@mdwebb/react-chess";
import "@mdwebb/react-chess/styles";

<Chessboard
  width={500}
  height={500}
  theme="brown"
  showMoveHistory={true}
  showNavigation={true}
  onMove={(from, to, move) => console.log(move.san)}
/>`}
          title="Usage"
        />
      </div>

      <PropTable data={chessboardProps} />

      {/* ─── Compound API ──────────────────────────────────────── */}
      <SectionHeading
        id="compound"
        title="Compound API"
        description="For custom layouts, compose Board, MoveHistory, Navigation, and BoardControls independently inside a ChessProvider. Each component reads from shared context."
      />

      <div className="mb-6">
        <CodeBlock code={compoundCode} title="Compound Usage" showLineNumbers />
      </div>

      {/* ChessProvider */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-bold">
          <Badge variant="outline" className="mr-2 font-mono">Provider</Badge>
          ChessProvider
        </h3>
        <p className="mb-3 text-sm text-(--fg-secondary)">
          Wraps compound components to provide shared chess game state and methods via React context.
          Use <code className="rounded bg-(--bg-tertiary) px-1.5 py-0.5 text-xs">useChess()</code> to
          access the context in custom components.
        </p>
        <PropTable data={providerProps} />
      </div>

      {/* Board */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-bold">
          <Badge variant="outline" className="mr-2 font-mono">Component</Badge>
          Board
        </h3>
        <p className="mb-3 text-sm text-(--fg-secondary)">
          Renders the interactive chess board via Chessground. Must be inside a ChessProvider.
        </p>
        <PropTable data={boardProps} />
      </div>

      {/* MoveHistory */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-bold">
          <Badge variant="outline" className="mr-2 font-mono">Component</Badge>
          MoveHistory
        </h3>
        <p className="mb-3 text-sm text-(--fg-secondary)">
          Scrollable move list with PGN metadata, annotations, and clickable moves for navigation.
          All props are optional when used inside ChessProvider.
        </p>
        <PropTable data={moveHistoryProps} />
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-bold">
          <Badge variant="outline" className="mr-2 font-mono">Component</Badge>
          Navigation
        </h3>
        <p className="mb-3 text-sm text-(--fg-secondary)">
          First / Previous / Next / Last buttons for stepping through moves.
          Handlers default to context methods when omitted.
        </p>
        <PropTable data={navigationProps} />
      </div>

      {/* BoardControls */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-bold">
          <Badge variant="outline" className="mr-2 font-mono">Component</Badge>
          BoardControls
        </h3>
        <p className="mb-3 text-sm text-(--fg-secondary)">
          Board control buttons (flip, etc.). Handlers default to context methods when omitted.
        </p>
        <PropTable data={boardControlsProps} />
      </div>

      {/* useChess */}
      <div className="mb-4">
        <h3 className="mb-2 text-base font-bold">
          <Badge variant="outline" className="mr-2 font-mono">Hook</Badge>
          useChess()
        </h3>
        <p className="mb-3 text-sm text-(--fg-secondary)">
          Access the full chess context inside any component within a ChessProvider.
          Returns game state, navigation methods, and configuration.
        </p>
        <CodeBlock
          code={`import { useChess } from "@mdwebb/react-chess";

function MyComponent() {
  const {
    game,              // chess.js instance
    fen,               // current FEN
    orientation,       // "white" | "black"
    moveHistory,       // Move[]
    currentMoveIndex,  // number (-1 = start)
    isCheck,           // boolean
    isGameOver,        // boolean
    flipBoard,         // () => void
    makeMove,          // (from, to, promotion?) => boolean
    navigateToMove,    // (index) => void
    goFirst,           // () => void
    goPrevious,        // () => void
    goNext,            // () => void
    goLast,            // () => void
  } = useChess();
}`}
          title="useChess() return value"
        />
      </div>

      {/* ─── Callbacks ─────────────────────────────────────────── */}
      <SectionHeading
        id="callbacks"
        title="Callbacks"
        description="Event handlers available on both Chessboard and ChessProvider. All callbacks are optional and receive fully typed arguments."
      />

      <PropTable data={callbacksData} />

      <div className="mt-4">
        <CodeBlock
          code={`<Chessboard
  onMove={(from, to, move) => {
    console.log(\`\${move.san} (\${from} \u2192 \${to})\`);
  }}
  onCheck={(color) => {
    console.log(\`\${color} is in check!\`);
  }}
  onGameOver={(result) => {
    if (result.winner) {
      alert(\`\${result.winner} wins by \${result.reason}\`);
    } else {
      alert(\`Draw: \${result.reason}\`);
    }
  }}
  onPromotion={(from, to, piece) => {
    console.log(\`Promoted to \${piece}\`);
  }}
/>`}
          title="Callback example"
        />
      </div>

      {/* ─── Ref API ───────────────────────────────────────────── */}
      <SectionHeading
        id="ref-api"
        title="Ref API"
        description="Access imperative methods and underlying chess.js / chessground instances via a React ref."
      />

      <div className="flex flex-wrap gap-6">
        <div className="shrink-0">
          <Chessboard
            ref={refBoard}
            width={Math.min(320, maxSize)}
            height={Math.min(320, maxSize)}
            theme="blue"
            pgn={samplePgn}
            showBoardControls={true}
            showNavigation={true}
            autoPromoteToQueen={true}
          />
        </div>

        <div className="min-w-0 flex-1 sm:min-w-64">
          <Card className="mb-4" size="sm">
            <CardContent>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-(--fg-secondary)">
                Try imperative methods
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "flip()", fn: () => { refBoard.current?.flip(); logRef("flip()"); } },
                  { label: "goFirst()", fn: () => { refBoard.current?.goFirst(); logRef("goFirst()"); } },
                  { label: "goPrevious()", fn: () => { refBoard.current?.goPrevious(); logRef("goPrevious()"); } },
                  { label: "goNext()", fn: () => { refBoard.current?.goNext(); logRef("goNext()"); } },
                  { label: "goLast()", fn: () => { refBoard.current?.goLast(); logRef("goLast()"); } },
                  { label: "navigateToMove(5)", fn: () => { refBoard.current?.navigateToMove(5); logRef("navigateToMove(5)"); } },
                ].map((btn) => (
                  <Button
                    key={btn.label}
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                    onClick={btn.fn}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>

              {refLog.length > 0 && (
                <div className="mt-3 rounded-md bg-(--bg-tertiary) p-2">
                  {refLog.map((msg, i) => (
                    <div key={i} className="font-mono text-xs text-(--fg-secondary)">
                      <span className="text-(--accent-site)">&gt;</span> {msg}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <CodeBlock code={refCode} title="Ref usage" />
        </div>
      </div>

      <div className="mt-4">
        <PropTable data={refMethods} />
      </div>

      {/* ─── Themes ────────────────────────────────────────────── */}
      <SectionHeading
        id="themes"
        title="Themes"
        description='Pass a preset name ("brown", "blue", "green", "gray") or a custom theme object. Use themePresets to access preset colors programmatically.'
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["brown", "blue", "green", "gray"] as const).map((preset) => (
          <div key={preset} className="text-center">
            <div className="mb-2 overflow-hidden rounded-md border border-border">
              <ChessProvider theme={preset}>
                <Board width="100%" height="auto" showCoordinates={false} />
              </ChessProvider>
            </div>
            <Badge variant={preset === "brown" ? "default" : "outline"} className="font-mono text-xs capitalize">
              {preset}
            </Badge>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <CodeBlock
          code={`// Use a preset
<Chessboard theme="blue" />

// Use a custom theme object
<Chessboard theme={{
  lightSquare: "#f0d9b5",
  darkSquare: "#b58863",
  selectedSquare: "rgba(20, 85, 30, 0.5)",
  lastMoveHighlight: "rgba(155, 199, 0, 0.41)",
  moveDestination: "rgba(20, 85, 30, 0.5)",
  checkHighlight: "rgba(255, 0, 0, 0.6)",
}} />

// Access preset values
import { themePresets } from "@mdwebb/react-chess";
console.log(themePresets.brown.darkSquare); // "#b58863"`}
          title="Theme usage"
        />
      </div>

      <PropTable
        data={[
          { name: "lightSquare", type: "string", required: true, description: "CSS color for light squares" },
          { name: "darkSquare", type: "string", required: true, description: "CSS color for dark squares" },
          { name: "selectedSquare", type: "string", description: "Highlight color for the selected piece square" },
          { name: "lastMoveHighlight", type: "string", description: "Highlight color for the last move squares" },
          { name: "moveDestination", type: "string", description: "Indicator color for legal move destinations" },
          { name: "checkHighlight", type: "string", description: "Highlight color when king is in check" },
        ]}
      />

      {/* ─── Types ─────────────────────────────────────────────── */}
      <SectionHeading
        id="types"
        title="Types Reference"
        description="All exported TypeScript types for full type safety."
      />

      <div className="flex flex-col gap-4">
        <CodeBlock
          title="Core types"
          code={`type PieceColor = "white" | "black";
type PromotionPiece = "q" | "r" | "b" | "n";
type ChessboardLayout = "horizontal" | "vertical" | "board-only";
type ChessboardThemePreset = "brown" | "blue" | "green" | "gray";
type ChessboardTheme = ChessboardThemePreset | CustomTheme;`}
          language="tsx"
        />

        <CodeBlock
          title="CustomTheme"
          code={`interface CustomTheme {
  lightSquare: string;
  darkSquare: string;
  selectedSquare?: string;
  lastMoveHighlight?: string;
  moveDestination?: string;
  checkHighlight?: string;
}`}
          language="tsx"
        />

        <CodeBlock
          title="GameOverResult"
          code={`interface GameOverResult {
  winner?: PieceColor;
  reason:
    | "checkmate"
    | "stalemate"
    | "insufficient_material"
    | "threefold_repetition"
    | "fifty_move_rule"
    | "draw";
}`}
          language="tsx"
        />

        <CodeBlock
          title="PGN types"
          code={`interface PGNHeaders {
  White?: string;
  Black?: string;
  Date?: string;
  Event?: string;
  Site?: string;
  Result?: string;
  Round?: string;
  WhiteElo?: string;
  BlackElo?: string;
  ECO?: string;
  [key: string]: string | undefined;
}

interface PGNMetadata {
  annotations: Record<number, string>;
  comments: Record<number, string>;
  variations: Record<number, string[]>;
  clockTimes: Record<number, string>;
  evaluations: Record<number, string>;
  ravs: Record<number, { moves: string; comment?: string }[]>;
  headers: PGNHeaders;
}`}
          language="tsx"
        />

        <CodeBlock
          title="ChessboardRef"
          code={`interface ChessboardRef {
  api: Api | null;       // Chessground API
  game: Chess | null;    // chess.js instance
  flip: () => void;
  navigateToMove: (index: number) => void;
  goFirst: () => void;
  goPrevious: () => void;
  goNext: () => void;
  goLast: () => void;
}`}
          language="tsx"
        />

        <CodeBlock
          title="Imports"
          code={`// Components
import {
  Chessboard,
  ChessProvider,
  Board,
  MoveHistory,
  Navigation,
  BoardControls,
} from "@mdwebb/react-chess";

// Hook
import { useChess } from "@mdwebb/react-chess";

// Theme utilities
import {
  themePresets,
  resolveTheme,
  themeToCSSSVars,
  generateBoardSVG,
} from "@mdwebb/react-chess";

// Types
import type {
  ChessboardProps,
  ChessboardRef,
  ChessProviderProps,
  BoardProps,
  MoveHistoryProps,
  NavigationProps,
  BoardControlsProps,
  ChessboardTheme,
  ChessboardThemePreset,
  CustomTheme,
  ChessboardLayout,
  PieceColor,
  PromotionPiece,
  GameOverResult,
  PGNMetadata,
  PGNHeaders,
  ChessContextValue,
} from "@mdwebb/react-chess";`}
          language="tsx"
        />
      </div>

      <div className="h-16" />
    </div>
  );
}
