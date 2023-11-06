import { describe, it, expect } from "vitest"
import { duration } from "./duration"
import { historyFromJSON } from "@temporalio/common/lib/proto-utils"
import completedEvents from "../../../samples/events.completed.json"

describe("duration", () => {
  it("should format the duration between the workflow started event and the final event", () => {
    const result = duration(historyFromJSON(completedEvents))
    expect(result).toBe("4.12 seconds")
  })

  it("should error if there is no workflow started event", () => {
    const eventsWithoutWorkflowStarted = { events: completedEvents.events.slice(1) }
    expect(duration.bind(duration, historyFromJSON(eventsWithoutWorkflowStarted))).toThrow(
      "Got history with no WorkflowExecutionStarted event",
    )
  })

  it("should error if there are no events", () => {
    expect(duration.bind(duration, { events: [] })).toThrow("Got history with no WorkflowExecutionStarted event")
  })
})
