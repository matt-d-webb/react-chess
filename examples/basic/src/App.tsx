import { Chessboard } from "react-chess";

import "../../../dist/assets/chessground.base.css";
import "../../../dist/assets/chessground.brown.css";
import "../../../dist/assets/chessground.cburnett.css";
import "../../../dist/assets/chessboard.theme.css";

const App = () => {
  const samplePgn = `[Event "Third Rosenwald Trophy"]
                    [Site "New York, NY USA"]
                    [Date "1956.10.17"]
                    [Round "8"]
                    [White "Donald Byrne"]
                    [Black "Robert James Fischer"]
                    [Result "0-1"]
                    [ECO "D92"]
                    [WhiteElo "2510"]
                    [BlackElo "2200"]
                    [EventDate "1956.10.07"]

                    1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7
                    9. Rd1 Nb6 10. Qc5 Bg4 {This is a key position in the Grunfeld Defense. Fischer plays
                    aggressively, typical of his style.} 11. Bg5 {A mistake. 11. Be2 was better.} Na4 $1 
                    {Brilliant! Fischer begins a magnificent combination.} 12. Qa3 {If 12. Nxa4 Nxe4!, and
                    if 13. Qxe7 Qa5+ 14. b4 Qxa4 wins material.} Nxc3 $3 {The beginning of a brilliant
                    combination.} 13. bxc3 Nxe4 $1 {The point! The knight is immune because of ...Qd4+.} 
                    14. Bxe7 Qb6 15. Bc4 {White decides to give up the exchange hoping for compensation, but
                    Black's attack is too strong.} Nxc3 $1 16. Bc5 {Desperation. If 16. Qxc3, Qb2 follows
                    with a winning attack.} Rfe8+ 17. Kf1 Be6 $1 {The final finesse. Fischer offers his
                    bishop.} 18. Bxb6 {White grabs material but it's a fatal mistake.} Bxc4+ 19. Kg1 Ne2+ 
                    20. Kf1 Nxd4+ {Discovered attack!} 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 
                    25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 
                    31. Nf3 Ne4 32. Qb8 b5 {Every move by Fischer is precise.} 33. h4 h5 34. Ne5 Kg7 
                    35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 
                    41. Kc1 Rc2# {A masterpiece by the young Fischer. 0-1} 0-1`;

  return (
    <div className="flex justify-center items-center px-4 py-8">
      <Chessboard
        width={400}
        height={400}
        theme="gray"
        className="p-4 shadow-2xl rounded-2xl"
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
