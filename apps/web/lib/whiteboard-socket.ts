import { io, type Socket } from "socket.io-client"

export class WhiteboardSocket {
  private socket: Socket
  private whiteboardId: string

  constructor(whiteboardId: string, token: string) {
    this.whiteboardId = whiteboardId
    this.socket = io("/collab", {
      auth: {
        token,
      },
    })

    this.socket.emit("join-whiteboard", { whiteboardId })
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback)
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data)
  }

  disconnect() {
    this.socket.disconnect()
  }
}
