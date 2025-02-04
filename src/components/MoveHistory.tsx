import * as React from "react";
import type { Move } from "chess.js";
import { cn } from "../lib/utils";

interface MoveHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  moves: Move[];
  onMoveClick?: (moveIndex: number) => void;
  currentMoveIndex?: number;
  annotations?: Record<number, string>;
  comments?: Record<number, string>;
  variations?: Record<number, string[]>;
  clockTimes?: Record<number, string>;
  evaluations?: Record<number, string>;
  ravs?: Record<number, { moves: string; comment?: string }[]>;
  headers?: {
    White?: string;
    Black?: string;
    Date?: string;
    Event?: string;
    Site?: string;
    Result?: string;
    Round?: string;
    WhiteElo?: string;
    BlackElo?: string;
    ECO?: string;
  };
}

const MoveHistory = React.forwardRef<HTMLDivElement, MoveHistoryProps>(
  (
    {
      moves,
      onMoveClick,
      currentMoveIndex = -1,
      annotations = {},
      comments = {},
      variations = {},
      clockTimes = {},
      evaluations = {},
      ravs = {},
      headers = {},
      className,
      ...props
    },
    ref
  ) => {
    const getMoveNumber = (index: number) => Math.floor(index / 2) + 1;
    const isWhiteMove = (index: number) => index % 2 === 0;

    return (
      <div
        ref={ref}
        className={cn(
          "font-mono mt-4 overflow-y-auto flex flex-col max-w-[400px]",
          className
        )}
        {...props}
      >
        {/* Game Metadata Section */}
        {Object.keys(headers).length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            {headers.Event && (
              <div className="font-semibold text-base mb-2">
                {headers.Event}
                {headers.Round && ` (${headers.Round})`}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-semibold">White</div>
                <div>{headers.White || "Unknown"}</div>
                {headers.WhiteElo && (
                  <div className="text-gray-600">Elo: {headers.WhiteElo}</div>
                )}
              </div>
              <div>
                <div className="font-semibold">Black</div>
                <div>{headers.Black || "Unknown"}</div>
                {headers.BlackElo && (
                  <div className="text-gray-600">Elo: {headers.BlackElo}</div>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-col text-gray-600">
              {headers.Date && <div>{headers.Date}</div>}
              {headers.Site && <div>{headers.Site}</div>}
              {headers.Result && <div>Result: {headers.Result}</div>}
              {headers.ECO && <div>ECO: {headers.ECO}</div>}
            </div>
          </div>
        )}

        {/* Moves Section */}
        <div className="p-2">
          {moves.map((move, index) => {
            const moveNumber = getMoveNumber(index);
            const isStart = isWhiteMove(index);
            const annotation = annotations[index];
            const comment = comments[index];
            const variation = variations[index];
            const clockTime = clockTimes[index];
            const evaluation = evaluations[index];
            const moveRavs = ravs[index];

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
                  {annotation && (
                    <span className="text-blue-600 ml-0.5">{annotation}</span>
                  )}
                  {clockTime && (
                    <span className="text-green-600 ml-1 text-sm">
                      {`[${clockTime}]`}
                    </span>
                  )}
                </span>
                {comment && (
                  <span className="text-gray-600 italic mr-2">
                    {`{${comment}}`}
                  </span>
                )}
                {variation &&
                  variation.map((var_moves, varIdx) => (
                    <div key={varIdx} className="ml-4 text-gray-600">
                      ({var_moves})
                    </div>
                  ))}
                {!isWhiteMove(index) && <span className="mr-2" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
);

MoveHistory.displayName = "MoveHistory";

export { MoveHistory };
export type { MoveHistoryProps };
