import { readFile } from "fs/promises"
import { getWorkspacePath } from "./get-workspace-path"
import { join } from "path"

type ModuleType = "commonjs" | "module"

export async function getModuleType(fallback: ModuleType = "commonjs"): Promise<ModuleType> {
  const rootPath = getWorkspacePath()

  if (!rootPath) {
    return fallback
  }

  const packageJsonPath = join(rootPath, "package.json")
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))

  if (packageJson.type === "commonjs") {
    return "commonjs"
  }

  if (packageJson.type === "module") {
    return "module"
  }

  return fallback
}

export const isESM = async (): Promise<boolean> => {
  try {
    return (await getModuleType()) === "module"
  } catch (e) {
    return false
  }
}

export default isESM
