<script lang="ts">
  import HistoryView from "./history_view.svelte"
  import MainView from "./main_view.svelte"
  import SettingsView from "./settings_view.svelte"
  import { temporal } from "@temporalio/proto"

  type View = "main" | "history" | "settings"
  let currentView: View = "main"
  let currentHistory: temporal.api.history.v1.IHistory

  window.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "historyProcessed":
        currentHistory = temporal.api.history.v1.History.decodeDelimited(event.data.history)
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
    <svelte:component this={MainView} />
  {:else if currentView === "settings"}
    <svelte:component this={SettingsView} />
  {:else}
    <svelte:component this={HistoryView} history={currentHistory} />
  {/if}
</main>
