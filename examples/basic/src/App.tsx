import { Chessboard } from "react-chess";

import "../../../dist/assets/chessground.base.css";
import "../../../dist/assets/chessground.brown.css";
import "../../../dist/assets/chessground.cburnett.css";

const App = () => {
  const samplePgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6";

  return (
    <div style={{ width: "400px" }}>
      <Chessboard
        pgn={samplePgn}
        showMoveHistory={true}
        showNavigation={true}
        onPositionChange={(fen, moves) => {
          console.log("Position changed:", fen);
          console.log("Moves:", moves);
        }}
      />
    </div>
  );
};

export default App;
