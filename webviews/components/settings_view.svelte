<script lang="ts">
  /**
   * Event listener for saving the settings
   */
  function saveSettings(e: any) {
    const data = Object.fromEntries(new FormData(e.target))

    // TODO: this isn't fully implemented yet
    console.log(data)
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
