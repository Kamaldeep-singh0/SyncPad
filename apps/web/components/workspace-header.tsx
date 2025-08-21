"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AuthService } from "@/lib/auth"
import Link from "next/link"

interface WorkspaceHeaderProps {
  workspaceId: string
}

export function WorkspaceHeader({ workspaceId }: WorkspaceHeaderProps) {
  const [workspace, setWorkspace] = useState<any>(null)
  const authService = AuthService.getInstance()

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}`, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setWorkspace(data)
        }
      } catch (error) {
        console.error("Failed to load workspace:", error)
      }
    }

    loadWorkspace()
  }, [workspaceId])

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
            <h2 className="text-lg font-semibold text-foreground">{workspace?.name || "Loading..."} - Team</h2>
          </div>
        </div>
      </div>
    </header>
  )
}
