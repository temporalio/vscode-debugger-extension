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
    app.get("/history", (_req, res) => {
      const { currentHistoryBuffer } = HistoryDebuggerPanel.instance
      if (!currentHistoryBuffer) {
        res.writeHead(404).end({ error: "No current history available" })
        return
      }
      res.end(currentHistoryBuffer)
    })
    app.post("/current-wft-started", async (req, res) => {
      if (!(typeof req.body === "object" && typeof req.body.eventId === "number")) {
        res.writeHead(400).end({ error: "Bad request" })
        return
      }
      const { eventId } = req.body
      try {
        await HistoryDebuggerPanel.instance.updateCurrentWFTStarted(eventId)
      } catch (error) {
        res.writeHead(500).end({ error: `${error}` })
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
