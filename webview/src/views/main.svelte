<script lang="ts">
  import SubmitButton from "../components/submit-button.svelte"
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
  <form class="debug-by-id-form" on:submit|once|preventDefault={startFromWorkflowId}>
    <vscode-text-field type="text" placeholder="Namespace (default)" name="namespace" />
    <vscode-text-field type="text" required placeholder="Workflow ID *" name="workflowId" />
    <vscode-text-field type="text" placeholder="Run ID" name="runId" />
    <SubmitButton>Start</SubmitButton>
  </form>
  <vscode-divider role="presentation" />
  <p>Debug from history file</p>
  <form on:submit|once|preventDefault={startFromHistoryFile}>
    <label for="history-file" hidden>History file</label>
    <input id="history-file" type="file" required />
    <div class="debug-history-btn">
      <SubmitButton>Start</SubmitButton>
    </div>
  </form>
</section>

<style>
  .debug-by-id-form {
    display: flex;
    margin-bottom: 0.5rem;
  }
  vscode-text-field {
    margin-right: 0.625rem;
  }
  .debug-history-btn {
    margin-top: 0.875rem;
  }
</style>
