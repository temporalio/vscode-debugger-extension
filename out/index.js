"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("temporal-debugger-plugin.start", () => {
        const panel = vscode.window.createWebviewPanel("temporal-debugger-plugin", "Temporal VSCode Debugger plugin", vscode.ViewColumn.One, {});
        // And set its HTML content
        panel.webview.html = getWebViewContent();
    }));
    // console.log('Congratulations, your extension "helloworld-sample" is now active!');
    // const disposable = vscode.commands.registerCommand('temporal-debugger-plugin.start', () => {
    // 	// The code you place here will be executed every time your command is executed
    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('Hello World!');
    //   context.subscriptions.push(disposable);
    // });
}
exports.activate = activate;
function deactive() { }
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
    </form>`;
}
