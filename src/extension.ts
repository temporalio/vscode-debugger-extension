import * as vscode from "vscode"
import { HistoryDebuggerPanel } from "./panel"
import { Server } from "./server"
export let initSecret: vscode.SecretStorage

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  initSecret = context.secrets
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", async () => {
      const { url } = await Server.create()
      console.log(`Server listening on ${url}`)
      HistoryDebuggerPanel.install(context.extensionUri, url).show()
    }),
  )
}
