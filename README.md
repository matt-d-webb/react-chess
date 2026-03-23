# React Chess

A feature-rich, highly configurable React chess board component powered by [chessground](https://github.com/lichess-org/chessground) and [chess.js](https://github.com/jhlywa/chess.js).

<!-- Replace with your screenshots -->
<p align="center">
  <img width="600px" src="/docs/screenshot.png" />
</p>

## Features

- **Custom Themes** — 4 built-in presets or create your own with custom colors
- **PGN Support** — Load games with annotations, NAG symbols, comments, and metadata
- **Compound Components** — Compose `Board`, `MoveHistory`, `Navigation` independently
- **Promotion UI** — Visual piece selection dialog for pawn promotions
- **Keyboard Navigation** — Arrow keys and Home/End to step through moves
- **Game Callbacks** — `onCheck`, `onGameOver`, `onIllegalMove`, `onPromotion`, `onFlip`
- **Board Flip** — Toggle orientation via button, prop, or ref
- **Full TypeScript** — Every prop, callback, and ref fully typed

## Installation

```bash
npm install @mdwebb/react-chess
```

## Quick Start

```tsx
import { Chessboard } from "@mdwebb/react-chess";
import "@mdwebb/react-chess/styles";

function App() {
  return (
    <Chessboard
      width={400}
      height={400}
      theme="brown"
      showMoveHistory={true}
      showNavigation={true}
      showBoardControls={true}
      onMove={(from, to, move) => {
        console.log(move.san);
      }}
      onGameOver={(result) => {
        console.log(result.reason);
      }}
    />
  );
}
```

## CSS Setup

Import the bundled stylesheet which includes chessground base styles, piece assets, and component CSS:

```tsx
import "@mdwebb/react-chess/styles";
```

## Usage

### Basic Board

```tsx
<Chessboard width={400} height={400} theme="brown" />
```

### PGN Viewer

```tsx
<Chessboard
  pgn={pgnString}
  theme="blue"
  showMoveHistory={true}
  showNavigation={true}
  showBoardControls={true}
  enableKeyboardNavigation={true}
  moveHistoryWidth="350px"
/>
```

### Custom Theme

```tsx
<Chessboard
  theme={{
    lightSquare: "#f0d9b5",
    darkSquare: "#b58863",
    selectedSquare: "rgba(20, 85, 30, 0.5)",
    lastMoveHighlight: "rgba(155, 199, 0, 0.41)",
    moveDestination: "rgba(20, 85, 30, 0.5)",
  }}
/>
```

### Compound Components

Build fully custom layouts using the compound component API:

```tsx
import {
  ChessProvider,
  Board,
  MoveHistory,
  Navigation,
  BoardControls,
} from "@mdwebb/react-chess";

function CustomLayout() {
  return (
    <ChessProvider pgn={pgn} theme="blue">
      <div style={{ display: "grid", gridTemplateColumns: "450px 1fr" }}>
        <Board width={450} height={450} />
        <MoveHistory />
      </div>
      <Navigation />
      <BoardControls />
    </ChessProvider>
  );
}
```

### Game Callbacks

```tsx
<Chessboard
  onMove={(from, to, move) => console.log(move.san)}
  onCheck={(color) => console.log(`${color} in check`)}
  onGameOver={(result) => console.log(result.reason)}
  onPromotion={(from, to, piece) => console.log(`Promoted to ${piece}`)}
  onIllegalMove={(from, to) => console.log("Illegal")}
  onFlip={(orientation) => console.log(orientation)}
  onPositionChange={(fen, moves) => console.log(fen)}
/>
```

### Ref Access

```tsx
import { useRef } from "react";
import { Chessboard, ChessboardRef } from "@mdwebb/react-chess";

function App() {
  const ref = useRef<ChessboardRef>(null);

  return (
    <>
      <Chessboard ref={ref} />
      <button onClick={() => ref.current?.flip()}>Flip</button>
      <button onClick={() => ref.current?.goFirst()}>First</button>
      <button onClick={() => console.log(ref.current?.game?.fen())}>
        Log FEN
      </button>
    </>
  );
}
```

## Props

### Chessboard (convenience wrapper)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string \| number` | `'400px'` | Board width |
| `height` | `string \| number` | `'400px'` | Board height |
| `theme` | `ChessboardThemePreset \| CustomTheme` | `'brown'` | `"brown"`, `"blue"`, `"green"`, `"gray"`, or a custom theme object |
| `fen` | `string` | `'start'` | FEN string for the position |
| `pgn` | `string` | — | PGN notation to load a game |
| `orientation` | `'white' \| 'black'` | `'white'` | Board orientation |
| `showMoveHistory` | `boolean` | `false` | Show move history panel |
| `showNavigation` | `boolean` | `false` | Show navigation controls |
| `showBoardControls` | `boolean` | `false` | Show board flip button |
| `showCoordinates` | `boolean` | `true` | Show rank/file labels |
| `layout` | `'horizontal' \| 'vertical' \| 'board-only'` | `'horizontal'` | Layout arrangement |
| `moveHistoryWidth` | `string \| number` | `'300px'` | Width of the move history panel |
| `autoPromoteToQueen` | `boolean` | `false` | Skip promotion dialog |
| `enableKeyboardNavigation` | `boolean` | `true` | Arrow key navigation |

### Callbacks

| Callback | Type | Description |
|----------|------|-------------|
| `onMove` | `(from, to, move) => void` | Fired after a legal move |
| `onPositionChange` | `(fen, moves) => void` | Fired when position changes |
| `onCheck` | `(color) => void` | Fired when a player is in check |
| `onGameOver` | `(result) => void` | Fired on checkmate, stalemate, draw |
| `onIllegalMove` | `(from, to) => void` | Fired on illegal move attempt |
| `onPromotion` | `(from, to, piece) => void` | Fired when a pawn promotes |
| `onFlip` | `(orientation) => void` | Fired when board is flipped |

### Style Override Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Container class |
| `boardClassName` | `string` | Board wrapper class |
| `boardStyle` | `CSSProperties` | Board wrapper inline styles |
| `moveHistoryClassName` | `string` | Move history class |
| `moveHistoryStyle` | `CSSProperties` | Move history inline styles |
| `navigationClassName` | `string` | Navigation class |
| `navigationStyle` | `CSSProperties` | Navigation inline styles |

### Ref Methods

```typescript
interface ChessboardRef {
  api: Api | null;           // Chessground API
  game: Chess | null;        // chess.js instance
  flip: () => void;          // Flip board orientation
  navigateToMove: (i) => void;
  goFirst: () => void;
  goPrevious: () => void;
  goNext: () => void;
  goLast: () => void;
}
```

## Compound Component Exports

```tsx
// Components
export { Chessboard } from "@mdwebb/react-chess";
export { ChessProvider, useChess } from "@mdwebb/react-chess";
export { Board } from "@mdwebb/react-chess";
export { MoveHistory } from "@mdwebb/react-chess";
export { Navigation } from "@mdwebb/react-chess";
export { BoardControls } from "@mdwebb/react-chess";

// Theme utilities
export { resolveTheme, themePresets, generateBoardSVG } from "@mdwebb/react-chess";

// Hooks
export { useKeyboardNavigation } from "@mdwebb/react-chess";
```

## Project Structure

This is a [Turborepo](https://turbo.build/) monorepo:

```
react-chess/
├── packages/react-chess/   # The library (@mdwebb/react-chess)
├── apps/web/               # Next.js demo site
├── turbo.json
└── pnpm-workspace.yaml
```

### Development

```bash
pnpm install
pnpm dev          # Run both library (watch) and demo site
```

### Build

```bash
pnpm build        # Build library + demo site
```

## License

[MIT](./LICENCE) © Matt Webb
