import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", () => {
      const panel = vscode.window.createWebviewPanel(
        "temporal-debugger-plugin",
        "Temporal VSCode Debugger plugin",
        vscode.ViewColumn.Beside,
        {},
      )
      const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, "src", "./main_panel.html"))
      panel.webview.html = fs.readFileSync(filePath.fsPath, "utf8")
    }),
  )
}
