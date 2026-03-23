import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Navigation } from "../components/Navigation";

jest.mock("@/lib/utils", () => ({
  cn: (...inputs: any) => inputs.filter(Boolean).join(" "),
}));

describe("Navigation", () => {
  const mockProps = {
    onFirst: jest.fn(),
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onLast: jest.fn(),
    canGoForward: true,
    canGoBackward: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all navigation buttons", () => {
    const { getByRole, getAllByRole } = render(<Navigation {...mockProps} />);
    const buttons = getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });

  it("disables buttons correctly when cannot move", () => {
    const { getAllByRole, rerender } = render(
      <Navigation {...mockProps} canGoForward={false} canGoBackward={false} />
    );

    const buttons = getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
      expect(button.className).toContain("disabled:opacity-50");
      expect(button.className).toContain("disabled:cursor-not-allowed");
    });

    // Test re-enabling
    rerender(
      <Navigation {...mockProps} canGoForward={true} canGoBackward={true} />
    );
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it("calls appropriate functions when buttons are clicked", () => {
    const { getAllByRole } = render(<Navigation {...mockProps} />);
    const [firstButton, prevButton, nextButton, lastButton] =
      getAllByRole("button");

    fireEvent.click(firstButton);
    expect(mockProps.onFirst).toHaveBeenCalledTimes(1);

    fireEvent.click(prevButton);
    expect(mockProps.onPrevious).toHaveBeenCalledTimes(1);

    fireEvent.click(nextButton);
    expect(mockProps.onNext).toHaveBeenCalledTimes(1);

    fireEvent.click(lastButton);
    expect(mockProps.onLast).toHaveBeenCalledTimes(1);
  });

  it("does not call handlers when buttons are disabled", () => {
    const { getAllByRole } = render(
      <Navigation {...mockProps} canGoForward={false} canGoBackward={false} />
    );

    const buttons = getAllByRole("button");
    buttons.forEach((button) => {
      fireEvent.click(button);
    });

    expect(mockProps.onFirst).not.toHaveBeenCalled();
    expect(mockProps.onPrevious).not.toHaveBeenCalled();
    expect(mockProps.onNext).not.toHaveBeenCalled();
    expect(mockProps.onLast).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const customClass = "test-class";
    const { container } = render(
      <Navigation {...mockProps} className={customClass} />
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement.className).toContain(customClass);
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Navigation {...mockProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies hover and focus styles to buttons", () => {
    const { getAllByRole } = render(<Navigation {...mockProps} />);
    const button = getAllByRole("button")[0];

    expect(button.className).toContain("hover:bg-gray-100");
    expect(button.className).toContain("focus:ring-2");
  });
});
