import http from "http"
import { Worker } from "@temporalio/worker"
import { temporal } from "@temporalio/proto"

export async function run(): Promise<void> {
  const pluginUrl = process.env.TEMPORAL_DEBUGGER_PLUGIN_URL
  if (!pluginUrl) {
    throw new Error("Missing TEMPORAL_DEBUGGER_PLUGIN_URL environment variable")
  }
  const req = http.get(`${pluginUrl}/history`)
  const response = await new Promise<http.IncomingMessage>((resolve, reject) => {
    req.on("error", reject)
    req.on("response", resolve)
  })
  const chunks = Array<Buffer>()
  for await (const chunk of response) {
    chunks.push(chunk)
  }
  const contentLength = response.headers["content-length"]
  if (!contentLength) {
    throw new Error("Empty response body when getting history")
  }
  const body = Buffer.concat(chunks)
  const history = temporal.api.history.v1.History.decode(body, parseInt(contentLength))

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
