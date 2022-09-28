<script lang="ts">
  /**
   * Event listener for starting a session from workflow ID
   */
  function startFromWorkflowId() {
    const form = document.getElementById("debug-by-id-form")
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError("Expected form element")
    }
    const data = Object.fromEntries(new FormData(form))

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
  function startFromHistoryFile() {
    const form = document.getElementById("debug-from-history-form")
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError("Expected form element")
    }
    const fileinfo = Object.fromEntries(new FormData(form)).file

    const fileblob = new Blob([fileinfo])
    processHistory(fileblob)
  }
</script>

<section>
  <p>Debug by ID</p>
  <form id="debug-by-id-form">
    <vscode-text-field type="text" placeholder="Namespace (default)" name="namespace" />
    <vscode-text-field type="text" required placeholder="Workflow ID *" name="workflowId" />
    <vscode-text-field type="text" placeholder="Run ID" name="runId" />
    <vscode-button on:click={startFromWorkflowId}>Start</vscode-button>
  </form>
  <vscode-divider role="presentation" />
  <p>Debug from history file</p>
  <form id="debug-from-history-form">
    <input class="file-input" type="file" required name="file" />
    <vscode-button class="start-button" on:click={startFromHistoryFile}>Start</vscode-button>
  </form>
</section>

<style>
  #debug-by-id-form {
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
