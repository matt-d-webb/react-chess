import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";
import { createRequire } from "module";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");
const __dirname = dirname(fileURLToPath(import.meta.url));

function concatChessgroundCSS() {
  return {
    name: "concat-chessground-css",
    writeBundle() {
      const cssPath = join(__dirname, "dist/assets/index.css");
      const cgBase = readFileSync(
        join(__dirname, "node_modules/chessground/assets/chessground.base.css"),
        "utf8"
      );
      const cgBrown = readFileSync(
        join(__dirname, "node_modules/chessground/assets/chessground.brown.css"),
        "utf8"
      );
      const cgPieces = readFileSync(
        join(__dirname, "node_modules/chessground/assets/chessground.cburnett.css"),
        "utf8"
      );

      let existing = "";
      try {
        existing = readFileSync(cssPath, "utf8");
      } catch {
        mkdirSync(join(__dirname, "dist/assets"), { recursive: true });
      }

      const combined = `/* Chessground base */\n${cgBase}\n/* Chessground brown theme */\n${cgBrown}\n/* Chessground cburnett pieces */\n${cgPieces}\n/* React Chess component styles */\n${existing}`;
      writeFileSync(cssPath, combined);
    },
  };
}

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  external: (id) => {
    // Externalize all peer deps, deps, and their subpaths
    const externalPkgs = [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "chess.js",
      "chessground",
      "lucide-react",
      "clsx",
    ];
    return externalPkgs.some((pkg) => id === pkg || id.startsWith(pkg + "/"));
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: "assets/index.css",
      minimize: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist",
      exclude: ["**/*.test.tsx", "**/*.test.ts"],
    }),
    concatChessgroundCSS(),
  ],
};
