export class Chess {
  constructor() {
    this.reset();
  }

  reset() {
    this._position = "start";
    return this;
  }

  load(fen) {
    this._position = fen;
    return this;
  }

  loadPgn(pgn) {
    this._pgn = pgn;
    return this;
  }

  fen() {
    return this._position;
  }

  moves({ verbose = false } = {}) {
    if (verbose) {
      return [
        { from: "e2", to: "e4", san: "e4" },
        { from: "e7", to: "e5", san: "e5" },
      ];
    }
    return ["e4", "e5"];
  }

  history({ verbose = false } = {}) {
    if (this._pgn === "1. e4 e5") {
      return verbose
        ? [
            { from: "e2", to: "e4", san: "e4" },
            { from: "e7", to: "e5", san: "e5" },
          ]
        : ["e4", "e5"];
    }
    if (this._pgn === "1. d4 d5") {
      return verbose
        ? [
            { from: "d2", to: "d4", san: "d4" },
            { from: "d7", to: "d5", san: "d5" },
          ]
        : ["d4", "d5"];
    }
    return [];
  }

  move(move) {
    return { from: move.from, to: move.to, san: "e4" };
  }
}
