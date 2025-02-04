import * as React from "react";
import { cn } from "../lib/utils";
import { SkipBack, SkipForward, Rewind, FastForward } from "lucide-react";

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  canGoForward: boolean;
  canGoBackward: boolean;
}

const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  (
    {
      onFirst,
      onPrevious,
      onNext,
      onLast,
      canGoForward,
      canGoBackward,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex gap-2 mt-4 justify-center", className)}
        {...props}
      >
        <button
          onClick={onFirst}
          disabled={!canGoBackward}
          className={cn(
            "p-2 rounded-lg transition-opacity",
            "hover:bg-gray-100 active:bg-gray-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-gray-400",
            "dark:hover:bg-gray-800 dark:active:bg-gray-700"
          )}
          aria-label="First move"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={onPrevious}
          disabled={!canGoBackward}
          className={cn(
            "p-2 rounded-lg transition-opacity",
            "hover:bg-gray-100 active:bg-gray-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-gray-400",
            "dark:hover:bg-gray-800 dark:active:bg-gray-700"
          )}
          aria-label="Previous move"
        >
          <Rewind className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          disabled={!canGoForward}
          className={cn(
            "p-2 rounded-lg transition-opacity",
            "hover:bg-gray-100 active:bg-gray-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-gray-400",
            "dark:hover:bg-gray-800 dark:active:bg-gray-700"
          )}
          aria-label="Next move"
        >
          <FastForward className="w-5 h-5" />
        </button>
        <button
          onClick={onLast}
          disabled={!canGoForward}
          className={cn(
            "p-2 rounded-lg transition-opacity",
            "hover:bg-gray-100 active:bg-gray-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-gray-400",
            "dark:hover:bg-gray-800 dark:active:bg-gray-700"
          )}
          aria-label="Last move"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    );
  }
);

Navigation.displayName = "Navigation";

export { Navigation };
export type { NavigationProps };
