"use client";

import {
  ChessProvider,
  Board,
  MoveHistory,
  Navigation,
  BoardControls,
} from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";

const samplePgn = `[Event "World Championship"]
[Site "Reykjavik ISL"]
[Date "1972.07.23"]
[Round "6"]
[White "Robert James Fischer"]
[Black "Boris Spassky"]
[Result "1-0"]
[ECO "D59"]
[WhiteElo "2785"]
[BlackElo "2660"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6
8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8
14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6
20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5
27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8
33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6
39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0`;

const sideBySlideCode = `import {
  ChessProvider, Board,
  MoveHistory, Navigation, BoardControls,
} from "@mdwebb/react-chess";

<ChessProvider pgn={pgn} theme="blue">
  <div style={{
    display: "grid",
    gridTemplateColumns: "450px 1fr",
    gridTemplateRows: "450px auto",
    gap: "1rem",
  }}>
    <Board width={450} height={450} />
    <MoveHistory />
    <div style={{ gridColumn: "1 / -1" }}>
      <Navigation />
      <BoardControls />
    </div>
  </div>
</ChessProvider>`;

const verticalCode = `<ChessProvider pgn={pgn} theme="green">
  <div style={{ maxWidth: "450px" }}>
    <Board width={450} height={450} />
    <Navigation />
    <BoardControls />
    <div style={{ height: "200px" }}>
      <MoveHistory />
    </div>
  </div>
</ChessProvider>`;

const boardOnlyCode = `// Board-only — no history panel, just the board
<ChessProvider theme="gray">
  <Board width={300} height={300} />
</ChessProvider>`;

export default function CompoundDemo() {
  return (
    <div style={{ padding: "2.5rem 1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Compound Components</h1>
        <p>
          Build custom layouts by composing Board, MoveHistory, Navigation, and BoardControls
          independently within a ChessProvider. Each component reads from shared context.
        </p>
      </div>

      {/* Layout 1: Side-by-side */}
      <section style={{ marginBottom: "4rem" }}>
        <div  style={{ marginBottom: "1.5rem" }}>
          <span className="badge badge--accent" style={{ marginBottom: "0.5rem" }}>Layout 1</span>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700 }}>Side-by-Side</h2>
          <p style={{ color: "var(--fg-secondary)", fontSize: "0.875rem" }}>
            Board and move history displayed horizontally with controls spanning below.
          </p>
        </div>

        <div >
          <ChessProvider
            pgn={samplePgn}
            theme="blue"
            enableKeyboardNavigation={true}
            autoPromoteToQueen={true}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "450px 1fr",
                gridTemplateRows: "450px auto",
                gap: "1rem",
                maxWidth: "850px",
              }}
            >
              <Board width={450} height={450} />
              <div style={{ height: "450px" }}>
                <MoveHistory />
              </div>
              <div className="rc-controls-bar" style={{ gridColumn: "1 / -1" }}>
                <Navigation />
                <BoardControls />
              </div>
            </div>
          </ChessProvider>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <CodeBlock code={sideBySlideCode} title="Side-by-Side Layout" showLineNumbers />
        </div>
      </section>

      {/* Layout 2: Stacked */}
      <section style={{ marginBottom: "4rem" }}>
        <div  style={{ marginBottom: "1.5rem" }}>
          <span className="badge badge--accent" style={{ marginBottom: "0.5rem" }}>Layout 2</span>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700 }}>Stacked Vertical</h2>
          <p style={{ color: "var(--fg-secondary)", fontSize: "0.875rem" }}>
            Everything stacked vertically — perfect for narrow containers or mobile.
          </p>
        </div>

        <div >
          <ChessProvider pgn={samplePgn} theme="green" autoPromoteToQueen={true}>
            <div style={{ maxWidth: "450px" }}>
              <Board width={450} height={450} />
              <div className="rc-controls-bar">
                <Navigation />
                <BoardControls />
              </div>
              <div style={{ height: "200px", marginTop: "0.5rem" }}>
                <MoveHistory />
              </div>
            </div>
          </ChessProvider>
        </div>

        <div style={{ marginTop: "1.5rem", maxWidth: "450px" }}>
          <CodeBlock code={verticalCode} title="Vertical Layout" />
        </div>
      </section>

      {/* Layout 3: Board only */}
      <section>
        <div  style={{ marginBottom: "1.5rem" }}>
          <span className="badge badge--accent" style={{ marginBottom: "0.5rem" }}>Layout 3</span>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700 }}>Board Only</h2>
          <p style={{ color: "var(--fg-secondary)", fontSize: "0.875rem" }}>
            Minimal — just the board, nothing else. Use the ref for programmatic control.
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "start" }}>
          <div >
            <ChessProvider theme="gray" autoPromoteToQueen={true}>
              <Board width={300} height={300} />
            </ChessProvider>
          </div>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <CodeBlock code={boardOnlyCode} title="Board Only" />
          </div>
        </div>
      </section>
    </div>
  );
}
