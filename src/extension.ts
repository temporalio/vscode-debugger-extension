import * as vscode from "vscode"
import { StartExtension } from "./startExtension"

/*
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", async () => {
      await StartExtension.createOrShow(context.extensionUri)
    }),
  )
}
