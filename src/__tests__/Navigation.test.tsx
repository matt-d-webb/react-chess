import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Navigation } from "../components/Navigation";

describe("Navigation", () => {
  const mockProps = {
    onFirst: jest.fn(),
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onLast: jest.fn(),
    canGoForward: true,
    canGoBackward: true,
  };

  it("renders all navigation buttons", () => {
    const { getByText } = render(<Navigation {...mockProps} />);
    expect(getByText("⏮️")).toBeInTheDocument();
    expect(getByText("⏪")).toBeInTheDocument();
    expect(getByText("⏩")).toBeInTheDocument();
    expect(getByText("⏭️")).toBeInTheDocument();
  });

  it("disables buttons correctly when cannot move", () => {
    const { getByText, rerender } = render(
      <Navigation {...mockProps} canGoForward={false} canGoBackward={false} />
    );

    const firstButton = getByText("⏮️");
    expect(firstButton).toBeDisabled();
    expect(getByText("⏪")).toBeDisabled();
    expect(getByText("⏩")).toBeDisabled();
    expect(getByText("⏭️")).toBeDisabled();

    // Test re-enabling
    rerender(
      <Navigation {...mockProps} canGoForward={true} canGoBackward={true} />
    );
    expect(firstButton).not.toBeDisabled();
  });

  it("calls appropriate functions when buttons are clicked", () => {
    const { getByText } = render(<Navigation {...mockProps} />);

    fireEvent.click(getByText("⏮️"));
    expect(mockProps.onFirst).toHaveBeenCalled();

    fireEvent.click(getByText("⏪"));
    expect(mockProps.onPrevious).toHaveBeenCalled();

    fireEvent.click(getByText("⏩"));
    expect(mockProps.onNext).toHaveBeenCalled();

    fireEvent.click(getByText("⏭️"));
    expect(mockProps.onLast).toHaveBeenCalled();
  });
});
