import * as http from "node:http"
import * as util from "node:util"

await util
  .promisify(http.get)("http://127.0.0.1:55666")
  .catch(() => {
    // ignore
  })
