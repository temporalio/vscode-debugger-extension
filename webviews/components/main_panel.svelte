<script lang="ts">
  import HistoryView from "./history_panel.svelte"

  let views: boolean = false
  let nodeRef: any
  const data = {} as any
  const fileinfo = {} as any

  //Eventlistener for getting workerID
  const ids = (e: any) => {
    const formData = new FormData(e.target)
    //collecting data from
    for (let field of formData) {
      const [key, value] = field
      data[key] = value
    }
    console.log(data)
  }

  //Eventlistener for Debug from history file
  const historyFile = (e: any) => {
    const formData = new FormData(e.target)

    for (let field of formData) {
      const [key, value] = field
      fileinfo[key] = value
    }

    console.log(fileinfo)
  }
  // Eventlistener for Configure server credentials (for downloading histories)
  const downloadHistory = (e: any) => {
    const formData = new FormData(e.target)

    for (let field of formData) {
      const [key, value] = field
      data[key] = value
    }
    //posting massage on panel once Submit
    tsvscode.postMessage({
      type: "onSubmit",
    })
    console.log(data)
    views = true
    //hidding the main once submit the form
    nodeRef.parentNode.removeChild(nodeRef)
  }
</script>

<main bind:this={nodeRef}>
  <p>Debug by ID</p>
  <form on:submit|preventDefault={ids}>
    <input type="text" required placeholder="Workflow ID *" name="Workflow_ID" />
    <input type="text" placeholder="Run ID" name="Run_Id" />
    <input type="submit" value="Start" />
  </form>
  <hr />
  <p>Debug from history file</p>
  <form on:submit|preventDefault={historyFile}>
    <input type="file" required name="File" />
    <input type="submit" value="Start" />
  </form>
  <hr />
  <p>Configure server credentials (for downloading histories)</p>

  <form on:submit|preventDefault={downloadHistory}>
    <label for="address">Address</label>
    <input type="text" default="127.0.0.1:7233" name="Address" />
    <label for="tls">TLS?</label>
    <input type="checkbox" name="TLS" />
    <div />
    <label for="clientCert">Client cert</label>
    <input type="file" name="Client_cert" />
    <div />
    <label for="clintKey">Client private key</label>
    <input type="file" name="Client_private_key" />
    <button type="submit">Submit</button>
  </form>
</main>
<!-- showing history component on click of submit button-->
{#if views}
  <svelte:component this={HistoryView} />
{/if}
