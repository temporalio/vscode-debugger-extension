import { temporal } from "@temporalio/proto"
import { Worker } from "@temporalio/worker"
import http from "node:http"

export async function run(): Promise<void> {
  const request = http.get(`${process.env.TEMPORAL_DEBUGGER_PLUGIN_URL}/history`)
  const chunks = new Array<Buffer>()
  const response = await new Promise<http.IncomingMessage>((resolve, reject) => {
    request.on("response", resolve)
    request.on("error", reject)
  })

  for await (const chunk of response) {
    chunks.push(chunk)
  }
  const buffer = Buffer.concat(chunks)

  const history = temporal.api.history.v1.History.decodeDelimited(buffer)

  // @@@SNIPSTART typescript-history-get-workflowhistory
  await Worker.runReplayHistory(
    {
      workflowsPath: require.resolve("./workflows"),
      replayName: "calc",
    },
    history,
  )
  // @@@SNIPEND
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
