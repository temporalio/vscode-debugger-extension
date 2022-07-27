import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"
import path from "path"
import fs from "fs"

const production = !process.env.ROLLUP_WATCH

export default fs.readdirSync(path.join(__dirname, "webviews", "pages")).map((input) => {
  const name = input.split(".")[0]
  return {
    input: "webviews/pages/" + input,
    output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "out/compiled/" + name + ".js",
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,

        css: (css) => {
          css.write(name + ".css")
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
})
