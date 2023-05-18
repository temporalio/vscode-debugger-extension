# Contributing

The development flow is pretty standard for a Node.js / VS Code extension. Some useful commands listed below:

- Install dependencies: `npm ci`
- Build the extension and WebView: `npm run build`
- Watch filesystem and rebuild on change: `npm run build.watch` (recommended)

The repository uses `eslint` and `prettier` to maintain consistent a style, run validation with `npm run lint` and
auto-format code with `npm run format`.

## Debug

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

## Release

- `git checkout main`
- `git pull`
- Update [CHANGELOG.md](CHANGELOG.md)
- `git add CHANGELOG.md`
- `npm version <patch|minor|major>`
- `git push origin release`
