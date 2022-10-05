<script lang="ts">
  import { onDestroy } from "svelte"
  import SubmitButton from "../components/submit-button.svelte"

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
  async function saveSettings(e: Event) {
    if (!(e.target instanceof HTMLFormElement)) {
      throw new TypeError("Expected form element")
    }

    const data = new FormData(e.target)

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
    <form on:submit|once|preventDefault|stopPropagation={saveSettings}>
      <vscode-text-field type="text" required value={settings.address}>Address</vscode-text-field>
      <div class="checkbox">
        <vscode-checkbox checked={settings.tls}>TLS?</vscode-checkbox>
      </div>

      <label for="client-cert">Client cert {settings.hasClientCert ? "(present)" : ""}</label>
      <input id="client-cert" type="file" />

      <label for="client-private-key">Client private key {settings.hasClientPrivateKey ? "(present)" : ""}</label>
      <input id="client-private-key" type="file" />

      <div class="submit-btn">
        <SubmitButton>Submit</SubmitButton>
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
  .submit-btn {
    margin-top: 1.75rem;
  }
</style>
