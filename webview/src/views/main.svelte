<script lang="ts">
  /**
   * Event listener for starting a session from workflow ID
   */
  function startFromWorkflowId(e: Event) {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new TypeError("Expected form element")
    }
    const data = Object.fromEntries(new FormData(e.target))

    // TODO: implement this
    vscode.postMessage({
      type: "startFromId",
      ...data,
    })
  }

  async function processHistory(fileblob: Blob) {
    // TODO: handle errors
    const buffer = await fileblob.arrayBuffer()
    // TODO: show loading indicator, set timeout for this operation
    vscode.postMessage({
      type: "startFromHistory",
      buffer,
    })
  }

  /**
   * Event listener for starting a session from history file
   */
  function startFromHistoryFile(e: Event) {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new TypeError("Expected form element")
    }
    const fileinfo = Object.fromEntries(new FormData(e.target)).file

    const fileblob = new Blob([fileinfo])
    processHistory(fileblob)
  }
</script>

<section>
  <p>Debug by ID</p>
  <form class="debug-id-form" on:submit|once|preventDefault={startFromWorkflowId}>
    <vscode-text-field type="text" placeholder="Namespace (default)" name="namespace" />
    <vscode-text-field type="text" required placeholder="Workflow ID *" name="workflowId" />
    <vscode-text-field type="text" placeholder="Run ID" name="runId" />
    <vscode-button type="submit">Start</vscode-button>
  </form>
  <vscode-divider role="presentation" />
  <p>Debug from history file</p>
  <form on:submit|once|preventDefault={startFromHistoryFile}>
    <input class="file-input" type="file" required name="file" />
    <vscode-button class="start-button" type="submit">Start</vscode-button>
  </form>
</section>

<style>
  .debug-id-form {
    display: flex;
    margin-bottom: 0.5rem;
  }
  .file-input {
    display: block;
  }
  vscode-text-field {
    margin-right: 0.625rem;
  }
  .start-button {
    margin-top: 0.875rem;
  }
</style>
