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
