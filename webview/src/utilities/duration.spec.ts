import "mocha"
import { assert } from "chai"
import { duration } from "./duration"
import { historyFromJSON } from "@temporalio/common/lib/proto-utils"
import completedEvents from "../../../samples/events.completed.json"

describe("duration", () => {
  it("should format the duration between the workflow started event and the final event", () => {
    assert.equal(duration(historyFromJSON(completedEvents)), "4.12 seconds")
  })

  it("should error if there is no workflow started event", () => {
    const eventsWithoutWorkflowStarted = { events: completedEvents.events.slice(1) }
    assert.throws(
      duration.bind(duration, historyFromJSON(eventsWithoutWorkflowStarted)),
      "Got history with no WorkflowExecutionStarted event",
    )
  })

  it("should error if there are no events", () => {
    assert.throws(duration.bind(duration, { events: [] }), "Got history with no WorkflowExecutionStarted event")
  })
})
