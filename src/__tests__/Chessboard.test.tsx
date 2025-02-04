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

jest.mock("@/lib/utils", () => ({
  cn: (...inputs: any) => inputs.filter(Boolean).join(" "),
}));

describe("Chessboard", () => {
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

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(ref.current).toBeTruthy();
    expect(ref.current?.game).toBeTruthy();
  });

  it("applies custom className correctly", () => {
    const customClass = "custom-board";
    const { container } = render(<Chessboard className={customClass} />);
    const boardContainer = container.firstChild as HTMLElement;
    expect(boardContainer.className).toContain(customClass);
  });
});
