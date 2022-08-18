<script lang="ts">
  import App from "./app.svelte"

  /**
   * Event listener for saving the settings
   */

  async function saveSettings(e: any) {
    const data = Object.fromEntries(new FormData(e.target))
    const convertedData: {
      [key: string]: any
    } = {}

    for (let d in data) {
      if (d === "clientCert" || d === "clientPrivateKey") {
        const fileblob = new Blob([data[d]])
        const buffer = await fileblob.arrayBuffer()
        convertedData[d] = new TextDecoder().decode(new Uint8Array(buffer, 0, buffer.byteLength))
      } else {
        convertedData[d] = data[d]
      }
    }

    vscode.postMessage({
      type: "secretStorage",
      ...convertedData,
    })
  }
</script>

<section>
  <p>Configure server credentials (for downloading histories)</p>
  <form on:submit|preventDefault={saveSettings}>
    <label for="address">Address</label>
    <input type="text" default="127.0.0.1:7233" name="address" />
    <label for="tls">TLS?</label>
    <input type="checkbox" name="TLS" />
    <div />
    <label for="clientCert">Client cert</label>
    <input type="file" name="clientCert" />
    <div />
    <label for="clintKey">Client private key</label>
    <input type="file" name="clientPrivateKey" />
    <button type="submit">Submit</button>
  </form>
</section>
