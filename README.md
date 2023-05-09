<h1 align="center">
  <br>
    <img src="https://assets.temporal.io/w/vscode-icon.png" alt="Temporal" width="128">
  <br>
  Temporal for VS Code
  <br>
  <br>
</h1>

<h4 align="center">Debug TypeScript workflows by their ID or history file. Set breakpoints in code or on history events.</h4>

## Usage

- Install [the extension](https://marketplace.visualstudio.com/items?itemName=temporal-technologies.temporalio)
- Add a file at `src/debug-replayer.ts` (or can [configure](#entrypoint) an alternate location):

  ```ts
  import { startDebugReplayer } from "@temporalio/worker"

  startDebugReplayer({
    workflowsPath: require.resolve("./workflows"),
  })
  ```

- Edit the `'./workflows'` path to match the location of your workflows file
- Run `Temporal: Open Panel` (use `Cmd/Ctrl-Shift-P` to open Command Palette)
- Enter a Workflow Id or choose a history JSON file
- Click `Start`
- The Workflow Execution will start replaying and hit a breakpoint set on the first event
- Set breakpoints in code or on history events
- Hit play or step forward
- To restart from the beginning, click the `MAIN` tab and `Start` again

## Configuration

### Server

When starting a replay by Workflow Id, the extension downloads the history from the Temporal Server. By default, it connects to a Server running on the default `localhost:7233`.

To connect to a different Server:

- Open the `SETTINGS` tab
- Edit the `Address` field
- If you're using TLS (e.g. to connect to Temporal Cloud), check the box and select your client cert and key

### Entrypoint

By default, the extension will look for the file that calls [`startDebugReplayer`](https://typescript.temporal.io/api/namespaces/worker#startdebugreplayer) at `src/debug-replayer.ts`. To use a different TypeScript or JavaScript file, set the `temporal.replayerEntrypoint` config:

- Open or create `.vscode/settings.json`
- Add the config field:

  ```json
  {
    "temporal.replayerEntrypoint": "test/different-file.ts"
  }
  ```

*Note that the file must be within your project directory so it can find `node_modules/`.*

## Contributing

The development flow is pretty standard for a Node.js / VS Code extension. Some useful commands listed below:

- Install dependencies: `npm ci`
- Build the extension and WebView: `npm run build`
- Watch filesystem and rebuild on change: `npm run build.watch` (recommended)

### Debugging this extension

- Use the provided [launch configuration](./.vscode/launch.json) to run the extension in a new VS Code window (see [Run and Debug view](https://code.visualstudio.com/docs/editor/debugging#_run-and-debug-view)).
- In that window, open a Temporal project `Ctrl-K-O` (or `Cmd-K-O` on Mac) and create a file with `startDebugReplayer` (e.g. `./src/debug-replayer.ts`) as described above.
- Use `Ctrl-Shift-P` (or `Cmd-Shift-P` on Mac) to open the panel using the command ("Temporal: Open Panel") mentioned above.

One useful thing to note is that for local development, we've set up a local HTTP server and a rollup watch hook that
will reload the WebView after bundling is complete. The HTTP handler is defined in [the panel
code](./extension/src/panel.ts) - look for `TEMPORAL_DEBUGGER_EXTENSION_DEV_MODE` in that file. When working on a
specific view, it may be useful to send events to the webview from the handler to quickly get the app state to that
view. For example to switch to the history view you may use something like:

```ts
await this.panel.webview.postMessage({ type: "historyProcessed", history })
```

The repository uses `eslint` and `prettier` to maintain consistent a style, run validation with `npm run lint` and
auto-format code with `npm run format`.
