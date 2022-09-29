<script lang="ts">
  import type { WorkflowTask } from "../lib"
  import { CircleFilled } from "svelte-codicons"

  export let workflowTask: WorkflowTask
  let hasBreakpoint = workflowTask.hasBreakpoint

  function toggleBreakpoint(workflowTask: WorkflowTask) {
    console.log("toggleBreakpoint", workflowTask)
    hasBreakpoint = workflowTask.hasBreakpoint = !workflowTask.hasBreakpoint
  }
</script>

<div
  class="checkbox"
  role="checkbox"
  aria-checked={hasBreakpoint}
  tabindex="0"
  on:click={toggleBreakpoint.bind(undefined, workflowTask)}>
  <CircleFilled fill={hasBreakpoint ? "#FF0000" : "currentColor"} />
</div>

<style>
  .checkbox {
    margin: 0.25rem 0.25rem 0 0.25rem;
  }
</style>
