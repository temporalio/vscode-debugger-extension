// import * as path from "path"
// import * as vscode from "vscode"

// import { WebSocket } from "ws"
// import got from "got"
// import { temporal } from "@temporalio/proto"
// import { webSocket } from "rxjs/webSocket"
// import { lastValueFrom } from "rxjs"
// import { tap } from "rxjs/operators"

// export class startExtension{
//     protected currentEvent = -1
//     protected history?: temporal.api.history.v1.IHistory
    

//     async startDebugging() {
//         let buff
//         for (;;) {
//         try {
//             buff = await got("http://localhost:8888/history").buffer()
//             break
//         } catch (err) {
//             await new Promise((resolve) => setTimeout(resolve, 500))
//         }
//         }
//         this.startListening()

//         this.history = temporal.api.history.v1.History.decodeDelimited(buff)
//     }

//     async startListening() {
//         const ws = webSocket({ url: "ws://localhost:8888/ws", WebSocketCtor: WebSocket })
//         await lastValueFrom(
//         ws.pipe(
//             tap((message: any) => {
//             this.currentEvent = message.last_processed_event
//             this.history
//             }),
//         ),
//         ).catch((err) => {
//         // TODO: don't catch
//         console.error(err)
//         })
//     }

    
// }



