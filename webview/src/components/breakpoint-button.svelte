<script lang="ts">
  import type { WorkflowTask } from "../lib"
  export let workflowTask: WorkflowTask
  let icon: string
  let hasBreakpoint = workflowTask.hasBreakpoint
  $: {
    hasBreakpoint
    icon = hasBreakpoint ? "🔴" : "⚪"
  }

  function toggleBreakpoint(workflowTask: WorkflowTask) {
    console.log("toggleBreakpoint", workflowTask)
    hasBreakpoint = workflowTask.hasBreakpoint = !workflowTask.hasBreakpoint
  }
</script>

<input type="button" value={icon} on:click={toggleBreakpoint.bind(undefined, workflowTask)} />

<style>
  input {
    background-color: #0000;
    border: none;
    border-radius: 50%;
    padding: 0px 2px;
    margin: 4px 2px;
  }
</style>
