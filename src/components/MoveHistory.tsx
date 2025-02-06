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

// NAG to symbol mapping
const nagMap: Record<string, string> = {
  $1: "!",
  $2: "?",
  $3: "!!",
  $4: "??",
  $5: "!?",
  $6: "?!",
  $10: "=",
  $13: "∞",
  $14: "±",
  $15: "∓",
  $16: "±",
  $17: "∓",
  $18: "+−",
  $19: "−+",
  $20: "+--",
  $21: "--+",
  $22: "⨁",
  $23: "⨁",
  $32: "⟳",
  $36: "↑",
  $40: "→",
  $44: "=∞",
  $132: "⊕",
  $138: "⨂",
  $140: "∆",
  $142: "⌓",
  $146: "N",
};

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

    const getAnnotationSymbol = (nag: string) => nagMap[nag] || nag;

    return (
      <div
        ref={ref}
        className={cn(
          "h-full flex flex-col border rounded-lg bg-white",
          className
        )}
        {...props}
      >
        {/* Game Metadata Section */}
        {Object.keys(headers).length > 0 && (
          <div className="flex-none p-3 bg-gray-50 rounded-t-lg text-sm border-b">
            {headers.Event && (
              <div className="font-semibold text-base">
                {headers.Event}
                {headers.Round && ` • Round ${headers.Round}`}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-2">
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
            <div className="mt-2 flex flex-wrap gap-2 text-gray-600 text-sm">
              {headers.Date && <div>{headers.Date}</div>}
              {headers.Site && <div>{headers.Site}</div>}
              {headers.Result && <div>Result: {headers.Result}</div>}
              {headers.ECO && <div>ECO: {headers.ECO}</div>}
            </div>
          </div>
        )}

        {/* Moves Section */}
        <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
          <div className="flex flex-wrap">
            {moves.map((move, index) => {
              const moveNumber = getMoveNumber(index);
              const isStart = isWhiteMove(index);
              const annotation = annotations[index];
              const comment = comments[index];

              return (
                <React.Fragment key={index}>
                  {isStart && (
                    <span className="text-gray-500 mr-2">{moveNumber}.</span>
                  )}
                  <span
                    onClick={() => onMoveClick?.(index)}
                    className={cn(
                      "mr-2 px-1 rounded cursor-pointer",
                      currentMoveIndex === index && "bg-gray-200",
                      "hover:bg-yellow-100"
                    )}
                  >
                    {move.san}
                    {annotation && (
                      <span className="text-green-500 ml-0.5">
                        {getAnnotationSymbol(annotation)}
                      </span>
                    )}
                  </span>
                  {comment && (
                    <span className="text-gray-600 text-xs italic mr-2">
                      {`${comment}`}
                    </span>
                  )}
                  {!isWhiteMove(index) && <span className="mr-2" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

MoveHistory.displayName = "MoveHistory";

export { MoveHistory };
export type { MoveHistoryProps };
