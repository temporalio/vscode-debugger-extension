import { temporal, google } from "@temporalio/proto"

export type History = temporal.api.history.v1.IHistory
export type HistoryEvent = temporal.api.history.v1.IHistoryEvent
export type EventType = temporal.api.enums.v1.EventType
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EventType = temporal.api.enums.v1.EventType
export type Timestamp = google.protobuf.ITimestamp

export interface CategorizedEvent extends HistoryEvent {
  category: "EVENT" | "COMMAND"
}

export interface WorkflowTask {
  scheduled?: Date
  started?: Date
  startedEventId?: number
  events: CategorizedEvent[]
  status: "COMPLETED" | "FAILED" | "TIMED_OUT"
  hasBreakpoint: boolean
}
