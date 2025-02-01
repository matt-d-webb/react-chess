import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Chessboard } from "../Chessboard";
import type { ChessboardRef } from "../types";

const mockChessgroundApi = {
  set: jest.fn(),
  destroy: jest.fn(),
  state: {
    movable: {},
    dom: {},
  },
};

jest.mock("chessground", () => ({
  Chessground: jest.fn().mockImplementation(() => mockChessgroundApi),
}));

describe("Chessboard", () => {
  it("renders without crashing", () => {
    const { container } = render(<Chessboard />);
    expect(container.querySelector(".chess-board")).toBeInTheDocument();
  });

  it("shows move history when showMoveHistory is true", () => {
    render(<Chessboard showMoveHistory={true} pgn="1. e4 e5" />);
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("e4")).toBeInTheDocument();
  });

  it("shows navigation controls when showNavigation is true", () => {
    render(<Chessboard showNavigation={true} />);
    expect(screen.getByText("⏮️")).toBeInTheDocument();
    expect(screen.getByText("⏭️")).toBeInTheDocument();
  });

  it("initializes with correct dimensions", () => {
    const { container } = render(<Chessboard width="500px" height="500px" />);

    const board = container.querySelector(".chess-board");
    expect(board).toHaveStyle({
      width: "500px",
      height: "500px",
      position: "relative",
    });
  });

  it("handles PGN updates", () => {
    const { rerender } = render(
      <Chessboard pgn="1. e4 e5" showMoveHistory={true} />
    );

    expect(screen.getByText("e4")).toBeInTheDocument();
    expect(screen.getByText("e5")).toBeInTheDocument();

    rerender(<Chessboard pgn="1. d4 d5" showMoveHistory={true} />);

    expect(screen.getByText("d4")).toBeInTheDocument();
    expect(screen.getByText("d5")).toBeInTheDocument();
  });

  it("exposes ref with game and api", async () => {
    const ref = React.createRef<ChessboardRef>();
    render(<Chessboard ref={ref} />);

    // Wait for the API to be initialized
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(ref.current).toBeTruthy();
    expect(ref.current?.game).toBeTruthy();
  });
});
