import "mocha"
import { assert } from "chai"
import { getWorkflowTasks } from "./get-workflow-tasks"
import { historyFromJSON } from "@temporalio/common/lib/proto-utils"
import completedEvents from "../../../samples/events.completed.json"

describe("getWorkflowTasks", () => {
  it("should return an empty array if there are no events", () => {
    assert.deepEqual(getWorkflowTasks(historyFromJSON({ events: [] })), [])
  })

  it("should return status COMPLETED and hasBreakpoint set to true if the eventType is WorkflowTaskCompleted", () => {
    const completedEvent = completedEvents.events[16]
    assert.deepEqual(getWorkflowTasks(historyFromJSON({ events: [completedEvent] })), [
      { events: [], status: "COMPLETED", hasBreakpoint: true },
    ])
  })

  it("should return hasBreakpoint set to false if there has already been a WorkflowTaskCompleted event", () => {
    const events = [completedEvents.events[16], completedEvents.events[16]]
    assert.equal(getWorkflowTasks(historyFromJSON({ events }))[1].hasBreakpoint, false)
  })

  it("should return a startedEventId if there is a WorkflowTaskStarted event", () => {
    const workflowTaskStartedEvent = completedEvents.events.find((e) => e.eventType === "WorkflowTaskStarted")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.equal(getWorkflowTasks(historyFromJSON(completedEvents))[0].startedEventId, workflowTaskStartedEvent.eventId)
  })
})
