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

  const bufferToText = (buffer: any) => {
    const bufferByteLength = buffer.byteLength
    const bufferUint8Array = new Uint8Array(buffer, 0, bufferByteLength)

    return new TextDecoder().decode(bufferUint8Array)
  }

  async function getPlanet(fileblob: Blob) {
    const buffer = await fileblob.arrayBuffer()
    console.log(bufferToText(buffer))
  }

  function startFromHistoryFile(e: any) {
    const fileinfo = Object.fromEntries(new FormData(e.target)).file

    console.log(fileinfo)

    const fileblob = new Blob([fileinfo], { type: "json" })
    console.log(fileblob)

    getPlanet(fileblob)

    // FormData.prototype.entries
    // TODO: this isn't fully implemented yet
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
