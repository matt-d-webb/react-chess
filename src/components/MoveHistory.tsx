import * as React from "react";
import type { Move } from "chess.js";
import { cn } from "../lib/utils";

interface MoveHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  moves: Move[];
  onMoveClick?: (moveIndex: number) => void;
  currentMoveIndex?: number;
}

const MoveHistory = React.forwardRef<HTMLDivElement, MoveHistoryProps>(
  ({ moves, onMoveClick, currentMoveIndex = -1, className, ...props }, ref) => {
    const getMoveNumber = (index: number) => Math.floor(index / 2) + 1;
    const isWhiteMove = (index: number) => index % 2 === 0;

    return (
      <div
        ref={ref}
        className={cn("font-mono mt-4 max-h-48 overflow-y-auto p-2", className)}
        {...props}
      >
        {moves.map((move, index) => {
          const moveNumber = getMoveNumber(index);
          const isStart = isWhiteMove(index);

          return (
            <React.Fragment key={index}>
              {isStart && (
                <span className="mr-2 text-gray-500">{moveNumber}.</span>
              )}
              <span
                onClick={() => onMoveClick?.(index)}
                className={cn(
                  "mr-2 inline-block px-1 rounded",
                  onMoveClick && "cursor-pointer",
                  currentMoveIndex === index && "bg-gray-200",
                  "hover:bg-yellow-100"
                )}
              >
                {move.san}
              </span>
              {!isWhiteMove(index) && <span className="mr-2" />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

MoveHistory.displayName = "MoveHistory";

export { MoveHistory };
export type { MoveHistoryProps };
