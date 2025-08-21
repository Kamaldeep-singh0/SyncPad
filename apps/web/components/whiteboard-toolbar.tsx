"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Pen, Square, Circle, StickyNote, Eraser, Save, Trash2, Minus, Plus } from "lucide-react"

interface WhiteboardToolbarProps {
  currentTool: string
  currentColor: string
  currentSize: number
  onToolChange: (tool: string) => void
  onColorChange: (color: string) => void
  onSizeChange: (size: number) => void
  onClear: () => void
  onSave: () => void
  connected: boolean
}

const colors = ["#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]

export function WhiteboardToolbar({
  currentTool,
  currentColor,
  currentSize,
  onToolChange,
  onColorChange,
  onSizeChange,
  onClear,
  onSave,
  connected,
}: WhiteboardToolbarProps) {
  return (
    <div className="border-b border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-1">
            <Button
              variant={currentTool === "pen" ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange("pen")}
              className="h-8 w-8 p-0"
            >
              <Pen className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "rectangle" ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange("rectangle")}
              className="h-8 w-8 p-0"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "circle" ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange("circle")}
              className="h-8 w-8 p-0"
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "note" ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange("note")}
              className="h-8 w-8 p-0"
            >
              <StickyNote className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "eraser" ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange("eraser")}
              className="h-8 w-8 p-0"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Colors */}
          <div className="flex items-center space-x-1">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${
                  currentColor === color ? "border-foreground" : "border-border"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              />
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Brush Size */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSizeChange(Math.max(1, currentSize - 1))}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{currentSize}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSizeChange(Math.min(20, currentSize + 1))}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm text-muted-foreground">{connected ? "Connected" : "Disconnected"}</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
