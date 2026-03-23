import { clsx, type ClassValue } from "clsx";
import type { PGNMetadata } from "../types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function parsePGNAnnotations(pgn: string): PGNMetadata {
  const metadata: PGNMetadata = {
    annotations: {},
    comments: {},
    variations: {},
    clockTimes: {},
    evaluations: {},
    ravs: {},
    headers: {},
  };

  const headerPattern = /\[(\w+)\s+"([^"]+)"\]/g;
  let headerMatch;
  while ((headerMatch = headerPattern.exec(pgn)) !== null) {
    const [_, key, value] = headerMatch;
    metadata.headers[key as keyof PGNMetadata["headers"]] = value;
  }

  const movetext = pgn.replace(/\[.*?\]\s*/g, "").trim();

  let moveIndex = -1;
  let inComment = false;
  let inVariation = false;
  let variationDepth = 0;
  let currentComment = "";
  let currentVariation = "";

  for (let i = 0; i < movetext.length; i++) {
    const char = movetext[i];

    if (char === "{") {
      inComment = true;
      currentComment = "";
      continue;
    }

    if (char === "}") {
      inComment = false;
      if (currentComment.trim()) {
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

    if (char === "$") {
      let nag = "$";
      while (i + 1 < movetext.length && /\d/.test(movetext[i + 1])) {
        nag += movetext[++i];
      }
      metadata.annotations[moveIndex] = nag;
      continue;
    }

    const evalSymbols = ["+-", "-+", "±", "∓", "⩲", "⩱", "=", "∞", "⊕"];
    for (const symbol of evalSymbols) {
      if (movetext.slice(i).startsWith(symbol)) {
        metadata.evaluations[moveIndex] = symbol;
        i += symbol.length - 1;
        break;
      }
    }

    const movePattern =
      /^([RNBQKP]?[a-h]?[1-8]?x?[a-h][1-8](?:=[RNBQ])?[+#]?)\s/;
    const nextChars = movetext.slice(i);
    const moveMatch = nextChars.match(movePattern);

    if (moveMatch) {
      moveIndex++;
      i += moveMatch[1].length - 1;
    }
  }

  return metadata;
}

export function getDests(chess: import("chess.js").Chess): Map<string, string[]> {
  const dests = new Map<string, string[]>();
  chess.moves({ verbose: true }).forEach((move) => {
    const from = move.from;
    const to = move.to;
    if (!dests.has(from)) dests.set(from, []);
    dests.get(from)?.push(to);
  });
  return dests;
}

export function isPromotionMove(
  chess: import("chess.js").Chess,
  from: string,
  to: string
): boolean {
  const moves = chess.moves({ verbose: true });
  return moves.some(
    (m) => m.from === from && m.to === to && m.promotion !== undefined
  );
}

export function toPx(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}
