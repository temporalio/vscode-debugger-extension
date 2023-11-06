import { expect, describe, it } from "vitest"
import { getWorkflowTasks } from "./get-workflow-tasks"
import { historyFromJSON } from "@temporalio/common/lib/proto-utils"
import completedEvents from "../../../samples/events.completed.json"

describe("getWorkflowTasks", () => {
  it("should return an empty array if there are no events", () => {
    const result = getWorkflowTasks(historyFromJSON({ events: [] }))
    expect(result).toEqual([])
  })

  it("should return status COMPLETED and hasBreakpoint set to true if the eventType is WorkflowTaskCompleted", () => {
    const completedEvent = completedEvents.events[16]
    const result = getWorkflowTasks(historyFromJSON({ events: [completedEvent] }))
    expect(result).toEqual([{ events: [], status: "COMPLETED", hasBreakpoint: true }])
  })

  it("should return hasBreakpoint set to false if there has already been a WorkflowTaskCompleted event", () => {
    const events = [completedEvents.events[16], completedEvents.events[16]]
    const result = getWorkflowTasks(historyFromJSON({ events }))[1].hasBreakpoint
    expect(result).toBe(false)
  })

  it("should return a startedEventId if there is a WorkflowTaskStarted event", () => {
    const workflowTaskStartedEvent = completedEvents.events.find((e) => e.eventType === "WorkflowTaskStarted")
    expect(getWorkflowTasks(historyFromJSON(completedEvents))[0].startedEventId?.toString()).toBe(
      workflowTaskStartedEvent?.eventId,
    )
  })
})
