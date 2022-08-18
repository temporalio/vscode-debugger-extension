import * as vscode from "vscode"
import { HistoryDebuggerPanel } from "./panel"
import { Server } from "./server"

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", async () => {
      const { url } = await Server.create()
      console.log(`Server listening on ${url}`)
      HistoryDebuggerPanel.install(context.extensionUri, context.secrets, url).show()
    }),
  )
}
