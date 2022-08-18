<script lang="ts">
  import type { temporal } from "@temporalio/proto"

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
  <form on:submit|once|preventDefault={startFromWorkflowId}>
    <input type="text" placeholder="namespace (default)" name="namespace" />
    <input type="text" required placeholder="Workflow ID *" name="workflowId" />
    <input type="text" placeholder="Run ID" name="runId" />
    <input type="submit" value="Start" />
  </form>
  <hr />
  <p>Debug from history file</p>
  <form on:submit|once|preventDefault={startFromHistoryFile}>
    <input type="file" required name="file" />
    <input type="submit" value="Start" />
  </form>
</section>
