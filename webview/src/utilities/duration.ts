import humanizeDuration from "humanize-duration"
import { tsToDate } from "@temporalio/common"
import type { History } from "../lib"

export function duration(history: History): string {
  const workflowStartedEvent = history.events?.find((e) => e.workflowExecutionStartedEventAttributes)
  if (workflowStartedEvent == null) {
    throw new TypeError("Got history with no WorkflowExecutionStarted event")
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const startTime = tsToDate(workflowStartedEvent.eventTime!).getTime()
  const lastEvent = history.events?.[history.events.length - 1]
  if (lastEvent == null) {
    throw new TypeError("Got history with no events")
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const endTime = tsToDate(lastEvent.eventTime!).getTime()
  return humanizeDuration(endTime - startTime)
}
