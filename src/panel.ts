import * as vscode from "vscode"
import fs from "node:fs"
import path from "node:path"
import http from "node:http"
import { historyFromJSON } from "@temporalio/common/lib/proto-utils"
import { temporal } from "@temporalio/proto"

export class HistoryDebuggerPanel {
  protected static _instance?: HistoryDebuggerPanel

  static install(extensionUri: vscode.Uri, httpServerUrl: string): HistoryDebuggerPanel {
    if (this._instance === undefined) {
      this._instance = new this(extensionUri, httpServerUrl)
    }
    return this._instance
  }

  static get instance(): HistoryDebuggerPanel {
    if (this._instance === undefined) {
      throw new ReferenceError("HistoryDebuggerPanel not installed")
    }
    return this._instance
  }

  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public currentHistoryBuffer?: Buffer

  public static readonly viewType = "temporal-debugger-plugin"

  private readonly panel: vscode.WebviewPanel
  private disposables: vscode.Disposable[] = []

  show(): void {
    const column = vscode.window.activeTextEditor?.viewColumn
    this.panel.reveal(column)
    this.update()
  }

  //@typescript-eslint/no-floating-promises
  private constructor(protected readonly extensionUri: vscode.Uri, protected readonly httpServerUrl: string) {
    const column = vscode.window.activeTextEditor?.viewColumn

    this.panel = vscode.window.createWebviewPanel(
      HistoryDebuggerPanel.viewType,
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

    // Set the webview's initial html content
    this.update()

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables)

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
          const bytes = new Uint8Array(temporal.api.history.v1.History.encodeDelimited(history).finish())
          void this.panel.webview.postMessage({ type: "historyProcessed", history: bytes })
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
    // Clean up our resources
    this.panel.dispose()

    while (this.disposables.length) {
      const x = this.disposables.pop()
      if (x) {
        await x.dispose()
      }
    }

    delete HistoryDebuggerPanel._instance
  }

  private update(): void {
    const webview = this.panel.webview

    this.panel.webview.html = this.getHtmlForWebview(webview)

    //onsubmit postMessage

    webview.onDidReceiveMessage(async (e): Promise<void> => {
      console.log(e)
      switch (e.type) {
        case "processHistory": {
          const buffer = Buffer.from(e.buffer)
          const history = historyFromJSON(JSON.parse(buffer.toString()))
          const bytes = new Uint8Array(temporal.api.history.v1.History.encodeDelimited(history).finish())
          this.currentHistoryBuffer = buffer
          await webview.postMessage({ type: "historyProcessed", history: bytes })
          const config = { env: { TEMPORAL_DEBUGGER_PLUGIN_URL: this.httpServerUrl } }
          await vscode.window.showInformationMessage("History sent back")
        }
      }
    })
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "out", "compiled", "app.js"))

    return `<!DOCTYPE html>
    	<html lang="en">
    	<head>
    		<meta charset="UTF-8">
    		<!--
    			Use a content security policy to only allow loading images from https or from our extension directory,
    			and only allow scripts that have a specific nonce.
        -->
    		<meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="" rel="stylesheet">
                <link href="" rel="stylesheet">
        
    	</head>
      <body>
      <script>
        const vscode = acquireVsCodeApi();
      </script>
    	</body>
    	<script src="${scriptUri}"></script>
    	</html>`
  }
}
