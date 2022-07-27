import * as vscode from "vscode"
import { StartExtension } from "./startExtension"

//extension is activated

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", async () => {
      await StartExtension.createOrShow(context.extensionUri)
    }),
  )
}
