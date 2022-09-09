import vscode from "vscode"

function ignoreErrors(t: Thenable<any>) {
  t.then(
    () => {
      // ignore
    },
    () => {
      // ignore
    },
  )
}

export function registerDebugAdapterTrackerFactory(): vscode.Disposable {
  // TODO: register for other types too?
  return vscode.debug.registerDebugAdapterTrackerFactory("pwa-node", {
    createDebugAdapterTracker(_session) {
      let paused = false

      return {
        onDidSendMessage(m) {
          if (m.type === "event" && m.event === "stopped") {
            paused = true
          } else if (m.type === "event" && m.event === "continued") {
            paused = false
          } else if (paused && m.type === "response" && m.command === "stackTrace" && m.success) {
            // Empty out the returned stack trace for unwanted sources so they're not displayed in the UI.
            // Trigger stepping into / out of irrelevant sources.
            const { stackFrames } = m.body
            const frame = stackFrames[0]
            if (frame?.source?.path.includes("packages/workflow/src/")) {
              m.body.stackFrames = []
              if (stackFrames.length === 1) {
                ignoreErrors(vscode.commands.executeCommand("workbench.action.debug.stepInto"))
              }
            } else if (frame?.source?.path.startsWith("<eval>/")) {
              m.body.stackFrames = []
              if (stackFrames.length === 1) {
                ignoreErrors(vscode.commands.executeCommand("workbench.action.debug.stepOut"))
              }
            }
          }
        },
      }
    },
  })
}
