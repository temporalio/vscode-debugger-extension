import * as vscode from "vscode"

export function getWorkspacePath(): string | undefined {
  const [workspaceFolder] = vscode.workspace.workspaceFolders || []

  if (!workspaceFolder) {
    return undefined
  }

  return workspaceFolder.uri.fsPath
}
