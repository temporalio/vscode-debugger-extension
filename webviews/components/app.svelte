<script lang="ts">
  import HistoryView from "./history_view.svelte"
  import MainView from "./main_view.svelte"
  import SettingsView from "./settings_view.svelte"

  type View = "main" | "history" | "settings"
  let currentView: View = "main"

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
  <input type="button" value="Settings" on:click={switchToSettingsView} />
  <input type="button" value="Main" on:click={switchToMainView} />
  {#if currentView === "main"}
    <svelte:component this={MainView} {switchToHistoryView} />
  {:else if currentView === "settings"}
    <svelte:component this={SettingsView} />
  {:else}
    <svelte:component this={HistoryView} />
  {/if}
</main>
