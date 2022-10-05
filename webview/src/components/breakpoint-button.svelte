<script lang="ts">
  import type { WorkflowTask } from "../lib"
  import { CircleFilled } from "svelte-codicons"

  export let workflowTask: WorkflowTask
  let hasBreakpoint = workflowTask.hasBreakpoint

  function toggleBreakpoint() {
    console.log("toggleBreakpoint", workflowTask)
    hasBreakpoint = workflowTask.hasBreakpoint = !workflowTask.hasBreakpoint
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault()
      toggleBreakpoint()
    }
  }
</script>

<div class="breakpoint" on:keypress={handleKeyPress} on:click={toggleBreakpoint}>
  <CircleFilled
    fill={hasBreakpoint ? "#FF0000" : "currentColor"}
    role="checkbox"
    aria-checked={hasBreakpoint}
    tabindex={0} />
</div>

<style>
  .breakpoint {
    margin: 0.25rem 0.25rem 0 0.25rem;
  }
</style>
