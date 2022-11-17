<script lang="ts">
  import Icon from "../components/icon/icon.svelte"
  import SubmitButton from "../components/submit-button.svelte"

  let loading = false
  let error = ""
  let history = ""

  /**
   * Event listener for starting a session from workflow ID
   */
  function startFromWorkflowId(e: Event) {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new TypeError("Expected form element")
    }
    const data = Object.fromEntries(new FormData(e.target))

    vscode.postMessage({
      type: "startFromId",
      ...data,
    })
  }

  /**
   * Reads and parses JSON history file
   */
  async function processHistory(file: File) {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadstart = () => {
      loading = true
    }
    reader.onloadend = (event) => {
      const result = event?.target?.result as string
      try {
        history = JSON.parse(result) ?? ""
      } catch {
        error = "Could not parse JSON"
      }
      loading = false
    }
    reader.onerror = () => {
      error = "Failed to read file: " + reader.error
      loading = false
    }
  }

  function handleHistoryFile(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target?.files?.[0]
    error = ""
    if (file) {
      processHistory(file)
    }
  }

  /**
   * Event listener for starting a session from history file
   */
  function startFromHistoryFile() {
    if (history) {
      vscode.postMessage({
        type: "startFromHistory",
        history,
      })
    }
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
    <div class="debug-history-file">
      {#if loading}
        <vscode-progress-ring />
      {/if}
      <label for="history-file" hidden>History file</label>
      <input id="history-file" name="file" type="file" required on:change={handleHistoryFile} />
    </div>
    {#if error}
      <div class="error">
        <Icon name="error" />
        <p>{error}</p>
      </div>
    {/if}
    <div class="debug-history-btn">
      <SubmitButton disabled={loading || error}>Start</SubmitButton>
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

  .debug-history-file {
    display: flex;
    align-items: center;
  }

  .debug-history-file vscode-progress-ring {
    margin-right: 1rem;
  }
  .debug-history-btn {
    margin-top: 0.875rem;
  }

  .error {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    color: #f14c4c;
  }

  .error p {
    margin: 0 0 0 0.5rem;
  }
</style>
