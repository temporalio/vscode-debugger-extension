import * as vscode from "vscode"

import { getNonce } from "./getNonce"

export class HistoryPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: HistoryPanel | undefined

  public static readonly viewType = "temporal-debugger-plugin"

  private readonly _panel: vscode.WebviewPanel
  private readonly _extensionUri: vscode.Uri
  private _disposables: vscode.Disposable[] = []

  public static async createOrShow(extensionUri: vscode.Uri): Promise<void> {
    const column = vscode.window.activeTextEditor?.viewColumn

    // If we already have a panel, show it.
    if (HistoryPanel.currentPanel) {
      HistoryPanel.currentPanel._panel.reveal(column)
      HistoryPanel.currentPanel._update()
      return
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(HistoryPanel.viewType, "VSinder", column || vscode.ViewColumn.One, {
      // Enable javascript in the webview
      enableScripts: true,

      // And restrict the webview to only loading content from our extension's `media` directory.
      localResourceRoots: [
        vscode.Uri.joinPath(extensionUri, "media"),
        vscode.Uri.joinPath(extensionUri, "out/compiled"),
      ],
    })

    HistoryPanel.currentPanel = new HistoryPanel(panel, extensionUri)
  }

  public static async kill(): Promise<void> {
    await HistoryPanel.currentPanel?.dispose()
    HistoryPanel.currentPanel = undefined
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri): void {
    HistoryPanel.currentPanel = new HistoryPanel(panel, extensionUri)
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
  }

  public async dispose(): Promise<void> {
    HistoryPanel.currentPanel = undefined

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
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled", "history_panel.js"),
    )

    const nonce = getNonce()

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
          const vscode = acquireVsCodeApi();
        </script>
    	</body>
    	<script src="${scriptUri}" nonce="${nonce}">	</script>
    	</html>`
  }
}
