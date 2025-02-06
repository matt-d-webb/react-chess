import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type PGNMetadata } from "./../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
}
