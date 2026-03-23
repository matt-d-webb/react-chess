import React from "react";
import { SkipBack, SkipForward, Rewind, FastForward } from "lucide-react";
import { useChessOptional } from "../context/ChessProvider";
import { cn } from "../lib/utils";
import type { NavigationProps } from "../types";

export const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  (
    {
      onFirst: onFirstProp,
      onPrevious: onPreviousProp,
      onNext: onNextProp,
      onLast: onLastProp,
      canGoForward: canGoForwardProp,
      canGoBackward: canGoBackwardProp,
      className,
      ...props
    },
    ref
  ) => {
    const ctx = useChessOptional();

    const onFirst = onFirstProp ?? ctx?.goFirst;
    const onPrevious = onPreviousProp ?? ctx?.goPrevious;
    const onNext = onNextProp ?? ctx?.goNext;
    const onLast = onLastProp ?? ctx?.goLast;
    const canGoForward =
      canGoForwardProp ??
      (ctx
        ? ctx.currentMoveIndex < ctx.moveHistory.length - 1
        : false);
    const canGoBackward =
      canGoBackwardProp ?? (ctx ? ctx.currentMoveIndex > -1 : false);

    return (
      <div
        ref={ref}
        className={cn("rc-navigation", className)}
        {...props}
      >
        <button
          onClick={onFirst}
          disabled={!canGoBackward}
          className="rc-navigation__button"
          aria-label="First move"
        >
          <SkipBack className="rc-navigation__icon" />
        </button>
        <button
          onClick={onPrevious}
          disabled={!canGoBackward}
          className="rc-navigation__button"
          aria-label="Previous move"
        >
          <Rewind className="rc-navigation__icon" />
        </button>
        <button
          onClick={onNext}
          disabled={!canGoForward}
          className="rc-navigation__button"
          aria-label="Next move"
        >
          <FastForward className="rc-navigation__icon" />
        </button>
        <button
          onClick={onLast}
          disabled={!canGoForward}
          className="rc-navigation__button"
          aria-label="Last move"
        >
          <SkipForward className="rc-navigation__icon" />
        </button>
      </div>
    );
  }
);

Navigation.displayName = "Navigation";
