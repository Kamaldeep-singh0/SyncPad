import { io, type Socket } from "socket.io-client"

export class DocumentSocket {
  private socket: Socket
  private documentId: string

  constructor(documentId: string, token: string) {
    this.documentId = documentId
    this.socket = io("/collab", {
      auth: {
        token,
      },
    })

    this.socket.emit("join-document", { documentId })
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

  updateCursor(position: { x: number; y: number }) {
    this.socket.emit("cursor-update", {
      documentId: this.documentId,
      position,
    })
  }
}
