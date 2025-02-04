import { Chessboard } from "react-chess";

import "../../../dist/assets/chessground.base.css";
import "../../../dist/assets/chessground.brown.css";
import "../../../dist/assets/chessground.cburnett.css";

const App = () => {
  const samplePgn = `[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 {This is a comment} 3. Bb5 $1 a6 $6 4. Ba4`;

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
