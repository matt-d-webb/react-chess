export const Chessground = jest.fn().mockImplementation(() => ({
  set: jest.fn(),
  state: {
    dom: {
      elements: {
        board: document.createElement("div"),
      },
    },
  },
  destroy: jest.fn(),
}));
