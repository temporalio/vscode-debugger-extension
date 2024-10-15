import type * as vscode from "vscode"
import { supportsESM } from "./is-esm"

const typeScriptConfiguration = {
  name: "Temporal Debug (TypeScript)",
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

const pythonConfiguration = {
  name: "Temporal Debug (Python)",
  type: "debugpy",
  request: "launch",
} satisfies vscode.DebugConfiguration

async function nodeRuntimeArgs(): Promise<string[]> {
  return (await supportsESM()) ? ["--loader=ts-node/esm"] : ["--nolazy", "-r", "ts-node/register/transpile-only"]
}

export const getBaseConfiguration = async (lang: string, entrypoint: string): Promise<vscode.DebugConfiguration> => {
  let runtimeArgs: string[]
  let configuration: vscode.DebugConfiguration

  if (lang === "typescript") {
    runtimeArgs = await nodeRuntimeArgs()
    configuration = { ...typeScriptConfiguration, args: [entrypoint] }
  } else if (lang === "python") {
    runtimeArgs = []
    configuration = { ...pythonConfiguration, program: entrypoint }
  } else {
    throw new Error("Unsupported language")
  }

  return { ...configuration, runtimeArgs }
}
