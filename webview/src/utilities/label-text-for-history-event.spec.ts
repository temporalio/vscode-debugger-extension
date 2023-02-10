import "mocha"
import { assert } from "chai"
import { getWorkflowTasks } from "./get-workflow-tasks"
import { labelTextForHistoryEvent } from "./label-text-for-history-event"
import { historyFromJSON } from "@temporalio/common/lib/proto-utils"
import completedEvents from "../../../samples/events.completed.json"

describe("labelTextForHistoryEvent", () => {
  const workflowTasks = getWorkflowTasks(historyFromJSON(completedEvents))

  it("should error if there is no event type on the event", () => {
    const event = { ...workflowTasks[0].events[0] }
    delete event.eventType

    assert.throws(
      labelTextForHistoryEvent.bind(labelTextForHistoryEvent, event),
      "Expected history event `eventType` to be defined",
    )
  })

  it("should format the event type name with the workflow type name for a WorkflowExecutionStarted event", () => {
    const workflowExecutionStartedEvent = workflowTasks[0].events[0]
    assert.equal(
      labelTextForHistoryEvent(workflowExecutionStartedEvent),
      "WorkflowExecutionStarted (workflow.completion)",
    )
  })
})
