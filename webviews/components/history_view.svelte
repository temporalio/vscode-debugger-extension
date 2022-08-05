<script lang="ts">
  import type { temporal } from "@temporalio/proto"
  export let history: temporal.api.history.v1.IHistory
</script>

<section>
  <h1>[ ]Workflow Task</h1>

  <p>
    type: {history.events?.[0].eventType}
    {history.events?.[0].workflowExecutionStartedEventAttributes?.workflowType?.name}
  </p>
  <p>Command out 1</p>
  <p>Event in 2</p>
  <p>Command out 2</p>
</section>
