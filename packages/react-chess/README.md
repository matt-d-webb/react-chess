# @mdwebb/react-chess

A feature-rich, highly configurable React chess board component powered by [chessground](https://github.com/lichess-org/chessground) and [chess.js](https://github.com/jhlywa/chess.js).

<p align="center">
  <img width="600px" src="https://raw.githubusercontent.com/matt-d-webb/react-chess/master/docs/screenshot.png" alt="React Chess screenshot" />
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
# or
pnpm add @mdwebb/react-chess
# or
yarn add @mdwebb/react-chess
```

React 17, 18, or 19 is supported as a peer dependency.

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
      showMoveHistory
      showNavigation
      showBoardControls
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

Import the bundled stylesheet — it includes chessground base styles, piece assets, and component CSS:

```tsx
import "@mdwebb/react-chess/styles";
```

> **Note:** the `Chessboard` and `Board` components must not be wrapped in animation/motion containers (e.g. `framer-motion`'s `motion.div`, custom `FadeIn` wrappers). Chessground manipulates the DOM directly and these wrappers break its layout. Apply animations elsewhere.

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
  showMoveHistory
  showNavigation
  showBoardControls
  enableKeyboardNavigation
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

For fully custom layouts, compose the primitives yourself:

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

## API Reference

### `Chessboard` props

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

### Style overrides

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Container class |
| `boardClassName` | `string` | Board wrapper class |
| `boardStyle` | `CSSProperties` | Board wrapper inline styles |
| `moveHistoryClassName` | `string` | Move history class |
| `moveHistoryStyle` | `CSSProperties` | Move history inline styles |
| `navigationClassName` | `string` | Navigation class |
| `navigationStyle` | `CSSProperties` | Navigation inline styles |

### Ref methods

```ts
interface ChessboardRef {
  api: Api | null;           // Chessground API
  game: Chess | null;        // chess.js instance
  flip: () => void;
  navigateToMove: (i: number) => void;
  goFirst: () => void;
  goPrevious: () => void;
  goNext: () => void;
  goLast: () => void;
}
```

### Exports

```ts
// Components
import {
  Chessboard,
  ChessProvider,
  useChess,
  Board,
  MoveHistory,
  Navigation,
  BoardControls,
} from "@mdwebb/react-chess";

// Theme utilities
import {
  resolveTheme,
  themePresets,
  themeToCSSSVars,
  generateBoardSVG,
} from "@mdwebb/react-chess";

// Hooks
import { useKeyboardNavigation } from "@mdwebb/react-chess";

// Types
import type {
  ChessboardProps,
  ChessboardRef,
  ChessboardTheme,
  ChessboardThemePreset,
  CustomTheme,
  ChessboardLayout,
  ChessboardCallbacks,
  ChessProviderProps,
  BoardProps,
  MoveHistoryProps,
  NavigationProps,
  BoardControlsProps,
  PromotionDialogProps,
  PieceColor,
  PromotionPiece,
  GameOverResult,
  PGNMetadata,
  PGNHeaders,
  ChessContextValue,
} from "@mdwebb/react-chess";
```

## Contributing

This package lives in the [`react-chess` monorepo](https://github.com/matt-d-webb/react-chess). See [CONTRIBUTING.md](https://github.com/matt-d-webb/react-chess/blob/master/CONTRIBUTING.md) for the dev loop, build pipeline, and release flow.

## License

[MIT](https://github.com/matt-d-webb/react-chess/blob/master/LICENCE) © Matt Webb
