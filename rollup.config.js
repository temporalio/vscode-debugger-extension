import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"
import path from "path"

const production = !process.env.ROLLUP_WATCH

export default {
  input: path.join(__dirname, "webviews/pages/app.ts"),
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "out/compiled/app.js",
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,

      css: (css) => {
        css.write("app.css")
      },
      preprocess: sveltePreprocess(),
    }),

    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      tsconfig: "webviews/tsconfig.json",
    }),
    json(),
  ],
  watch: {
    clearScreen: false,
  },
}
