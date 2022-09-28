<script lang="ts">
  import { onDestroy } from "svelte"
  import type { ViewSettings } from "../lib"

  export let eventEmitter: EventTarget
  const settingsLoadedPromise = new Promise<ViewSettings>((resolve) => {
    const listener = (e: Event) => {
      resolve((e as CustomEvent<ViewSettings>).detail)
    }
    eventEmitter.addEventListener("settingsLoaded", listener, { once: true })
    onDestroy(() => eventEmitter.removeEventListener("settingsLoaded", listener))
  })

  /**
   * Event listener for saving the settings
   */
  async function saveSettings() {
    // TODO: handle errors
    const form = document.getElementById("settings-form")
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError("Expected form element")
    }

    const data = new FormData(form)

    const settings = Object.fromEntries(
      await Promise.all(
        [["tls", "off"], ...data.entries()].map(async ([k, v]) => {
          if (k === "clientCert" || k === "clientPrivateKey") {
            const fileblob = new Blob([v])
            const buffer = await fileblob.arrayBuffer()
            return [k, buffer]
          }
          if (k === "tls") {
            return [k, v === "on"]
          }
          return [k, v]
        }),
      ),
    )

    vscode.postMessage({
      type: "updateSettings",
      settings,
    })
  }

  // Load settings on component load
  vscode.postMessage({ type: "getSettings" })
</script>

<section>
  {#await settingsLoadedPromise}
    <vscode-progress-ring />
    <p>Loading...</p>
  {:then settings}
    <p>Configure client connection (for downloading histories)</p>
    <form id="settings-form">
      <vscode-text-field type="text" required value={settings.address}>Address</vscode-text-field>
      <div class="checkbox">
        <vscode-checkbox checked={settings.tls}>TLS?</vscode-checkbox>
      </div>
      <label for="clientCert">Client cert {settings.hasClientCert ? "(present)" : ""}</label>
      <input type="file" name="clientCert" />

      <label for="clientPrivateKey">Client private key {settings.hasClientPrivateKey ? "(present)" : ""}</label>
      <input type="file" name="clientPrivateKey" />

      <div class="submit">
        <vscode-button on:click={saveSettings}>Submit</vscode-button>
      </div>
    </form>
  {/await}
</section>

<style>
  label {
    display: block;
    margin: 0.5rem 0;
  }
  .checkbox {
    display: block;
  }
  .submit {
    display: block;
    margin-top: 1.75rem;
  }
</style>
