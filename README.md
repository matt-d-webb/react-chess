# React Chess

A React chess component powered by [chessground](https://github.com/lichess-org/chessground) and [chess.js](https://github.com/jhlywa/chess.js).

## Features

- 🎮 Full chess game functionality
- 📝 Move history with navigation
- 🎯 Legal move validation
- 📋 PGN support
- ⚡ Written in TypeScript
- 🎨 Customizable styling

<p align="center">
  <img width="200px" src="/examples/basic/images/example-game.png" />
</p>

## Installation

```bash
npm install @mdwebb/react-chess
```

## Usage

First, import the required CSS:

```typescript
import "@mdwebb/react-chess/dist/assets/chessground.base.css";
import "@mdwebb/react-chess/dist/assets/chessground.brown.css";
import "@mdwebb/react-chess/dist/assets/chessground.cburnett.css";
```

### Basic Board

```tsx
import { Chessboard } from "@mdwebb/react-chess";

function App() {
  return (
    <div style={{ width: "400px", height: "400px" }}>
      <Chessboard />
    </div>
  );
}
```

### With Move History and Navigation

```tsx
function App() {
  return (
    <div style={{ width: "400px" }}>
      <Chessboard
        showMoveHistory={true}
        showNavigation={true}
        onMove={(from, to) => {
          console.log(`Moved from ${from} to ${to}`);
        }}
      />
    </div>
  );
}
```

### Loading a PGN

```tsx
function App() {
  const pgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6";

  return (
    <div style={{ width: "400px" }}>
      <Chessboard
        pgn={pgn}
        showMoveHistory={true}
        showNavigation={true}
        onPositionChange={(fen, moves) => {
          console.log("Current FEN:", fen);
          console.log("Move history:", moves);
        }}
      />
    </div>
  );
}
```

## Using Ref to Access Chess Instance

```tsx
import { useRef } from "react";
import { Chessboard, ChessboardRef } from "@mdwebb/react-chess";

function App() {
  const boardRef = useRef<ChessboardRef>(null);

  const handleClick = () => {
    // Access the chess.js instance
    const fen = boardRef.current?.game?.fen();
    console.log("Current FEN:", fen);

    // Access the chessground API
    const api = boardRef.current?.api;
    // Use api methods...
  };

  return (
    <div style={{ width: "400px" }}>
      <Chessboard ref={boardRef} />
      <button onClick={handleClick}>Get Position</button>
    </div>
  );
}
```

## Props

| Prop               | Type                                   | Default     | Description                                                                    |
| ------------------ | -------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `width`            | `string \| number`                     | `'400px'`   | Width of the chess board                                                       |
| `height`           | `string \| number`                     | `'400px'`   | Height of the chess board                                                      |
| `fen`              | `string`                               | `'start'`   | FEN string representing the board position. Use `'start'` for initial position |
| `orientation`      | `'white' \| 'black'`                   | `'white'`   | Which side of the board to show at the bottom                                  |
| `onMove`           | `(from: string, to: string) => void`   | `undefined` | Callback fired when a piece is moved                                           |
| `pgn`              | `string`                               | `undefined` | PGN notation to load a complete game                                           |
| `showMoveHistory`  | `boolean`                              | `false`     | Whether to show the move history panel                                         |
| `showNavigation`   | `boolean`                              | `false`     | Whether to show navigation controls                                            |
| `onPositionChange` | `(fen: string, moves: Move[]) => void` | `undefined` | Callback fired when the board position changes                                 |
| `gameInstance`     | `Chess`                                | `undefined` | Optional chess.js instance                                                     |

## Chessground Props

The component also accepts all [chessground configuration options](https://github.com/lichess-org/chessground/blob/master/src/config.ts). Common options include:

| Prop                 | Type                           | Default  | Description                                  |
| -------------------- | ------------------------------ | -------- | -------------------------------------------- |
| `movable.free`       | `boolean`                      | `false`  | Whether to allow free movement without rules |
| `movable.color`      | `'white' \| 'black' \| 'both'` | `'both'` | Which color is allowed to move               |
| `draggable.enabled`  | `boolean`                      | `true`   | Whether pieces can be dragged                |
| `premovable.enabled` | `boolean`                      | `true`   | Whether premoves are allowed                 |
| `viewOnly`           | `boolean`                      | `false`  | If true, disable all interactions            |

## Ref Methods

The component exposes certain functionality through a ref:

```typescript
interface ChessboardRef {
  api: Api | undefined; // Chessground API for direct board manipulation
  game: Chess | undefined; // chess.js instance for game logic
}
```

### LICENSE

[MIT](./LICENCE) © Matt Webb
