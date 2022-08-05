import { Worker } from "@temporalio/worker"
import { Connection } from "@temporalio/client"
import { temporal } from "@temporalio/proto"

// export let historyBytes: Uint8Array
// const historyData = temporal.api.history.v1.History.decodeDelimited(historyBytes)

export async function run(): Promise<void> {
  console.log(process.env.TEMPORAL_DEBUGGER_PLUGIN_URL)

  const history = undefined
  if (!history) {
    throw new Error("Empty history")
  }
  await Worker.runReplayHistory(
    {
      workflowsPath: require.resolve("./workflows"),
      replayName: "calc",
    },
    history,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
