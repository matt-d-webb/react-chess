import { useRef } from "react";
import { Chessboard, ChessboardRef } from "react-chess";

// Import the required CSS
import "../../../dist/styles/chessground.base.css";
import "../../../dist/styles/chessground.brown.css";
import "../../../dist/styles/chessground.cburnett.css";

const App = () => {
  const boardRef = useRef<ChessboardRef>(null);

  const examples = [
    {
      title: "Default Board",
      render: () => (
        <div style={{ width: "400px", height: "400px", marginBottom: "2rem" }}>
          <Chessboard
            ref={boardRef}
            onMove={(from, to) => {
              console.log(`Moved from ${from} to ${to}`);
              console.log(`Current FEN: ${boardRef.current?.game?.fen()}`);
            }}
          />
        </div>
      ),
    },
    {
      title: "Custom Position",
      render: () => (
        <div style={{ width: "400px", height: "400px", marginBottom: "2rem" }}>
          <Chessboard
            fen="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
            orientation="black"
          />
        </div>
      ),
    },
    {
      title: "Different Size",
      render: () => (
        <div style={{ width: "300px", height: "300px", marginBottom: "2rem" }}>
          <Chessboard />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>React Chess Examples</h1>
      {examples.map((example, index) => (
        <div key={index}>
          <h2>{example.title}</h2>
          {example.render()}
        </div>
      ))}
    </div>
  );
};

export default App;
