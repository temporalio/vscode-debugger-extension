import http from "node:http"
import { AddressInfo } from "node:net"
import express from "express"
import { HistoryDebuggerPanel } from "./panel"

async function listen(server: http.Server, port: number, hostname?: string): Promise<http.Server> {
  await new Promise<void>((resolve, reject) => {
    if (hostname) {
      server.listen(port, hostname, resolve)
    } else {
      server.listen(port, resolve)
    }
    server.once("error", reject)
  })
  return server
}

function mustBeAddrInfo(info: string | AddressInfo | null): asserts info is AddressInfo {
  if (info === null) {
    throw new TypeError("Expected AddressInfo got null")
  }
  if (typeof info === "string") {
    throw new TypeError("Expected AddressInfo got a string")
  }
}

export class Server {
  static async create(address = "127.0.0.1", port = 0): Promise<Server> {
    const app = express()
    app.use(express.json())
    app.get("/history", async (_req, res) => {
      try {
        const { currentHistoryBuffer } = await HistoryDebuggerPanel.instance
        if (!currentHistoryBuffer) {
          res.status(404).send({ error: "No current history available" })
          return
        }
        res.end(currentHistoryBuffer)
      } catch (error) {
        res.status(500).send({ error: `${error}` })
      }
    })
    app.post("/current-wft-started", async (req, res) => {
      if (!(typeof req.body === "object" && typeof req.body.eventId === "number")) {
        res.status(400).send({ error: "Bad request" })
        return
      }
      const { eventId } = req.body
      try {
        const instance = await HistoryDebuggerPanel.instance
        await instance.updateCurrentWFTStarted(eventId)
      } catch (error) {
        res.status(500).send({ error: `${error}` })
        return
      }
      res.end()
    })
    const server = new http.Server(app)
    await listen(server, port, address)
    return new this(server)
  }

  constructor(protected readonly server: http.Server) {}

  get url(): string {
    const addr = this.server.address()
    mustBeAddrInfo(addr)
    return `http://${addr.address}:${addr.port}`
  }

  terminate(): void {
    console.log(`Closing server on ${this.url}`)
    this.server.close()
  }
}
