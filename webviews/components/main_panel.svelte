<script>
  const data = {}
  const ids = (e) => {
    const formData = new FormData(e.target)

    for (let field of formData) {
      const [key, value] = field
      data[key] = value
    }
    console.log(data)
    console.log("Form Submit for ids!")
  }

  const historyFile = (e) => {
    const formData = new FormData(e.target)

    for (let field of formData) {
      const [key, value] = field
      data[key] = value
    }
    console.log(data)
    console.log("Form Submit for historyFile!")
  }

  const downloadHistory = (e) => {
    const formData = new FormData(e.target)

    for (let field of formData) {
      const [key, value] = field
      data[key] = value
    }
    console.log(data)
    console.log("Form Submit for downloadHistory!")
  }
</script>

<main>
  <p>Debug by ID</p>
  <form on:submit|preventDefault={ids}>
    <input type="text" required placeholder="Workflow ID *" name="Workflow ID" />
    <input type="text" placeholder="Run ID" name="Run Id" />
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
    <input type="file" name="Client cert" />
    <div />
    <label for="clintKey">Client private key</label>
    <input type="file" name="Client private key" />
    <button type="submit">Submit</button>
  </form>
</main>
