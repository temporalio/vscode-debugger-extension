import type * as vscode from "vscode"
import { supportsESM } from "./is-esm"

const configuration = {
  name: "Launch Program",
  type: "node",
  request: "launch",
  runtimeExecutable: "node",
  skipFiles: [
    "<node_internals>/**",
    "**/node_modules/@temporalio/worker/src/**",
    "**/node_modules/@temporalio/worker/lib/**",
    "**/node_modules/@temporalio/common/src/**",
    "**/node_modules/@temporalio/common/lib/**",
    "**/node_modules/**/source-map/**",
  ],
  internalConsoleOptions: "openOnSessionStart",
  pauseForSourceMap: true,
} satisfies vscode.DebugConfiguration

export const getBaseConfiguration = async (): Promise<vscode.DebugConfiguration> => {
  const runtimeArgs = (await supportsESM())
    ? ["--loader=ts-node/esm"]
    : ["--nolazy", "-r", "ts-node/register/transpile-only"]

  return { ...configuration, runtimeArgs }
}
