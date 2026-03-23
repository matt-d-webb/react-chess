import React from "react";
import { useChessOptional } from "../context/ChessProvider";
import { cn, toPx } from "../lib/utils";
import type { MoveHistoryProps } from "../types";

const nagMap: Record<string, string> = {
  $1: "!",
  $2: "?",
  $3: "!!",
  $4: "??",
  $5: "!?",
  $6: "?!",
  $10: "=",
  $13: "\u221E",
  $14: "\u00B1",
  $15: "\u2213",
  $16: "\u00B1",
  $17: "\u2213",
  $18: "+\u2212",
  $19: "\u2212+",
  $20: "+--",
  $21: "--+",
  $22: "\u2A01",
  $23: "\u2A01",
  $32: "\u27F3",
  $36: "\u2191",
  $40: "\u2192",
  $44: "=\u221E",
  $132: "\u2295",
  $138: "\u2A02",
  $140: "\u2206",
  $142: "\u2313",
  $146: "N",
};

const getAnnotationSymbol = (nag: string) => nagMap[nag] || nag;

export const MoveHistory = React.forwardRef<HTMLDivElement, MoveHistoryProps>(
  (
    {
      moves: movesProp,
      onMoveClick: onMoveClickProp,
      currentMoveIndex: currentMoveIndexProp,
      annotations: annotationsProp,
      comments: commentsProp,
      headers: headersProp,
      width,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const ctx = useChessOptional();

    const moves = movesProp ?? ctx?.moveHistory ?? [];
    const onMoveClick = onMoveClickProp ?? ctx?.navigateToMove;
    const currentMoveIndex = currentMoveIndexProp ?? ctx?.currentMoveIndex ?? -1;
    const annotations = annotationsProp ?? ctx?.pgnMetadata.annotations ?? {};
    const comments = commentsProp ?? ctx?.pgnMetadata.comments ?? {};
    const headers = headersProp ?? ctx?.pgnMetadata.headers ?? {};

    const getMoveNumber = (index: number) => Math.floor(index / 2) + 1;
    const isWhiteMove = (index: number) => index % 2 === 0;

    return (
      <div
        ref={ref}
        className={cn("rc-move-history", className)}
        style={{
          height: "100%",
          ...(width ? { width: toPx(width) } : {}),
          ...style,
        }}
        {...props}
      >
        {Object.keys(headers).length > 0 && (
          <div className="rc-move-history__headers">
            {headers.Event && (
              <div className="rc-move-history__event">
                {headers.Event}
                {headers.Round && ` \u2022 Round ${headers.Round}`}
              </div>
            )}
            <div className="rc-move-history__players">
              <div>
                <div className="rc-move-history__player-label">White</div>
                <div>{headers.White || "Unknown"}</div>
                {headers.WhiteElo && (
                  <div className="rc-move-history__elo">
                    Elo: {headers.WhiteElo}
                  </div>
                )}
              </div>
              <div>
                <div className="rc-move-history__player-label">Black</div>
                <div>{headers.Black || "Unknown"}</div>
                {headers.BlackElo && (
                  <div className="rc-move-history__elo">
                    Elo: {headers.BlackElo}
                  </div>
                )}
              </div>
            </div>
            <div className="rc-move-history__meta">
              {headers.Date && <div>{headers.Date}</div>}
              {headers.Site && <div>{headers.Site}</div>}
              {headers.Result && <div>Result: {headers.Result}</div>}
              {headers.ECO && <div>ECO: {headers.ECO}</div>}
            </div>
          </div>
        )}

        <div className="rc-move-history__moves">
          <div className="rc-move-history__moves-inner">
            {moves.map((move, index) => {
              const moveNumber = getMoveNumber(index);
              const isStart = isWhiteMove(index);
              const annotation = annotations[index];
              const comment = comments[index];

              return (
                <React.Fragment key={index}>
                  {isStart && (
                    <span className="rc-move-history__move-number">
                      {moveNumber}.
                    </span>
                  )}
                  <span
                    onClick={() => onMoveClick?.(index)}
                    className={cn(
                      "rc-move-history__move",
                      currentMoveIndex === index &&
                        "rc-move-history__move--active"
                    )}
                  >
                    {move.san}
                    {annotation && (
                      <span className="rc-move-history__annotation">
                        {getAnnotationSymbol(annotation)}
                      </span>
                    )}
                  </span>
                  {comment && (
                    <span className="rc-move-history__comment">
                      {comment}
                    </span>
                  )}
                  {!isWhiteMove(index) && (
                    <span className="rc-move-history__move-spacer" />
                  )}
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
