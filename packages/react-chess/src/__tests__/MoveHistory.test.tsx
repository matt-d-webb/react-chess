import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MoveHistory } from "../components/MoveHistory";
import type { Move } from "chess.js";

jest.mock("@/lib/utils", () => ({
  cn: (...inputs: any) => inputs.filter(Boolean).join(" "),
}));

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
    expect(moveElement.className).toContain("bg-gray-200");
  });

  it("applies custom className", () => {
    const customClass = "test-class";
    const { container } = render(
      <MoveHistory
        moves={mockMoves as Move[]}
        currentMoveIndex={-1}
        className={customClass}
      />
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement.className).toContain(customClass);
  });

  it("adds pointer cursor when onMoveClick is provided", () => {
    const onMoveClick = jest.fn();
    const { getByText } = render(
      <MoveHistory
        moves={mockMoves as Move[]}
        onMoveClick={onMoveClick}
        currentMoveIndex={-1}
      />
    );

    const moveElement = getByText("e4");
    expect(moveElement.className).toContain("cursor-pointer");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<MoveHistory moves={mockMoves as Move[]} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
