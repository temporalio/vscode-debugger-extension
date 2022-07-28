import * as vscode from "vscode"
import { HistoryDebuggerExtension } from "./startExtension"


export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", async () => {
      await HistoryDebuggerExtension.createOrShow(context.extensionUri)
    }),
  )
}
