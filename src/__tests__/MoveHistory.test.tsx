import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MoveHistory } from "../components/MoveHistory";
import { Move } from "chess.js";

describe("MoveHistory", () => {
  const mockMoves: Partial<Move>[] = [
    { san: "e4", color: "w" },
    { san: "e5", color: "b" },
    { san: "Nf3", color: "w" },
    { san: "Nc6", color: "b" },
  ];

  it("renders moves with correct numbering", () => {
    const { getByText } = render(
      <MoveHistory moves={mockMoves as Move[]} currentMoveIndex={-1} />
    );

    expect(getByText("1.")).toBeInTheDocument();
    expect(getByText("e4")).toBeInTheDocument();
    expect(getByText("e5")).toBeInTheDocument();
    expect(getByText("2.")).toBeInTheDocument();
    expect(getByText("Nf3")).toBeInTheDocument();
    expect(getByText("Nc6")).toBeInTheDocument();
  });

  it("handles move clicks", () => {
    const onMoveClick = jest.fn();
    const { getByText } = render(
      <MoveHistory
        moves={mockMoves as Move[]}
        onMoveClick={onMoveClick}
        currentMoveIndex={-1}
      />
    );

    fireEvent.click(getByText("e4"));
    expect(onMoveClick).toHaveBeenCalledWith(0);

    fireEvent.click(getByText("Nc6"));
    expect(onMoveClick).toHaveBeenCalledWith(3);
  });

  it("highlights current move", () => {
    const { getByText } = render(
      <MoveHistory moves={mockMoves as Move[]} currentMoveIndex={1} />
    );

    const moveElement = getByText("e5");
    expect(moveElement).toHaveStyle({ backgroundColor: "#e2e8f0" });
  });
});
