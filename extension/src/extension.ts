import * as vscode from "vscode"
import { registerDebugAdapterTrackerFactory } from "./node-debug-tracker"
import { HistoryDebuggerPanel } from "./panel"
import { Server } from "./server"

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const debugAdapterTrackerFactory: vscode.Disposable = registerDebugAdapterTrackerFactory()
  const openCommand: vscode.Disposable = vscode.commands.registerCommand(
    "temporal.debugger-extension.open-panel",
    async () => {
      const server = await Server.create()
      console.log(`Server listening on ${server.url}`)
      HistoryDebuggerPanel.install(context.extensionUri, context.secrets, server).show()
    },
  )
  context.subscriptions.push(openCommand, debugAdapterTrackerFactory)
}
