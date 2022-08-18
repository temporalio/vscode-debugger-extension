import type { ReplayWorkerOptions } from "@temporalio/worker"

export const options: ReplayWorkerOptions = {
  workflowsPath: require.resolve("./workflows"),
}
