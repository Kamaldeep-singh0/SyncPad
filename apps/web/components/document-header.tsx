"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share, MoreHorizontal } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface DocumentHeaderProps {
  documentId: string
}

export function DocumentHeader({ documentId }: DocumentHeaderProps) {
  const [document, setDocument] = useState<any>(null)
  const authService = AuthService.getInstance()

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
        }
      } catch (error) {
        console.error("Failed to load document:", error)
      }
    }

    loadDocument()
  }, [documentId])

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <h2 className="text-lg font-semibold text-foreground">{document?.title || "Loading..."}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View history</DropdownMenuItem>
                <DropdownMenuItem>Export document</DropdownMenuItem>
                <DropdownMenuItem>Document settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
