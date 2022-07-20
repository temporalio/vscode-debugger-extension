import * as vscode from "vscode"
import { StartExtension } from "./startExtension"

/*
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed*/
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  console.log('Congratulations, your extension "temporal-debugger-plugin" is now active!')

  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", async () => {
      await StartExtension.createOrShow(context.extensionUri)
    }),
  )
  //refresing
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.refresh", async () => {
      await StartExtension.kill()
      await StartExtension.createOrShow(context.extensionUri)
      setTimeout(async () => {
        await vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools")
      }, 500)
    }),
  )
}
