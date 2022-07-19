import * as vscode from "vscode"
import { StartExtension } from "./startExtension"

// export function activate(context: vscode.ExtensionContext): void {
//   context.subscriptions.push(
//     vscode.commands.registerCommand("temporal-debugger-plugin.start", () => {
//       const panel = vscode.window.createWebviewPanel(
//         "temporal-debugger-plugin",
//         "Temporal VSCode Debugger plugin",
//         vscode.ViewColumn.Beside,
//         {
//           enableScripts: true,
//           // Only allow the webview to access resources in our extension's media directory
//           localResourceRoots: [

//             vscode.Uri.file(path.join(context.extensionPath, "webviews", "components", "main_panel.svelte")),
//           ],
//         },
//       )
//       const filePath: vscode.Uri = vscode.Uri.file(
//         path.join(context.extensionPath, "webviews", "components", "main_panel.svelte"),
//       )
//       panel.webview.html = fs.readFileSync(filePath.fsPath, "utf8")

//     }),
//   )
// }

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vstodo" is now active!')
  await context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", () => {
      StartExtension.createOrShow(context.extensionUri)
    }),
  )
  //refresing
  await context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.refresh", () => {
      StartExtension.kill()
      StartExtension.createOrShow(context.extensionUri)
      setTimeout(() => {
        vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools")
      }, 500)
    }),
  )
}

// this method is called when your extension is deactivated
// export function deactivate() {}
