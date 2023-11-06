import { expect, describe, it, vi } from "vitest"
import { getBaseConfiguration } from "./get-base-configuration"
import * as moduleType from "./is-esm"

vi.mock("./is-esm", async () => ({
  isESM: vi.fn().mockResolvedValue(false),
}))

describe("getBaseConfiguration", () => {
  it("returns the correct configuration for environments", async () => {
    const { runtimeArgs } = await getBaseConfiguration()

    expect(runtimeArgs).toEqual(["--nolazy", "-r", "ts-node/register/transpile-only"])
  })

  it("returns the correct configuration for ESM environments", async () => {
    vi.mocked(moduleType).isESM.mockResolvedValueOnce(true)
    const { runtimeArgs } = await getBaseConfiguration()

    expect(runtimeArgs).toEqual(["--loader=ts-node/esm"])
  })
})
