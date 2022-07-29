<script lang="ts">
  import type { temporal } from "@temporalio/proto"
  export let switchToHistoryView: (history: temporal.api.history.v1.IHistory) => void

  window.addEventListener("message", (event) => {
    console.log("*****")
    console.log(event.data.history)
    console.log("*****")
    if (event.data.type === "historyProcessed") switchToHistoryView(event.data.history)
  })
  /**
   * Event listener for starting a session from workflow ID
   */
  function startFromWorkflowId(e: any) {
    const data = Object.fromEntries(new FormData(e.target))

    // TODO: this isn't fully implemented yet
    console.log(data)
  }

  async function processHistory(fileblob: Blob) {
    const buffer = await fileblob.arrayBuffer()
    vscode.postMessage({
      type: "processHistory",
      buffer,
    })
  }

  /**
   * Event listener for starting a session from history file
   */
  function startFromHistoryFile(e: any) {
    const fileinfo = Object.fromEntries(new FormData(e.target)).file

    console.log(fileinfo)

    const fileblob = new Blob([fileinfo], { type: "json" })
    console.log(fileblob)

    processHistory(fileblob)

    // FormData.prototype.entries
    // TODO: this isn't fully implemented yet
  }
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
