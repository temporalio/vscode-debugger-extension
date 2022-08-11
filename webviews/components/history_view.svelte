<script lang="ts">
  import { temporal, google } from "@temporalio/proto"

  export let history: temporal.api.history.v1.History
  type Timestamp = google.protobuf.ITimestamp

  console.log(history)
  let duration: number
  let startTime: number
  let currentEvent: temporal.api.enums.v1.EventType

  interface WorkflowTask {
    scheduled?: Date
    started?: Date
    startedEventId?: number
    events: temporal.api.history.v1.IHistoryEvent[]
    status: "COMPLETED" | "FAILED" | "TIMED_OUT"
  }

  export function tsToDate(ts: Timestamp | null | undefined): Date {
    if (ts === undefined || ts === null) {
      throw new Error(`Expected timestamp, got ${ts}`)
    }
    const { seconds, nanos } = ts
    return new Date((seconds as unknown as number) * 1000 + (nanos || 0) / 1000000)
  }

  //function to workflowTasks
  function workflowTasks(history: temporal.api.history.v1.IHistory): WorkflowTask[] {
    if (history === undefined) {
      return []
    }

    let currWFT: WorkflowTask = { events: [], status: "COMPLETED" }
    let wfts = Array<WorkflowTask>()

    for (const ev of history.events ?? []) {
      console.log(ev.eventType)
      switch (ev.eventType) {
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_COMPLETED:
          wfts.push(currWFT)
          currWFT = { events: [], status: "COMPLETED" }
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_FAILED:
          wfts.push(currWFT)
          currWFT.events.push(ev)
          currWFT.status = "FAILED"
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_TIMED_OUT:
        // wfts.push(currWFT)
        // currWFT.events.push(ev)
        // currWFT.status = "TIMED_OUT"
        // break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_SCHEDULED:
          currWFT.scheduled = tsToDate(ev.eventTime!)
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_STARTED:
          currWFT.started = tsToDate(ev.eventTime!)
          currWFT.startedEventId = +ev.eventId!
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_CONTINUED_AS_NEW:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_FAILED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_SCHEDULED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_CANCEL_REQUESTED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_CANCELED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_STARTED:
          // TODO: append as a command
          wfts[wfts.length - 1].events.push(ev)
          break
        default:
          currWFT.events.push(ev)
          break
      }
    }
    console.log(wfts)
    return wfts
  }

  //get labelTextForHistoryEvent
  function labelTextForHistoryEvent(history: temporal.api.history.v1.IHistoryEvent) {
    const { eventType } = history
    if (eventType === undefined || eventType === null) {
      throw new TypeError("Expected history event `eventType` to be defined")
    }
    const eventTypeName: string = temporal.api.enums.v1.EventType[eventType]
      .replace(/^EVENT_TYPE_/, "")
      .split("_")
      .map((p) => `${p[0]}${p.substr(1).toLowerCase()}`)
      .join("")
    currentEvent = eventType
    console.log(currentEvent)
    switch (eventType) {
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_STARTED:
        startTime = tsToDate(history.eventTime).getTime() / 1000
        return ` ⇨ ${eventTypeName} (${history.workflowExecutionStartedEventAttributes?.workflowType?.name})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED:
        duration = +(tsToDate(history.eventTime).getTime() / 1000 - startTime).toFixed(3)
        console.log(tsToDate(history.eventTime).getTime() / 1000, "-", startTime, "=", duration)
        return ""
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_FAILED:
        duration = +(tsToDate(history.eventTime).getTime() / 1000 - startTime).toFixed(3)
        // console.log((tsToDate(history.eventTime).getTime()/1000),"-",startTime,"=",duration)
        return `⇨ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT:
        duration = +(tsToDate(history.eventTime).getTime() / 1000 - startTime).toFixed(3)
        // console.log((tsToDate(history.eventTime).getTime()/1000),"-",startTime,"=",duration)
        return `⇨ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_CONTINUED_AS_NEW:
        duration = +(tsToDate(history.eventTime).getTime() / 1000 - startTime).toFixed(3)
        // console.log((tsToDate(history.eventTime).getTime()/1000),"-",startTime,"=",duration)
        return `⇨ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_SCHEDULED:
        return ` ⇦ ${eventTypeName} (${history.activityTaskScheduledEventAttributes?.activityType?.name})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_STARTED:
        if (history.activityTaskStartedEventAttributes?.lastFailure) {
          return ` ⇦ ${eventTypeName} (${history.activityTaskStartedEventAttributes?.lastFailure.message})`
        } else {
          return ` ⇦ ${eventTypeName}`
        }
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_SIGNALED:
        return ` ⇨ ${eventTypeName} (${history.workflowExecutionSignaledEventAttributes?.signalName})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_STARTED:
        return `⇨ ⏱ ${eventTypeName} (${history.timerStartedEventAttributes?.startToFireTimeout?.seconds}s)`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_FIRED:
        return `⇦ ⏱ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_FAILED:
        return ` ⇦ ${eventTypeName} (${history.activityTaskFailedEventAttributes?.failure})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED:
        duration = +(tsToDate(history.eventTime).getTime() / 1000 - startTime).toFixed(3)
        // console.log((tsToDate(history.eventTime).getTime()/1000),"-",startTime,"=",duration)
        return `⇨ ${eventTypeName}`
    }
    return `⇦ ${eventTypeName}`
  }
</script>

<head>
  <title>Project Workflow panel</title>
</head>

<body>
  <div>
    {#if currentEvent === 2}
      <h1>Workflow execution completed in {duration}s</h1>
    {:else if currentEvent === 3}
      <h1>Workflow execution failed in {duration}s</h1>
    {:else if currentEvent === 4}
      <h1>Workflow execution timed out after {duration}s</h1>
    {:else if currentEvent === 27}
      <h1>Workflow execution terminated after {duration}s</h1>
    {:else if currentEvent === 28}
      <h1>Workflow execution continued-as-new in {duration}s</h1>
    {/if}
  </div>
  {#each workflowTasks(history) as workflowTask}
    <div class="current">
      <input type="radio" name="workflowTask" value="Workflow Task ({workflowTask.status})" />Workflow Task ({workflowTask.status})
      {#each workflowTask.events as event}
        <ul>
          {labelTextForHistoryEvent(event)}
        </ul>
      {/each}
    </div>
  {/each}
</body>

<style>
  /* .current:last-child {
    background-color: #ffff00;
    color: black;
  } */
</style>
