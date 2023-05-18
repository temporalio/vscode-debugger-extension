<h1 align="center">
  Temporal for VS Code
  <br>
  <br>
    <img src="https://assets.temporal.io/w/vscode.png" alt="Temporal for VS Code">
  <br>
</h1>

<h4 align="center">Debug TypeScript workflows by their ID or history file.</h4>
<h4 align="center">Set breakpoints in code or on history events.</h4>

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
- To restart from the beginning, click the green restart icon at the top of the screen, or if the debug session has ended, go back to the `MAIN` tab and `Start` again

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

_Note that the file must be within your project directory so it can find `node_modules/`._

## Contributing

Thank you to [all who have contributed](https://github.com/temporalio/vscode-debugger-extension/graphs/contributors) 🙏😊. If you'd like to contribute, check out our [issues](https://github.com/temporalio/vscode-debugger-extension/issues) and [CONTRIBUTING.md](https://github.com/temporalio/vscode-debugger-extension/blob/main/CONTRIBUTING.md).