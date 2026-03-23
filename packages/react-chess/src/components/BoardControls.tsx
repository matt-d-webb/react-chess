import React from "react";
import { RefreshCw } from "lucide-react";
import { useChessOptional } from "../context/ChessProvider";
import { cn } from "../lib/utils";
import type { BoardControlsProps } from "../types";

export const BoardControls = React.forwardRef<
  HTMLDivElement,
  BoardControlsProps
>(
  (
    {
      onFlip: onFlipProp,
      showFlipButton = true,
      className,
      ...props
    },
    ref
  ) => {
    const ctx = useChessOptional();
    const onFlip = onFlipProp ?? ctx?.flipBoard;

    return (
      <div
        ref={ref}
        className={cn("rc-board-controls", className)}
        {...props}
      >
        {showFlipButton && (
          <button
            onClick={onFlip}
            className="rc-board-controls__button"
            aria-label="Flip board"
            title="Flip board"
          >
            <RefreshCw className="rc-board-controls__icon" />
          </button>
        )}
      </div>
    );
  }
);

BoardControls.displayName = "BoardControls";
