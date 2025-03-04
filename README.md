# React Chess

A React chess component powered by [chessground](https://github.com/lichess-org/chessground), [chess.js](https://github.com/jhlywa/chess.js), and styled with Tailwind CSS.

## Features

- 🎮 Full chess game functionality
- 📝 Move history with navigation
- 🎯 Legal move validation
- 📋 PGN support
- ⚡ Written in TypeScript
- 🎨 Customizable styling with Tailwind CSS
- 💅 Built-in class name customization

<p align="center">
  <span>Basic<span>
  <img width="200px" src="/examples/basic/images/example-game.png" />
</p>

<p align="center">
  <span>Notation<span>
  <img width="400px" src="/examples/basic/images/example-game-notation.png" />
</p>

## Installation

```bash
npm install @mdwebb/react-chess
```

## Setup

First, import the required CSS and ensure Tailwind CSS is configured in your project:

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
    <Chessboard
      width={400}
      height={400}
      className="rounded-lg shadow-md" // Custom Tailwind classes
    />
  );
}
```

### With Move History and Navigation

```tsx
function App() {
  return (
    <Chessboard
      width={400}
      className="bg-white rounded-xl shadow-lg"
      showMoveHistory={true}
      showNavigation={true}
      onMove={(from, to) => {
        console.log(`Moved from ${from} to ${to}`);
      }}
    />
  );
}
```

### Loading a PGN

```tsx
function App() {
  const pgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6";

  return (
    <Chessboard
      pgn={pgn}
      className="bg-gray-50 p-4 rounded-lg"
      theme="blue"
      showMoveHistory={true}
      showNavigation={true}
      onPositionChange={(fen, moves) => {
        console.log("Current FEN:", fen);
        console.log("Move history:", moves);
      }}
    />
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
    <div className="space-y-4">
      <Chessboard ref={boardRef} className="bg-white shadow-md rounded-lg" />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Get Position
      </button>
    </div>
  );
}
```

## Props

| Prop               | Type                                   | Default     | Description                                                                    |
| ------------------ | -------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `width`            | `string \| number`                     | `'400px'`   | Width of the chess board                                                       |
| `height`           | `string \| number`                     | `'400px'`   | Height of the chess board                                                      |
| `className`        | `string`                               | `undefined` | Custom Tailwind classes for the container                                      |
| `theme`            | `string`                               | `'brown'`   | "blue", "green", "gray, "brown"                                                |
| `fen`              | `string`                               | `'start'`   | FEN string representing the board position. Use `'start'` for initial position |
| `orientation`      | `'white' \| 'black'`                   | `'white'`   | Which side of the board to show at the bottom                                  |
| `onMove`           | `(from: string, to: string) => void`   | `undefined` | Callback fired when a piece is moved                                           |
| `pgn`              | `string`                               | `undefined` | PGN notation to load a complete game                                           |
| `showMoveHistory`  | `boolean`                              | `false`     | Whether to show the move history panel                                         |
| `showNavigation`   | `boolean`                              | `false`     | Whether to show navigation controls                                            |
| `onPositionChange` | `(fen: string, moves: Move[]) => void` | `undefined` | Callback fired when the board position changes                                 |

The component also accepts all standard HTML div attributes and [chessground configuration options](https://github.com/lichess-org/chessground/blob/master/src/config.ts).

## Styling

The component is built with Tailwind CSS and supports customization through className props. Common styling options include:

```tsx
// Basic styling
<Chessboard className="bg-white rounded-lg shadow-md" />

// With padding and border
<Chessboard className="bg-white p-4 border rounded-xl shadow-lg" />

// Dark theme
<Chessboard className="bg-gray-800 rounded-lg shadow-xl" />
```

## Ref Methods

The component exposes certain functionality through a ref:

```typescript
interface ChessboardRef {
  api: Api | null; // Chessground API for direct board manipulation
  game: Chess | null; // chess.js instance for game logic
}
```

### LICENSE

[MIT](./LICENCE) © Matt Webb
