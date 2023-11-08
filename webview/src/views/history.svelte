<script lang="ts">
  import { onMount } from "svelte"
  import Icon from "../components/icon/icon.svelte"
  import { temporal } from "@temporalio/proto"
  import type { History } from "../lib"
  import { getWorkflowTasks } from "../utilities/get-workflow-tasks"
  import { labelTextForHistoryEvent } from "../utilities/label-text-for-history-event"
  import { duration } from "../utilities/duration"
  import BreakpointButton from "../components/breakpoint-button.svelte"

  export let eventEmitter: EventTarget
  export let history: History
  const workflowTasks = getWorkflowTasks(history)
  let currentWorkflowTaskStartedEventId = -1

  onMount(() => {
    const listener = ({ detail }: CustomEvent<number>) => {
      currentWorkflowTaskStartedEventId = detail
      vscode.postMessage({
        type: "updateWorkflowTaskHasBreakpoint",
        hasBreakpoint:
          workflowTasks.find(({ startedEventId }) => startedEventId === currentWorkflowTaskStartedEventId)
            ?.hasBreakpoint ?? false,
      })
    }
    eventEmitter.addEventListener("currentWFTUpdated", listener as EventListener)

    return () => {
      eventEmitter.removeEventListener("currentWFTUpdated", listener as EventListener)
    }
  })

  // Setting title for workflow
  function title(history: History): string {
    const lastEvent = history.events?.[history.events.length - 1]
    if (lastEvent == null) {
      throw new TypeError("Got history with no events")
    }

    switch (lastEvent.eventType) {
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED:
        return "Workflow execution terminated"
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED:
        return " Workflow execution completed"
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_CONTINUED_AS_NEW:
        return "Workflow execution continued-as-new"
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_FAILED:
        return "Workflow execution failed in"
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT:
        return "Workflow execution timed out"
      default:
        return "Workflow execution incomplete"
    }
  }

  $: {
    currentWorkflowTaskStartedEventId
  }
</script>

<section>
  <h1>{title(history)}</h1>
  <p>Duration: {duration(history)}</p>
  {#each workflowTasks as workflowTask, i}
    <ul class:current={workflowTask.startedEventId === currentWorkflowTaskStartedEventId}>
      <div class="workflow-task">
        <BreakpointButton {workflowTask} />
        <p>Workflow Task ({workflowTask.status})</p>
      </div>
      {#each workflowTask.events as event}
        <li title={`event ID: ${event.eventId}`}>
          {#if event?.category === "COMMAND"}
            <Icon name="arrow-left" />
          {:else}
            <Icon name="arrow-right" />
          {/if}
          {labelTextForHistoryEvent(event)}
        </li>
      {/each}
    </ul>
    {#if i !== workflowTasks.length - 1}
      <vscode-divider role="presentation" />
    {/if}
  {/each}
</section>

<style>
  section {
    width: 100%;
  }
  ul {
    list-style-type: none;
    padding: 0.25rem 0 0.5rem 0;
    margin: 0;
  }
  li {
    display: flex;
    align-items: center;
    margin: 0.5rem 0 0 1.5rem;
  }
  vscode-divider {
    margin: 0;
  }
  .current {
    background-color: #ffff1c2e;
  }
  .workflow-task {
    display: flex;
    align-items: center;
  }
  .workflow-task p {
    margin: 0;
  }
</style>
