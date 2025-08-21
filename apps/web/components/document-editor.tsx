"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AuthService } from "@/lib/auth"
import { DocumentSocket } from "@/lib/document-socket"
import { UserPresence } from "@/components/user-presence"
import { DocumentToolbar } from "@/components/document-toolbar"
import { Save, FileText, Eye, Edit3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentEditorProps {
  documentId: string
}

interface Document {
  id: string
  title: string
  content: string
  workspaceId: string
  lastModified: string
}

// Simple markdown renderer
const renderMarkdown = (markdown: string): string => {
  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>',
      )
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Line breaks
      .replace(/\n/g, "<br>")
  )
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [document, setDocument] = useState<Document | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connected, setConnected] = useState(false)
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const socketRef = useRef<DocumentSocket | null>(null)
  const authService = AuthService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        const response = await fetch(`${backendUrl}/api/documents/${documentId}`, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        })

        if (response.ok) {
          const doc = await response.json()
          setDocument(doc)
          setContent(doc.content || "")
        } else {
          toast({
            title: "Error",
            description: "Failed to load document",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Network error loading document",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [documentId])

  useEffect(() => {
    if (!document) return

    // Initialize Socket.IO connection for real-time collaboration
    socketRef.current = new DocumentSocket(documentId, authService.getToken()!)

    socketRef.current.on("connect", () => {
      setConnected(true)
      console.log("[v0] Connected to document collaboration")
    })

    socketRef.current.on("disconnect", () => {
      setConnected(false)
      console.log("[v0] Disconnected from document collaboration")
    })

    socketRef.current.on("document-updated", (data: { content: string; userId: string }) => {
      if (data.userId !== authService.getCurrentUser()?.then((u) => u?.id)) {
        setContent(data.content)
        console.log("[v0] Document updated by another user")
      }
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [document, documentId])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    // Emit changes to other users
    if (socketRef.current && connected) {
      socketRef.current.emit("edit-document", {
        documentId,
        content: newContent,
        changes: { type: "content-update", content: newContent },
      })
    }
  }

  const insertMarkdown = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end)

    setContent(newContent)
    handleContentChange(newContent)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/documents/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Document saved successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save document",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error saving document",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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

  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Document not found</h3>
          <p className="text-muted-foreground">
            The document you're looking for doesn't exist or you don't have access to it.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-foreground">{document.title}</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm text-muted-foreground">{connected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "edit" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("edit")}
              className="rounded-r-none"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="rounded-none border-x"
            >
              Split
            </Button>
            <Button
              variant={viewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="rounded-l-none"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <UserPresence documentId={documentId} />
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Card className="min-h-[600px]">
        <DocumentToolbar onInsertMarkdown={insertMarkdown} />

        <div className="flex h-[600px]">
          {(viewMode === "edit" || viewMode === "split") && (
            <div className={`${viewMode === "split" ? "w-1/2" : "w-full"} border-r`}>
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700">Markdown Editor</h3>
              </div>
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="# Start writing your markdown here...

## This is a heading

**Bold text** and *italic text*

- List item 1
- List item 2"
                className="h-full w-full"
              />
            </div>
          )}
          {viewMode === "split" && (
            <div className="w-1/2">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700">Preview</h3>
              </div>
              <div
                className="p-6 prose prose-sm max-w-none focus:outline-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                style={{
                  lineHeight: "1.6",
                  fontSize: "16px",
                }}
              />
            </div>
          )}
          {viewMode === "preview" && (
            <div className="w-full">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700">Preview</h3>
              </div>
              <div
                className="p-6 prose prose-sm max-w-none focus:outline-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                style={{
                  lineHeight: "1.6",
                  fontSize: "16px",
                }}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
