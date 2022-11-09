import * as vscode from "vscode"
import { registerDebugAdapterTrackerFactory } from "./node-debug-tracker"
import { HistoryDebuggerPanel } from "./panel"
import { Server } from "./server"

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal.debugger-extension.open-panel", async () => {
      const server = await Server.create()
      console.log(`Server listening on ${server.url}`)
      // TODO: dispose everything created here?
      HistoryDebuggerPanel.install(context.extensionUri, context.secrets, server).show()
    }),
    registerDebugAdapterTrackerFactory(),
  )
}
