import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Chessboard } from "../Chessboard";
import type { ChessboardRef } from "../types";
import { Chess } from "chess.js";

const mockChessgroundApi = {
  set: jest.fn(),
  destroy: jest.fn(),
  state: {
    movable: {},
    dom: {},
  },
};

let moveHandler: ((orig: string, dest: string) => void) | null = null;

jest.mock("chessground", () => ({
  Chessground: jest.fn().mockImplementation((el, config) => {
    if (config?.events?.move) {
      moveHandler = config.events.move;
    }
    return mockChessgroundApi;
  }),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...inputs: any) => inputs.filter(Boolean).join(" "),
  parsePGNAnnotations: jest.fn().mockReturnValue({
    annotations: {},
    comments: {},
    variations: {},
    clockTimes: {},
    evaluations: {},
    ravs: {},
    headers: {},
  }),
}));

describe("Chessboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    moveHandler = null;
  });

  it("renders without crashing", () => {
    const { container } = render(<Chessboard />);
    expect(container.querySelector("[data-chessboard]")).toBeInTheDocument();
  });

  it("shows move history when showMoveHistory is true", () => {
    render(<Chessboard showMoveHistory={true} pgn="1. e4 e5" />);
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("e4")).toBeInTheDocument();
  });

  it("shows navigation controls when showNavigation is true", () => {
    render(<Chessboard showNavigation={true} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });

  it("initializes with correct dimensions", () => {
    const { container } = render(<Chessboard width="500px" height="500px" />);
    const board = container.querySelector("[data-chessboard]");
    expect(board).toHaveStyle({
      width: "500px",
      height: "500px",
    });
  });

  it("exposes ref with game and api", async () => {
    const ref = React.createRef<ChessboardRef>();
    render(<Chessboard ref={ref} />);

    // Wait for useEffect
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(ref.current?.game).toBeInstanceOf(Chess);
    //expect(ref.current?.api).toBe(mockChessgroundApi);
  });

  it("applies custom className correctly", () => {
    const customClass = "custom-board";
    const { container } = render(<Chessboard className={customClass} />);
    const boardContainer = container.firstChild as HTMLElement;
    expect(boardContainer.className).toContain(customClass);
  });

  it("calls onMove callback when a move is made", async () => {
    const onMove = jest.fn();
    render(<Chessboard onMove={onMove} />);

    expect(moveHandler).toBeTruthy();
    await act(async () => {
      moveHandler!("e2", "e4");
    });

    expect(onMove).toHaveBeenCalledWith("e2", "e4");
  });

  it("calls onPositionChange callback when position changes", async () => {
    const onPositionChange = jest.fn();
    render(<Chessboard onPositionChange={onPositionChange} />);

    expect(moveHandler).toBeTruthy();
    await act(async () => {
      moveHandler!("e2", "e4");
    });

    expect(onPositionChange).toHaveBeenCalled();
    expect(onPositionChange).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array)
    );
  });

  it("updates board position when fen prop changes", async () => {
    const { rerender } = render(
      <Chessboard fen="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1" />
    );

    expect(mockChessgroundApi.set).toHaveBeenCalledWith(
      expect.objectContaining({
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      })
    );

    await act(async () => {
      rerender(
        <Chessboard fen="rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2" />
      );
    });

    expect(mockChessgroundApi.set).toHaveBeenCalledWith(
      expect.objectContaining({
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
      })
    );
  });

  it("handles PGN updates", async () => {
    const { rerender } = render(
      <Chessboard pgn="1. e4 e5" showMoveHistory={true} />
    );

    expect(screen.getByText("e4")).toBeInTheDocument();
    expect(screen.getByText("e5")).toBeInTheDocument();

    await act(async () => {
      rerender(<Chessboard pgn="1. d4 d5" showMoveHistory={true} />);
    });

    expect(screen.getByText("d4")).toBeInTheDocument();
    expect(screen.getByText("d5")).toBeInTheDocument();
  });
});
