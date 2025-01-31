# React Chess

A React wrapper for [chessground](https://github.com/lichess-org/chessground) with [chess.js](https://github.com/jhlywa/chess.js) integration.

## Installation

```bash
npm install @mdwebb/react-chess
# or
yarn add @mdwebb/react-chess
```

## Usage

```tsx
import { Chessboard } from "@mdwebb/react-chess";

import { useRef } from "react";
import type { ChessboardRef } from "react-chess";

import "@mdwebb/react-chess/dist/styles/chessground.base.css";
import "@mdwebb/react-chess/dist/styles/chessground.brown.css";
import "@mdwebb/react-chess/dist/styles/chessground.cburnett.css";

function App() {
  const boardRef = useRef<ChessboardRef>(null);

  return (
    <div style={{ width: "400px", height: "400px" }}>
      <Chessboard
        ref={boardRef}
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        orientation="white"
        onMove={(from, to) => {
          console.log(`Moved from ${from} to ${to}`);
          // Access the chess.js instance
          console.log(boardRef.current?.game?.fen());
        }}
      />
    </div>
  );
}
```

## Props

| Prop         | Type                               | Default   | Description                |
| ------------ | ---------------------------------- | --------- | -------------------------- |
| width        | string \| number                   | '100%'    | Board width                |
| height       | string \| number                   | '100%'    | Board height               |
| fen          | string                             | 'start'   | FEN string for position    |
| orientation  | 'white' \| 'black'                 | 'white'   | Board orientation          |
| onMove       | (from: string, to: string) => void | undefined | Called after each move     |
| onDrop       | (from: string, to: string) => void | undefined | Called after piece drop    |
| gameInstance | Chess                              | undefined | Optional chess.js instance |

Plus all [chessground configuration options](https://github.com/lichess-org/chessground/blob/master/src/config.ts).

## Ref API

```typescript
interface ChessboardRef {
  api: Api | undefined; // Chessground API
  game: Chess | undefined; // chess.js instance
}
```

## License

[MIT](./LICENCE)
