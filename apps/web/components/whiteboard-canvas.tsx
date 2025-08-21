"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { AuthService } from "@/lib/auth"
import { WhiteboardSocket } from "@/lib/whiteboard-socket"
import { WhiteboardToolbar } from "@/components/whiteboard-toolbar"
import { useToast } from "@/hooks/use-toast"

interface WhiteboardCanvasProps {
  whiteboardId: string
}

interface DrawEvent {
  type: "draw" | "move" | "end"
  x: number
  y: number
  tool: string
  color: string
  size: number
  userId: string
}

interface StickyNote {
  id: string
  x: number
  y: number
  text: string
  color: string
  userId: string
}

interface Whiteboard {
  id: string
  title: string
  workspaceId: string
  drawingData: string
  notes: StickyNote[]
}

export function WhiteboardCanvas({ whiteboardId }: WhiteboardCanvasProps) {
  const [whiteboard, setWhiteboard] = useState<Whiteboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [currentTool, setCurrentTool] = useState("pen")
  const [currentColor, setCurrentColor] = useState("#000000")
  const [currentSize, setCurrentSize] = useState(2)
  const [isDrawing, setIsDrawing] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const socketRef = useRef<WhiteboardSocket | null>(null)
  const authService = AuthService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    const loadWhiteboard = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        const response = await fetch(`${backendUrl}/api/whiteboards/${whiteboardId}`, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        })

        if (response.ok) {
          const board = await response.json()
          setWhiteboard(board)
          setStickyNotes(board.notes || [])

          // Load existing drawing data
          if (board.drawingData && canvasRef.current) {
            const img = new Image()
            img.onload = () => {
              const ctx = canvasRef.current?.getContext("2d")
              if (ctx) {
                ctx.drawImage(img, 0, 0)
              }
            }
            img.src = board.drawingData
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load whiteboard",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Network error loading whiteboard",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadWhiteboard()
  }, [whiteboardId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set up canvas
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const context = canvas.getContext("2d")
    if (!context) return

    context.lineCap = "round"
    context.strokeStyle = currentColor
    context.lineWidth = currentSize
    contextRef.current = context
  }, [currentColor, currentSize])

  useEffect(() => {
    if (!whiteboard) return

    // Initialize Socket.IO connection for real-time collaboration
    socketRef.current = new WhiteboardSocket(whiteboardId, authService.getToken()!)

    socketRef.current.on("connect", () => {
      setConnected(true)
      console.log("[v0] Connected to whiteboard collaboration")
    })

    socketRef.current.on("disconnect", () => {
      setConnected(false)
      console.log("[v0] Disconnected from whiteboard collaboration")
    })

    socketRef.current.on("draw-event", (data: DrawEvent) => {
      handleRemoteDrawEvent(data)
    })

    socketRef.current.on("add-note", (note: StickyNote) => {
      setStickyNotes((prev) => [...prev, note])
    })

    socketRef.current.on("move-element", (data: { elementId: string; newPosition: { x: number; y: number } }) => {
      setStickyNotes((prev) =>
        prev.map((note) =>
          note.id === data.elementId ? { ...note, x: data.newPosition.x, y: data.newPosition.y } : note,
        ),
      )
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [whiteboard, whiteboardId])

  const handleRemoteDrawEvent = (event: DrawEvent) => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    context.strokeStyle = event.color
    context.lineWidth = event.size

    if (event.type === "draw") {
      context.lineTo(event.x, event.y)
      context.stroke()
      context.beginPath()
      context.moveTo(event.x, event.y)
    } else if (event.type === "end") {
      context.beginPath()
    }
  }

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (currentTool !== "pen") return

      const canvas = canvasRef.current
      const context = contextRef.current
      if (!canvas || !context) return

      setIsDrawing(true)

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      context.beginPath()
      context.moveTo(x, y)

      // Emit draw event to other users
      if (socketRef.current && connected) {
        socketRef.current.emit("draw-event", {
          type: "draw",
          x,
          y,
          tool: currentTool,
          color: currentColor,
          size: currentSize,
        })
      }
    },
    [currentTool, currentColor, currentSize, connected],
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || currentTool !== "pen") return

      const canvas = canvasRef.current
      const context = contextRef.current
      if (!canvas || !context) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      context.lineTo(x, y)
      context.stroke()
      context.beginPath()
      context.moveTo(x, y)

      // Emit draw event to other users
      if (socketRef.current && connected) {
        socketRef.current.emit("draw-event", {
          type: "move",
          x,
          y,
          tool: currentTool,
          color: currentColor,
          size: currentSize,
        })
      }
    },
    [isDrawing, currentTool, currentColor, currentSize, connected],
  )

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return

    setIsDrawing(false)

    const context = contextRef.current
    if (context) {
      context.beginPath()
    }

    // Emit end draw event
    if (socketRef.current && connected) {
      socketRef.current.emit("draw-event", {
        type: "end",
        x: 0,
        y: 0,
        tool: currentTool,
        color: currentColor,
        size: currentSize,
      })
    }
  }, [isDrawing, currentTool, currentColor, currentSize, connected])

  const addStickyNote = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (currentTool !== "note") return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newNote: StickyNote = {
        id: `note-${Date.now()}`,
        x,
        y,
        text: "New note",
        color: "#fef08a",
        userId: "current-user",
      }

      setStickyNotes((prev) => [...prev, newNote])

      // Emit add note event
      if (socketRef.current && connected) {
        socketRef.current.emit("add-note", newNote)
      }
    },
    [currentTool, connected],
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (currentTool === "note") {
        addStickyNote(e)
      }
    },
    [currentTool, addStickyNote],
  )

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    setStickyNotes([])
  }

  const saveWhiteboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const drawingData = canvas.toDataURL()

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/whiteboards/${whiteboardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          drawingData,
          notes: stickyNotes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Whiteboard saved successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save whiteboard",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error saving whiteboard",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <WhiteboardToolbar
        currentTool={currentTool}
        currentColor={currentColor}
        currentSize={currentSize}
        onToolChange={setCurrentTool}
        onColorChange={setCurrentColor}
        onSizeChange={setCurrentSize}
        onClear={clearCanvas}
        onSave={saveWhiteboard}
        connected={connected}
      />

      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleCanvasClick}
        />

        {/* Sticky Notes */}
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            className="absolute w-32 h-32 p-2 text-xs rounded shadow-md cursor-move"
            style={{
              left: note.x,
              top: note.y,
              backgroundColor: note.color,
            }}
          >
            <textarea
              className="w-full h-full bg-transparent border-none resize-none outline-none"
              defaultValue={note.text}
              onChange={(e) => {
                setStickyNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, text: e.target.value } : n)))
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
