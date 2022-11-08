<script lang="ts">
  import { onMount } from "svelte"
  import { temporal } from "@temporalio/proto"
  import HistoryView from "./history.svelte"
  import MainView from "./main.svelte"
  import SettingsView from "./settings.svelte"

  type PanelTab = "settings-tab" | "main-tab" | "history-tab"
  let activeid: PanelTab = "main-tab"
  let currentHistory: temporal.api.history.v1.IHistory
  const eventEmitter = new EventTarget()

  onMount(() => {
    const listener = (event: MessageEvent) => {
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
        // TODO: Notify unexpected error
      }
    }
    window.addEventListener("message", listener as EventListener)

    return () => {
      window.removeEventListener("message", listener as EventListener)
    }
  })
</script>

<main>
  {#key currentHistory}
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
  {/key}
</main>

<style>
  /* Styling based on <vscode-button appearance="secondary" /> */
  :global(input::file-selector-button) {
    background: var(--button-secondary-background);
    color: var(--button-secondary-foreground);
    outline: none;
    font-family: var(--font-family);
    font-size: var(--type-ramp-base-font-size);
    line-height: var(--type-ramp-base-line-height);
    border-radius: 2px;
    fill: currentcolor;
    cursor: pointer;
    padding: var(--button-padding-vertical) var(--button-padding-horizontal);
    border: calc(var(--border-width) * 1px) solid var(--button-border);
  }

  :global(input::file-selector-button:hover) {
    background: var(--button-secondary-hover-background);
  }
</style>
