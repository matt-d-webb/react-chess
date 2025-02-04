import { Chessboard } from "react-chess";

import "../../../dist/assets/chessground.base.css";
import "../../../dist/assets/chessground.brown.css";
import "../../../dist/assets/chessground.cburnett.css";

const App = () => {
  const samplePgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6";

  return (
    <div className="flex justify-center items-center px-4 py-8">
      <Chessboard
        width={400}
        height={400}
        className="p-4 shadow-2xl rounded-2xl" // Custom Tailwind classes
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
