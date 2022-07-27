<script lang="ts">
  export let switchToHistoryView: () => void

  /**
   * Event listener for starting a session from workflow ID
   */
  function startFromWorkflowId(e: any) {
    const data = Object.fromEntries(new FormData(e.target))

    // TODO: this isn't fully implemented yet
    console.log(data)
    switchToHistoryView()
  }

  /**
   * Event listener for starting a session from history file
   */
  function startFromHistoryFile(e: any) {
    const fileinfo = Object.fromEntries(new FormData(e.target))

    // TODO: this isn't fully implemented yet
    console.log(fileinfo)
  }

  // TODO: saved this as reference for future work
  // vscode.postMessage({
  //   type: "onSubmit",
  // })
</script>

<section>
  <p>Debug by ID</p>
  <form on:submit|preventDefault={startFromWorkflowId}>
    <input type="text" required placeholder="Workflow ID *" name="workflowId" />
    <input type="text" placeholder="Run ID" name="runId" />
    <input type="submit" value="Start" />
  </form>
  <hr />
  <p>Debug from history file</p>
  <form on:submit|preventDefault={startFromHistoryFile}>
    <input type="file" required name="file" />
    <input type="submit" value="Start" />
  </form>
  <hr />
  <p>Configure server credentials (for downloading histories)</p>
</section>
