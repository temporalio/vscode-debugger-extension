import * as vscode from "vscode"
import { getWebViewContent as gethtml } from "./extension_HTML"

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", () => {
      const panel = vscode.window.createWebviewPanel(
        "temporal-debugger-plugin",
        "Temporal VSCode Debugger plugin",
        vscode.ViewColumn.Beside,
        {},
      )
      // And set its HTML content
      panel.webview.html = gethtml()
    }),
  )
}
