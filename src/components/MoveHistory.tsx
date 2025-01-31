import React from "react";
import type { Move } from "chess.js";

interface MoveHistoryProps {
  moves: Move[];
  onMoveClick?: (moveIndex: number) => void;
  currentMoveIndex?: number;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  onMoveClick,
  currentMoveIndex = -1,
}) => {
  const getMoveNumber = (index: number) => Math.floor(index / 2) + 1;
  const isWhiteMove = (index: number) => index % 2 === 0;

  return (
    <div
      style={{
        fontFamily: "monospace",
        marginTop: "1rem",
        maxHeight: "200px",
        overflowY: "auto",
        padding: "0.5rem",
      }}
    >
      {moves.map((move, index) => {
        const moveNumber = getMoveNumber(index);
        const isStart = isWhiteMove(index);

        return (
          <React.Fragment key={index}>
            {isStart && (
              <span style={{ marginRight: "8px", color: "#666" }}>
                {moveNumber}.
              </span>
            )}
            <span
              onClick={() => onMoveClick?.(index)}
              style={{
                cursor: onMoveClick ? "pointer" : "default",
                marginRight: "8px",
                backgroundColor:
                  currentMoveIndex === index ? "#e2e8f0" : "transparent",
                padding: "2px 4px",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
              {move.san}
            </span>
            {!isWhiteMove(index) && <span style={{ marginRight: "8px" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
