<script lang="ts">
  import { temporal } from "@temporalio/proto"
  import HistoryView from "./history.svelte"
  import MainView from "./main.svelte"
  import SettingsView from "./settings.svelte"

  type PanelTab = "settings-tab" | "main-tab" | "history-tab"
  let activeid: PanelTab = "main-tab"
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
        activeid = "history-tab"
        break
      default:
      // Notify unexpected error
    }
  })

  // TODO: window.removeEventListener when component unmounts
</script>

<main>
  <vscode-panels {activeid}>
    <vscode-panel-tab id="settings-tab">SETTINGS</vscode-panel-tab>
    <vscode-panel-tab id="main-tab">MAIN</vscode-panel-tab>
    {#if currentHistory}
      <vscode-panel-tab id="history-tab">HISTORY</vscode-panel-tab>
    {/if}
    <vscode-panel-view id="settings-view">
      <SettingsView {eventEmitter} />
    </vscode-panel-view>
    <vscode-panel-view id="main-view">
      <MainView />
    </vscode-panel-view>
    {#if currentHistory}
      <vscode-panel-view id="history-view">
        <HistoryView history={currentHistory} {eventEmitter} />
      </vscode-panel-view>
    {/if}
  </vscode-panels>
</main>
