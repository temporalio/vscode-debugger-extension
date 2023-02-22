## Temporal VS Code extension

This repo contains the code for the Temporal VS Code extension.

The extension's purpose is to help debug workflows and reduce the amount of boilerplate required to start a workflow replayer.

The extension exposes a single command: "Temporal: Open Panel" that (as the name suggests) opens a WebView panel.
The panel consists of these three views:

1. Main view - Start debugging a workflow by ID or from a history file
2. History view - Visualize the workflow history and highlight the currently processing workflow task
3. Settings view - Configure a connection to a Temporal server for downloading histories

In order to launch the replay, the extension uses a template launch config (see [this one](./configs/node-template.json)
for TypeScript) and will look up a TypeScript or JavaScript file specified in the `temporal.replayerEntrypoint`
workspace setting. The entrypoint specifies how to start the replay worker (e.g. which workflows to run) as shown below
for TypeScript:

```ts
import { startDebugReplayer } from "@temporalio/worker"

startDebugReplayer({
  workflowsPath: require.resolve("./workflows"),
})
```

### Supported languages

Currently only TypeScript is supported but more languages should be relatively easy to add.

## Development

The development flow is pretty standard for a Node.js / VS Code extension. Some useful commands listed below:

- Install dependencies `npm ci`
- Build the extension and WebView: `npm run build`
- Watch filesystem and rebuild on change: `npm run build.watch` (recommended)

### Debugging with Vscode
- To launch the extension, a [launch.json](./.vscode/launch.json) is provided that will run the extension in a new VS
  Code window
- Open a project with `Ctrl-K-O` and create file `./src/debug-replayer.ts` with `startDebugReplayer` describe above
- Use `Ctrl-Shift-P` (or `Cmd-Shift-P` on Mac) to open the panel using the command ("Temporal: Open Panel")
  mentioned above.

One useful thing to note is that for local development, we've set up a local HTTP server and a rollup watch hook that
will reload the WebView after bundling is complete. The HTTP handler is defined in [the panel
code](./extension/src/panel.ts) - look for `TEMPORAL_DEBUGGER_EXTENSION_DEV_MODE` in that file. When working on a
specific view, it may be useful to send events to the webview from the handler to quickly get the app state to that
view. For example to switch to the history view you may use something like:

```ts
await this.panel.webview.postMessage({ type: "historyProcessed", history })
```

The repository is lacking tests, those should be added before releasing to the VS Code marketplace.

The repository uses `eslint` and `prettier` to maintain consistent a style, run validation with `npm run lint` and
auto-format code with `npm run format`.
