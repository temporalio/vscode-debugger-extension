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
        {enableScripts: true},
      )
      const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, "src", "./html/main_panel.html"))
      panel.webview.html = fs.readFileSync(filePath.fsPath, "utf8")

       // Handle messages from the webview
      // panel.webview.onDidReceiveMessage(
      //   message => {
      //     switch (message.command) {
      //       case 'alert':
      //         vscode.window.showErrorMessage(message.text);
      //         return;
      //     }
      //   },
      //   undefined,
      //   context.subscriptions
      // );
    }),
  )
}


// export function startDebug() {
//   const element = document.getElementById(".start");
//   element?.addEventListener("click", listenerFunction);
// }

// function listenerFunction() {
//   console.log("start")
//   location.href = "www.youtube.com"
// }