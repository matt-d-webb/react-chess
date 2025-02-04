import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Chessground } from "chessground";
import { Chess, Move } from "chess.js";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import type { ChessboardProps, ChessboardRef } from "./types";
import { MoveHistory } from "./components/MoveHistory";
import { Navigation } from "./components/Navigation";
import { cn } from "@/lib/utils";

const CHESSGROUND_PROPS = [
  "draggable",
  "movable",
  "premovable",
  "predroppable",
  "events",
  "drawable",
  "highlight",
  "animation",
  "fen",
  "orientation",
] as const;

interface PGNMetadata {
  annotations: Record<number, string>;
  comments: Record<number, string>;
  variations: Record<number, string[]>;
  clockTimes: Record<number, string>;
  evaluations: Record<number, string>;
  ravs: Record<number, { moves: string; comment?: string }[]>;
  headers: {
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

const parsePGNAnnotations = (pgn: string): PGNMetadata => {
  const metadata: PGNMetadata = {
    annotations: {},
    comments: {},
    variations: {},
    clockTimes: {},
    evaluations: {},
    ravs: {},
    headers: {},
  };

  // Remove header tags and store them
  const headerPattern = /\[(\w+)\s+"([^"]+)"\]/g;
  let headerMatch;
  while ((headerMatch = headerPattern.exec(pgn)) !== null) {
    const [_, key, value] = headerMatch;
    metadata.headers[key as keyof PGNMetadata["headers"]] = value;
  }

  // Get movetext (everything after the headers)
  const movetext = pgn.replace(/\[.*?\]\s*/g, "").trim();

  let moveIndex = -1; // Start at -1 to account for 0-based indexing
  let inComment = false;
  let inVariation = false;
  let variationDepth = 0;
  let currentComment = "";
  let currentVariation = "";

  // Process the movetext character by character
  for (let i = 0; i < movetext.length; i++) {
    const char = movetext[i];

    // Handle comments
    if (char === "{") {
      inComment = true;
      currentComment = "";
      continue;
    }

    if (char === "}") {
      inComment = false;
      if (currentComment.trim()) {
        // Check for clock time annotation
        const clockMatch = currentComment.match(/\[%clk\s*([\d:.]+)\]/);
        if (clockMatch) {
          metadata.clockTimes[moveIndex] = clockMatch[1];
        } else {
          metadata.comments[moveIndex] = currentComment.trim();
        }
      }
      continue;
    }

    if (inComment) {
      currentComment += char;
      continue;
    }

    // Handle variations
    if (char === "(") {
      inVariation = true;
      variationDepth++;
      currentVariation = "";
      continue;
    }

    if (char === ")") {
      if (currentVariation.trim()) {
        if (!metadata.variations[moveIndex]) {
          metadata.variations[moveIndex] = [];
        }
        metadata.variations[moveIndex].push(currentVariation.trim());
      }
      variationDepth--;
      inVariation = variationDepth > 0;
      continue;
    }

    if (inVariation) {
      currentVariation += char;
      continue;
    }

    // Handle NAG annotations
    if (char === "$") {
      let nag = "$";
      while (i + 1 < movetext.length && /\d/.test(movetext[i + 1])) {
        nag += movetext[++i];
      }
      metadata.annotations[moveIndex] = nag;
      continue;
    }

    // Handle evaluation symbols
    const evalSymbols = ["+-", "-+", "±", "∓", "⩲", "⩱", "=", "∞", "⊕"];
    for (const symbol of evalSymbols) {
      if (movetext.slice(i).startsWith(symbol)) {
        metadata.evaluations[moveIndex] = symbol;
        i += symbol.length - 1;
        break;
      }
    }

    // Count moves by tracking complete moves
    const movePattern =
      /^([RNBQKP]?[a-h]?[1-8]?x?[a-h][1-8](?:=[RNBQ])?[+#]?)\s/;
    const nextChars = movetext.slice(i);
    const moveMatch = nextChars.match(movePattern);

    if (moveMatch) {
      moveIndex++;
      i += moveMatch[1].length - 1; // Skip the matched move
    }
  }

  return metadata;
};

export const Chessboard = forwardRef<ChessboardRef, ChessboardProps>(
  (
    {
      width = "400px",
      height = "400px",
      fen = "start",
      orientation = "white",
      onMove,
      pgn,
      showMoveHistory = false,
      showNavigation = false,
      onPositionChange,
      className,
      ...props
    },
    ref
  ) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<Api>();
    const gameRef = useRef<Chess>(new Chess(fen === "start" ? undefined : fen));
    const [moveHistory, setMoveHistory] = useState<Move[]>([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
    const [pgnMetadata, setPgnMetadata] = useState<PGNMetadata>({
      annotations: {},
      comments: {},
      variations: {},
      clockTimes: {},
      evaluations: {},
      ravs: {},
      headers: {},
    });

    const divProps: Record<string, unknown> = {};
    const chessgroundProps: Record<string, unknown> = {};

    Object.entries(props).forEach(([key, value]) => {
      if (
        CHESSGROUND_PROPS.includes(key as (typeof CHESSGROUND_PROPS)[number])
      ) {
        chessgroundProps[key] = value;
      } else {
        divProps[key] = value;
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        api: apiRef.current || null,
        game: gameRef.current || null,
      }),
      []
    );

    useEffect(() => {
      if (pgn && gameRef.current) {
        try {
          // Parse PGN annotations before loading into chess.js
          const metadata = parsePGNAnnotations(pgn);
          setPgnMetadata(metadata);

          gameRef.current.loadPgn(pgn);
          const moves = gameRef.current.history({ verbose: true });
          setMoveHistory(moves);
          setCurrentMoveIndex(moves.length - 1);
          apiRef.current?.set({ fen: gameRef.current.fen() });
        } catch (e) {
          console.error("Invalid PGN:", e);
        }
      }
    }, [pgn]);

    useEffect(() => {
      if (!boardRef.current) return;

      const chess = gameRef.current;

      const cg = Chessground(boardRef.current, {
        orientation,
        fen: chess.fen(),
        movable: {
          free: false,
          color: "both",
          dests: getDests(chess),
        },
        events: {
          move: (orig, dest) => {
            const move = chess.move({
              from: orig,
              to: dest,
              promotion: "q",
            });

            if (move) {
              onMove?.(orig as Key, dest as Key);

              const moves = chess.history({ verbose: true });
              setMoveHistory(moves);
              setCurrentMoveIndex(moves.length - 1);
              onPositionChange?.(chess.fen(), moves);

              cg.set({
                fen: chess.fen(),
                movable: {
                  dests: getDests(chess),
                },
              });
            }
          },
        },
        ...chessgroundProps,
      });

      apiRef.current = cg;

      return () => {
        cg.destroy();
      };
    }, []);

    useEffect(() => {
      if (apiRef.current && fen !== "start") {
        apiRef.current.set({ fen });
        gameRef.current.load(fen);
      }
    }, [fen]);

    const navigateToMove = (index: number) => {
      if (!gameRef.current || !apiRef.current) return;

      const chess = gameRef.current;
      chess.reset();

      const moves = moveHistory.slice(0, index + 1);
      moves.forEach((move) => {
        chess.move(move);
      });

      apiRef.current.set({
        fen: chess.fen(),
        movable: {
          dests: getDests(chess),
        },
      });
      setCurrentMoveIndex(index);
      onPositionChange?.(chess.fen(), moves);
    };

    const handleFirst = () => navigateToMove(-1);
    const handlePrevious = () => navigateToMove(currentMoveIndex - 1);
    const handleNext = () => navigateToMove(currentMoveIndex + 1);
    const handleLast = () => navigateToMove(moveHistory.length - 1);

    return (
      <div className={cn("flex flex-col space-y-4", className)} {...divProps}>
        <div
          ref={boardRef}
          data-chessboard
          className="relative"
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
          }}
        />
        {showMoveHistory && (
          <MoveHistory
            moves={moveHistory}
            onMoveClick={navigateToMove}
            currentMoveIndex={currentMoveIndex}
            annotations={pgnMetadata.annotations}
            comments={pgnMetadata.comments}
            variations={pgnMetadata.variations}
            clockTimes={pgnMetadata.clockTimes}
            evaluations={pgnMetadata.evaluations}
            ravs={pgnMetadata.ravs}
            headers={pgnMetadata.headers}
          />
        )}
        {showNavigation && (
          <Navigation
            onFirst={handleFirst}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onLast={handleLast}
            canGoBackward={currentMoveIndex > -1}
            canGoForward={currentMoveIndex < moveHistory.length - 1}
          />
        )}
      </div>
    );
  }
);

function getDests(chess: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  chess.moves({ verbose: true }).forEach((move) => {
    const from = move.from as Key;
    const to = move.to as Key;
    if (!dests.has(from)) dests.set(from, []);
    dests.get(from)?.push(to);
  });
  return dests;
}

Chessboard.displayName = "Chessboard";
