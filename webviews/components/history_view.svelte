<script lang="ts">
  import { temporal, google } from "@temporalio/proto"

  export let history: temporal.api.history.v1.History
  type Timestamp = google.protobuf.ITimestamp

  let startTime: number

  interface WorkflowTask {
    scheduled?: Date
    started?: Date
    startedEventId?: number
    events: temporal.api.history.v1.IHistoryEvent[]
    status: "COMPLETED" | "FAILED" | "TIMED_OUT"
    current?: boolean
  }

  export function tsToDate(ts: Timestamp | null | undefined): Date {
    if (ts === undefined || ts === null) {
      throw new Error(`Expected timestamp, got ${ts}`)
    }
    const { seconds, nanos } = ts
    return new Date((seconds as unknown as number) * 1000 + (nanos || 0) / 1000000)
  }

  //Time conversion to H:M:S
  //TODO: Have to fix the time to better formatting
  function timeConvertion(seconds: number): string {
    if (seconds < 1) {
      return `${seconds.toFixed(3)}s`
    }
    let hour = seconds / 3600
    let minutes = (hour % 1) * 60
    let second = (minutes % 1) * 60

    return `${Math.floor(hour)}:${Math.floor(minutes)}:${Math.round(second)}`
  }

  //Duration calculation
  function durationCalculation(eventTime: Timestamp | null | undefined, startTime: number): string {
    return `${timeConvertion(+(tsToDate(eventTime).getTime() / 1000 - startTime))}`
  }

  //Collecting workflow
  function workflowTasks(history: temporal.api.history.v1.IHistory): WorkflowTask[] {
    if (history === undefined) {
      return []
    }

    let currWFT: WorkflowTask = { events: [], status: "COMPLETED", current: true }
    let wfts = Array<WorkflowTask>()

    for (const ev of history.events ?? []) {
      switch (ev.eventType) {
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_COMPLETED:
          wfts.push(currWFT)
          currWFT = { events: [], status: "COMPLETED", current: false }
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_FAILED:
          currWFT.status = "FAILED"
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_TIMED_OUT:
          currWFT.status = "TIMED_OUT"
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_SCHEDULED:
          currWFT.scheduled = tsToDate(ev.eventTime!)
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_TASK_STARTED:
          currWFT.started = tsToDate(ev.eventTime!)
          currWFT.startedEventId = +ev.eventId!
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_STARTED:
          currWFT.events.push(ev)
          startTime = tsToDate(ev.eventTime!).getTime() / 1000
          break
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_CONTINUED_AS_NEW:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_FAILED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_SCHEDULED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_CANCEL_REQUESTED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_CANCELED:
        case temporal.api.enums.v1.EventType.EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_STARTED:
        // TODO: add child workflows
        case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_STARTED:
          // TODO: append as a command
          wfts[wfts.length - 1].events.push(ev)
          break
        default:
          currWFT.events.push(ev)
          break
      }
    }
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

    switch (eventType) {
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_STARTED:
        return `⇨ ${eventTypeName} (${history.workflowExecutionStartedEventAttributes?.workflowType?.name})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED:
        return ""
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_FAILED:
        return `⇨ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT:
        return `⇨ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_CONTINUED_AS_NEW:
        return `⇨ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_SCHEDULED:
        return ` ⇦ ${eventTypeName} (${history.activityTaskScheduledEventAttributes?.activityType?.name})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_STARTED:
        //TODO:  too long to display have to fix
        if (history.activityTaskStartedEventAttributes?.lastFailure) {
          return `⇦ ${eventTypeName} (${history.workflowExecutionStartedEventAttributes?.workflowType?.name})`
        } else {
          return `⇦ ${eventTypeName}`
        }
      case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_COMPLETED:
        return `⇨ ${eventTypeName} (${history.activityTaskCompletedEventAttributes?.identity})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_SIGNALED:
        return `⇨ ${eventTypeName} (${history.workflowExecutionSignaledEventAttributes?.signalName})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_STARTED:
        return `⇦ ⏱ ${eventTypeName} (${history.timerStartedEventAttributes?.startToFireTimeout?.seconds}s)`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_FIRED:
        return `⇨⏱ ${eventTypeName}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_FAILED:
        return `⇦ ${eventTypeName} (${history.activityTaskFailedEventAttributes?.failure})`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED:
        return `⇨ ${eventTypeName}`
      // TODO: add child workflows
    }

    return `⇦ ${eventTypeName}`
  }

  //setting title for workflow
  function title(workflowtask: WorkflowTask[]): string {
    let duration: string
    const history = workflowtask[workflowtask.length - 1]
    const event = history.events[history.events.length - 1]

    switch (event.eventType) {
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED:
        duration = durationCalculation(event.eventTime, startTime)
        return `Workflow execution terminated after ${duration}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED:
        duration = durationCalculation(event.eventTime, startTime)
        return ` Workflow execution completed in ${duration}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_CONTINUED_AS_NEW:
        duration = durationCalculation(event.eventTime, startTime)
        return `Workflow execution continued-as-new in ${duration}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_FAILED:
        duration = durationCalculation(event.eventTime, startTime)
        return `Workflow execution failed in ${duration}`
      case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT:
        duration = durationCalculation(event.eventTime, startTime)
        return `Workflow execution timed out after ${duration}`
    }

    return ""
  }
</script>

<title>Project Workflow panel</title>
<h1>{title(workflowTasks(history))}</h1>
{#each workflowTasks(history) as workflowTask}
  <!-- TODO: set this class only on the task that is actually current -->
  <div class:current={workflowTask.current}>
    <!-- TODO: Have to fix radio button -->
    <input type="radio" name="workflowTask" />Workflow Task ({workflowTask.status})
    {#each workflowTask.events as event}
      <ul>
        {labelTextForHistoryEvent(event)}
      </ul>
    {/each}
  </div>
{/each}

<style>
  .current {
    background-color: yellow;
    color: black;
  }
</style>
