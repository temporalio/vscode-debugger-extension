import * as vscode from "vscode"

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("temporal-debugger-plugin.start", () => {
      const panel = vscode.window.createWebviewPanel(
        "temporal-debugger-plugin",
        "Temporal VSCode Debugger plugin",
        vscode.ViewColumn.One,
        {},
      )
      // And set its HTML content
      panel.webview.html = getWebViewContent()
    }),
  )

}

function deactive(){}

//HTML content of the webview
function getWebViewContent() {
  return `<p>
    Debug by ID
    </p>
    <form>
    <input type=text required placeholder="Workflow ID *"/>
    <input type=text placeholder="Run ID"/>
    <input type=button value="Start" />
    </form>
    <hr>
    <p>
    Debug from history file
    </p>
    <form>
    <input type=file required  />
    <input type=button value="Start" />
    </form>
    <hr>
    <p>
    Configure server credentials (for downloading histories)
    </p>
    <form>
    <label>Address</label>
    <input type=text default="127.0.0.1:7233" />
    <label>TLS?</label>
    <input type=checkbox />
    <div/>
    <label>Client cert</label>
    <input type=file />
    <div/>
    <label>Client private key</label>
    <input type=file />
    </form>`
}
