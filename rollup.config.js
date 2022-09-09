import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import css from "rollup-plugin-css-only"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"
import path from "path"

export default {
  input: path.join(__dirname, "webview/src/pages/app.ts"),
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "webview/dist/app.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    css({ output: "app.css" }),
    commonjs(),
    typescript({
      tsconfig: "webview/tsconfig.json",
    }),
    json(),
  ],
  watch: {
    clearScreen: false,
  },
}
