import { Worker } from "@temporalio/worker"

export async function run(): Promise<void> {
  const history = undefined

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
