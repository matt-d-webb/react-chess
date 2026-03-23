import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Chess } from "chess.js";
import type { Move } from "chess.js";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import type {
  ChessContextValue,
  ChessProviderProps,
  PGNMetadata,
  PieceColor,
  PromotionPiece,
  GameOverResult,
} from "../types";
import { parsePGNAnnotations, getDests, isPromotionMove } from "../lib/utils";

const ChessContext = createContext<ChessContextValue | null>(null);

export function useChess(): ChessContextValue {
  const ctx = useContext(ChessContext);
  if (!ctx) {
    throw new Error("useChess must be used within a <ChessProvider>");
  }
  return ctx;
}

export function useChessOptional(): ChessContextValue | null {
  return useContext(ChessContext);
}

const EMPTY_METADATA: PGNMetadata = {
  annotations: {},
  comments: {},
  variations: {},
  clockTimes: {},
  evaluations: {},
  ravs: {},
  headers: {},
};

export function ChessProvider({
  children,
  fen: fenProp = "start",
  pgn,
  orientation: orientationProp = "white",
  theme = "brown",
  autoPromoteToQueen = false,
  enableKeyboardNavigation = true,
  onMove,
  onPositionChange,
  onCheck,
  onGameOver,
  onIllegalMove,
  onFlip,
  onPromotion,
}: ChessProviderProps) {
  const gameRef = useRef<Chess>(
    new Chess(fenProp === "start" ? undefined : fenProp)
  );
  const [api, setApiState] = useState<Api | null>(null);
  const [fen, setFen] = useState<string>(gameRef.current.fen());
  const [orientation, setOrientation] = useState<PieceColor>(orientationProp);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
  const [pgnMetadata, setPgnMetadata] = useState<PGNMetadata>(EMPTY_METADATA);
  const [isCheck, setIsCheck] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Key;
    to: Key;
  } | null>(null);

  const setApi = useCallback((newApi: Api) => {
    setApiState(newApi);
  }, []);

  // Load PGN when it changes
  useEffect(() => {
    if (!pgn) return;
    try {
      const metadata = parsePGNAnnotations(pgn);
      setPgnMetadata(metadata);

      const chess = gameRef.current;
      chess.loadPgn(pgn);
      const moves = chess.history({ verbose: true });
      setMoveHistory(moves);
      setCurrentMoveIndex(moves.length - 1);
      setFen(chess.fen());
      setIsCheck(chess.isCheck());
      setIsGameOver(chess.isGameOver());
    } catch (e) {
      console.error("Invalid PGN:", e);
    }
  }, [pgn]);

  // Update fen when prop changes
  useEffect(() => {
    if (fenProp !== "start" && !pgn) {
      gameRef.current.load(fenProp);
      setFen(fenProp);
      setIsCheck(gameRef.current.isCheck());
      setIsGameOver(gameRef.current.isGameOver());
    }
  }, [fenProp, pgn]);

  // Sync orientation with prop
  useEffect(() => {
    setOrientation(orientationProp);
  }, [orientationProp]);

  const checkGameState = useCallback(
    (chess: Chess) => {
      const check = chess.isCheck();
      setIsCheck(check);

      if (check && onCheck) {
        const turn = chess.turn();
        onCheck(turn === "w" ? "white" : "black");
      }

      if (chess.isGameOver()) {
        setIsGameOver(true);
        if (onGameOver) {
          let result: GameOverResult;
          if (chess.isCheckmate()) {
            const winner = chess.turn() === "w" ? "black" : "white";
            result = { winner, reason: "checkmate" };
          } else if (chess.isStalemate()) {
            result = { reason: "stalemate" };
          } else if (chess.isInsufficientMaterial()) {
            result = { reason: "insufficient_material" };
          } else if (chess.isThreefoldRepetition()) {
            result = { reason: "threefold_repetition" };
          } else if (chess.isDraw()) {
            result = { reason: "draw" };
          } else {
            result = { reason: "draw" };
          }
          onGameOver(result);
        }
      } else {
        setIsGameOver(false);
      }
    },
    [onCheck, onGameOver]
  );

  const makeMove = useCallback(
    (from: string, to: string, promotion?: PromotionPiece): boolean => {
      const chess = gameRef.current;

      // Check if this is a promotion move
      if (!promotion && isPromotionMove(chess, from, to)) {
        if (autoPromoteToQueen) {
          promotion = "q";
        } else {
          setPendingPromotion({ from: from as Key, to: to as Key });
          return false;
        }
      }

      try {
        const move = chess.move({ from, to, promotion });
        if (move) {
          const moves = chess.history({ verbose: true });
          const newFen = chess.fen();

          setMoveHistory(moves);
          setCurrentMoveIndex(moves.length - 1);
          setFen(newFen);

          onMove?.(from as Key, to as Key, move);
          onPositionChange?.(newFen, moves);
          if (promotion) {
            onPromotion?.(from as Key, to as Key, promotion);
          }

          checkGameState(chess);

          // Update chessground
          if (api) {
            api.set({
              fen: newFen,
              turnColor: chess.turn() === "w" ? "white" : "black",
              movable: {
                dests: getDests(chess) as Map<Key, Key[]>,
              },
              check: chess.isCheck(),
            });
          }

          return true;
        }
      } catch {
        onIllegalMove?.(from, to);
      }
      return false;
    },
    [
      api,
      autoPromoteToQueen,
      onMove,
      onPositionChange,
      onIllegalMove,
      onPromotion,
      checkGameState,
    ]
  );

  const resolvePromotion = useCallback(
    (piece: PromotionPiece) => {
      if (pendingPromotion) {
        const { from, to } = pendingPromotion;
        setPendingPromotion(null);
        makeMove(from, to, piece);
      }
    },
    [pendingPromotion, makeMove]
  );

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
    // Reset the board position since the piece was dragged but move not completed
    if (api) {
      api.set({ fen: gameRef.current.fen() });
    }
  }, [api]);

  const navigateToMove = useCallback(
    (index: number) => {
      const chess = gameRef.current;
      chess.reset();

      if (index >= 0) {
        const moves = moveHistory.slice(0, index + 1);
        moves.forEach((move) => {
          chess.move(move);
        });
      }

      const newFen = chess.fen();
      setFen(newFen);
      setCurrentMoveIndex(index);
      setIsCheck(chess.isCheck());

      if (api) {
        api.set({
          fen: newFen,
          movable: {
            dests: getDests(chess) as Map<Key, Key[]>,
          },
          check: chess.isCheck(),
        });
      }

      onPositionChange?.(
        newFen,
        moveHistory.slice(0, index + 1)
      );
    },
    [api, moveHistory, onPositionChange]
  );

  const goFirst = useCallback(() => navigateToMove(-1), [navigateToMove]);
  const goPrevious = useCallback(
    () => navigateToMove(currentMoveIndex - 1),
    [navigateToMove, currentMoveIndex]
  );
  const goNext = useCallback(
    () => navigateToMove(currentMoveIndex + 1),
    [navigateToMove, currentMoveIndex]
  );
  const goLast = useCallback(
    () => navigateToMove(moveHistory.length - 1),
    [navigateToMove, moveHistory.length]
  );

  const flipBoard = useCallback(() => {
    const next = orientation === "white" ? "black" : "white";
    setOrientation(next);
    if (api) {
      api.set({ orientation: next });
    }
    // Defer callback to avoid setState-during-render
    queueMicrotask(() => onFlip?.(next));
  }, [api, onFlip, orientation]);

  const value = useMemo<ChessContextValue>(
    () => ({
      game: gameRef.current,
      api,
      fen,
      orientation,
      moveHistory,
      currentMoveIndex,
      pgnMetadata,
      isCheck,
      isGameOver,
      pendingPromotion,
      setApi,
      navigateToMove,
      goFirst,
      goPrevious,
      goNext,
      goLast,
      flipBoard,
      makeMove,
      resolvePromotion,
      cancelPromotion,
      theme,
      autoPromoteToQueen,
      enableKeyboardNavigation,
    }),
    [
      api,
      fen,
      orientation,
      moveHistory,
      currentMoveIndex,
      pgnMetadata,
      isCheck,
      isGameOver,
      pendingPromotion,
      setApi,
      navigateToMove,
      goFirst,
      goPrevious,
      goNext,
      goLast,
      flipBoard,
      makeMove,
      resolvePromotion,
      cancelPromotion,
      theme,
      autoPromoteToQueen,
      enableKeyboardNavigation,
    ]
  );

  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
}
