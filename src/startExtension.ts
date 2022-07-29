import * as vscode from "vscode"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import http from "node:http"
import { historyFromJSON } from "@temporalio/common/lib/proto-utils"

export class HistoryDebuggerExtension {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: HistoryDebuggerExtension | undefined

  public static readonly viewType = "temporal-debugger-plugin"

  private readonly _panel: vscode.WebviewPanel
  private readonly _extensionUri: vscode.Uri
  private _disposables: vscode.Disposable[] = []

  public static async createOrShow(extensionUri: vscode.Uri): Promise<void> {
    const column = vscode.window.activeTextEditor?.viewColumn

    // If we already have a panel, show it.
    if (HistoryDebuggerExtension.currentPanel) {
      HistoryDebuggerExtension.currentPanel._panel.reveal(column)
      HistoryDebuggerExtension.currentPanel._update()
      return
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      HistoryDebuggerExtension.viewType,
      "VSinder",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      },
    )

    HistoryDebuggerExtension.currentPanel = new HistoryDebuggerExtension(panel, extensionUri)
  }

  public static async kill(): Promise<void> {
    await HistoryDebuggerExtension.currentPanel?.dispose()
    HistoryDebuggerExtension.currentPanel = undefined
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri): void {
    HistoryDebuggerExtension.currentPanel = new HistoryDebuggerExtension(panel, extensionUri)
  }

  //@typescript-eslint/no-floating-promises
  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel
    this._extensionUri = extensionUri

    // Set the webview's initial html content
    this._update()

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    // TODO: this should only be used for plugin development
    const server = http.createServer((_req, res) => {
      // vscode.commands.executeCommand("Developer: Reload webviews")
      vscode.commands.executeCommand("workbench.action.webview.reloadWebviewAction").then(
        () => {
          // TODO: remove this section after history development is done, it doesn't belong in the app
          const history = historyFromJSON(
            JSON.parse(
              fs.readFileSync(
                path.resolve(__dirname, "../samples/0d693592-0d25-4be9-b8c6-de6a210da5cc_events.json"),
                "utf8",
              ),
            ),
          )
          void this._panel.webview.postMessage({ type: "historyProcessed", history })
        },
        () => {
          // ignore
        },
      )
      res.writeHead(200, "OK")
      res.end()
    })
    server.listen(55666, "127.0.0.1")
    console.log("blaaaaa")
  }

  public async dispose(): Promise<void> {
    HistoryDebuggerExtension.currentPanel = undefined

    // Clean up our resources
    this._panel.dispose()

    while (this._disposables.length) {
      const x = this._disposables.pop()
      if (x) {
        await x.dispose()
      }
    }
  }

  private _update(): void {
    const webview = this._panel.webview

    this._panel.webview.html = this._getHtmlForWebview(webview)

    //onsubmit postMessage

    webview.onDidReceiveMessage(async (e): Promise<void> => {
      console.log(e)
      switch (e.type) {
        case "processHistory": {
          const history = historyFromJSON(JSON.parse(Buffer.from(e.buffer).toString()))
          await webview.postMessage({ type: "historyProcessed", history })
          await vscode.window.showInformationMessage("History sent back")
        }
      }
    })
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled", "app.js"))

    const nonce = crypto.randomUUID()

    return `<!DOCTYPE html>
    	<html lang="en">
    	<head>
    		<meta charset="UTF-8">
    		<!--
    			Use a content security policy to only allow loading images from https or from our extension directory,
    			and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
    		<meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="" rel="stylesheet">
                <link href="" rel="stylesheet">
        
    	</head>
      <body>
      <script nonce="${nonce}">
      <!-- rendering commend to main panel as globle varable -->
          const vscode = acquireVsCodeApi();
        </script>
    	</body>
    	<script src="${scriptUri}" nonce="${nonce}">	</script>
    	</html>`
  }
}
