module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^lucide-react$": "<rootDir>/src/__mocks__/lucide-react.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(chessground|chess.js|lucide-react)/)",
  ],
};
