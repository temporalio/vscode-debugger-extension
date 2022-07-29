import * as http from "node:http"
import * as util from "node:util"

await util
  .promisify(http.get)("http://localhost:55666")
  .catch(() => {
    // ignore
  })
