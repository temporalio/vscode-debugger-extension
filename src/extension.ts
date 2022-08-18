import * as vscode from "vscode"
import { HistoryDebuggerPanel } from "./panel"
import { Server } from "./server"

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  let server: Server | undefined = undefined
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.open-panel", async () => {
      if (!server) {
        server = await Server.create()
        console.log(`Server listening on ${server.url}`)
      }
      HistoryDebuggerPanel.install(context.extensionUri, context.secrets, server.url).show()
    }),
  )
}
