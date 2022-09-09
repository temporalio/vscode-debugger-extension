export declare global {
  // Placeholder for the webview VSCode API, types not verified
  // NOTE: `vscode` is set on the global object as part of the page setup in the main HTML file
  const vscode: {
    postMessage(message: unknown): void
  }
}
