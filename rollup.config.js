import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import pkg from "./package.json";

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
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      inject: false,
      extract: false,
      modules: false,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist",
      exclude: ["**/*.test.tsx", "**/*.test.ts"],
    }),
    copy({
      targets: [
        {
          src: "src/styles/*",
          dest: "dist/styles",
        },
      ],
    }),
  ],
};
