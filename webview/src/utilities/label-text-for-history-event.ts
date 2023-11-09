import humanizeDuration from "humanize-duration"
import { temporal } from "@temporalio/proto"
import { optionalTsToMs } from "@temporalio/common/lib/time"
import type { CategorizedEvent } from "../lib"

function labelDetailsForHistoryEvent(event: CategorizedEvent) {
  switch (event.eventType) {
    case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_STARTED:
      return `(${event.workflowExecutionStartedEventAttributes?.workflowType?.name})`
    case temporal.api.enums.v1.EventType.EVENT_TYPE_ACTIVITY_TASK_SCHEDULED:
      return `(${event.activityTaskScheduledEventAttributes?.activityType?.name})`
    case temporal.api.enums.v1.EventType.EVENT_TYPE_WORKFLOW_EXECUTION_SIGNALED:
      return `(${event.workflowExecutionSignaledEventAttributes?.signalName})`
    case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_STARTED:
      return `⏱ (${humanizeDuration(optionalTsToMs(event.timerStartedEventAttributes?.startToFireTimeout) ?? 0)})`
    case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_FIRED:
      return `⏱🔥`
    case temporal.api.enums.v1.EventType.EVENT_TYPE_TIMER_CANCELED:
      return `⏱🚫`
  }
}

export function labelTextForHistoryEvent(event: CategorizedEvent): string {
  const { eventId, eventType } = event

  if (eventType === undefined || eventType === null) {
    throw new TypeError("Expected history event `eventType` to be defined")
  }

  const eventTypeName: string = temporal.api.enums.v1.EventType[eventType]
    .replace(/^EVENT_TYPE_/, "")
    .split("_")
    .map((p) => `${p[0]}${p.substring(1).toLowerCase()}`)
    .join("")
  const details = labelDetailsForHistoryEvent(event)

  return `[${eventId}] ${eventTypeName} ${details ?? ""}`
}
