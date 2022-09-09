<script lang="ts">
  import { temporal } from "@temporalio/proto"
  import HistoryView from "./history.svelte"
  import MainView from "./main.svelte"
  import SettingsView from "./settings.svelte"

  type View = "main" | "history" | "settings"
  let currentView: View = "main"
  let currentHistory: temporal.api.history.v1.IHistory
  const eventEmitter = new EventTarget()

  window.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "settingsLoaded":
        eventEmitter.dispatchEvent(new CustomEvent("settingsLoaded", { detail: event.data.settings }))
        break
      case "currentWFTUpdated":
        eventEmitter.dispatchEvent(new CustomEvent("currentWFTUpdated", { detail: event.data.eventId }))
        break
      case "historyProcessed":
        currentHistory = temporal.api.history.v1.History.decode(event.data.history)
        switchToHistoryView()
        break
      default:
      // Notify unexpected error
    }
  })

  // TODO: window.removeEventListener when component unmounts

  function switchToHistoryView() {
    currentView = "history"
  }
  function switchToSettingsView() {
    currentView = "settings"
  }
  function switchToMainView() {
    currentView = "main"
  }
</script>

<main>
  <input type="button" value="Settings" on:click={switchToSettingsView} disabled={currentView === "settings"} />
  <input type="button" value="Main" on:click={switchToMainView} disabled={currentView === "main"} />
  <input
    type="button"
    value="History"
    on:click={switchToHistoryView}
    disabled={currentView === "history" || currentHistory == null} />
  {#if currentView === "main"}
    <MainView />
  {:else if currentView === "settings"}
    <SettingsView {eventEmitter} />
  {:else}
    <HistoryView history={currentHistory} {eventEmitter} />
  {/if}
</main>
