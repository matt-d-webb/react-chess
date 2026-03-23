import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ChessProvider, useChess } from "./context/ChessProvider";
import { Board } from "./components/Board";
import { MoveHistory } from "./components/MoveHistory";
import { Navigation } from "./components/Navigation";
import { BoardControls } from "./components/BoardControls";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { cn, toPx } from "./lib/utils";
import type { ChessboardProps, ChessboardRef } from "./types";

const ChessboardInner = forwardRef<ChessboardRef, ChessboardProps>(
  (
    {
      width = "400px",
      height = "400px",
      showMoveHistory = false,
      showNavigation = false,
      showBoardControls = false,
      showCoordinates = true,
      layout = "horizontal",
      moveHistoryWidth = "300px",
      boardClassName,
      boardStyle,
      moveHistoryClassName,
      moveHistoryStyle,
      navigationClassName,
      navigationStyle,
      className,
      style,
      children,
      // Provider props (not used here, consumed by ChessProvider)
      fen: _fen,
      pgn: _pgn,
      orientation: _orientation,
      theme: _theme,
      autoPromoteToQueen: _autoPromote,
      enableKeyboardNavigation: _enableKbNav,
      onMove: _onMove,
      onPositionChange: _onPosChange,
      onCheck: _onCheck,
      onGameOver: _onGameOver,
      onIllegalMove: _onIllegal,
      onFlip: _onFlip,
      onPromotion: _onPromotion,
      // Chessground pass-through
      draggable,
      movable,
      animation,
      ...divProps
    },
    ref
  ) => {
    const ctx = useChess();
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        api: ctx.api,
        game: ctx.game,
        flip: ctx.flipBoard,
        navigateToMove: ctx.navigateToMove,
        goFirst: ctx.goFirst,
        goPrevious: ctx.goPrevious,
        goNext: ctx.goNext,
        goLast: ctx.goLast,
      }),
      [ctx]
    );

    useKeyboardNavigation(containerRef, {
      onNext: ctx.goNext,
      onPrevious: ctx.goPrevious,
      onFirst: ctx.goFirst,
      onLast: ctx.goLast,
      enabled: ctx.enableKeyboardNavigation && showNavigation,
    });

    const isVertical = layout === "vertical";
    const isBoardOnly = layout === "board-only";

    return (
      <div
        ref={containerRef}
        className={cn("rc-chessboard", className)}
        style={style}
        tabIndex={ctx.enableKeyboardNavigation ? 0 : undefined}
        {...divProps}
      >
        <div
          className={cn(
            "rc-chessboard__inner",
            isVertical && "rc-chessboard__inner--vertical"
          )}
        >
          <Board
            width={width}
            height={height}
            showCoordinates={showCoordinates}
            className={boardClassName}
            style={boardStyle}
            draggable={draggable}
            movable={movable}
            animation={animation}
          />

          {showMoveHistory && !isBoardOnly && (
            <div
              style={{
                height: toPx(height),
                width: isVertical ? "100%" : toPx(moveHistoryWidth),
              }}
            >
              <MoveHistory
                className={moveHistoryClassName}
                style={moveHistoryStyle}
              />
            </div>
          )}
        </div>

        {(showNavigation || showBoardControls) && !isBoardOnly && (
          <div className="rc-controls-bar">
            {showNavigation && (
              <Navigation
                className={navigationClassName}
                style={navigationStyle}
              />
            )}
            {showBoardControls && <BoardControls />}
          </div>
        )}
        {children}
      </div>
    );
  }
);

ChessboardInner.displayName = "ChessboardInner";

export const Chessboard = forwardRef<ChessboardRef, ChessboardProps>(
  (props, ref) => {
    const {
      fen,
      pgn,
      orientation,
      theme,
      autoPromoteToQueen,
      enableKeyboardNavigation,
      onMove,
      onPositionChange,
      onCheck,
      onGameOver,
      onIllegalMove,
      onFlip,
      onPromotion,
      ...rest
    } = props;

    return (
      <ChessProvider
        fen={fen}
        pgn={pgn}
        orientation={orientation}
        theme={theme}
        autoPromoteToQueen={autoPromoteToQueen}
        enableKeyboardNavigation={enableKeyboardNavigation}
        onMove={onMove}
        onPositionChange={onPositionChange}
        onCheck={onCheck}
        onGameOver={onGameOver}
        onIllegalMove={onIllegalMove}
        onFlip={onFlip}
        onPromotion={onPromotion}
      >
        <ChessboardInner ref={ref} {...props} />
      </ChessProvider>
    );
  }
);

Chessboard.displayName = "Chessboard";
