"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share, MoreHorizontal } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface WhiteboardHeaderProps {
  whiteboardId: string
}

export function WhiteboardHeader({ whiteboardId }: WhiteboardHeaderProps) {
  const [whiteboard, setWhiteboard] = useState<any>(null)
  const authService = AuthService.getInstance()

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
        }
      } catch (error) {
        console.error("Failed to load whiteboard:", error)
      }
    }

    loadWhiteboard()
  }, [whiteboardId])

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
            <h2 className="text-lg font-semibold text-foreground">{whiteboard?.title || "Loading..."}</h2>
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
                <DropdownMenuItem>Export as image</DropdownMenuItem>
                <DropdownMenuItem>Whiteboard settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
