<script>
  // const vscode = acquireVsCodeApi()

  const handleClick = () => {
    console.log("Submit successfully!")
  }
</script>

<main>
  <p>Debug by ID</p>
  <form>
    <input type="text" required placeholder="Workflow ID *" />
    <input type="text" placeholder="Run ID" />
    <input type="button" value="Start" />
  </form>
  <hr />
  <p>Debug from history file</p>
  <form>
    <input type="file" required />
    <input type="button" value="Start" />
  </form>
  <hr />
  <p>Configure server credentials (for downloading histories)</p>
  <form>
    <label for="address">Address</label>
    <input type="text" default="127.0.0.1:7233" />
    <label for="tls">TLS?</label>
    <input type="checkbox" />
    <div />
    <label for="clientCert">Client cert</label>
    <input type="file" />
    <div />
    <label for="clintKey">Client private key</label>
    <input type="file" />
  </form>
  <div id="lines-of-code-counter" />
  <button on:click={handleClick} id="submit">Submit</button>
</main>

<style>
</style>
