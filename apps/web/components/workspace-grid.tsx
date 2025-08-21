"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"
import { Users, FileText, Palette, MoreHorizontal, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Workspace {
  id: string
  name: string
  description: string
  memberCount: number
  documentCount: number
  whiteboardCount: number
  role: "owner" | "editor" | "viewer"
  createdAt: string
}

export function WorkspaceGrid() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authService = AuthService.getInstance()

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        console.log("[v0] Attempting to fetch workspaces from:", `${backendUrl}/api/workspaces`)

        const response = await fetch(`${backendUrl}/api/workspaces`, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
            "Content-Type": "application/json",
          },
        })

        console.log("[v0] Workspace fetch response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Workspaces data received:", data)
          const workspacesArray = Array.isArray(data) ? data : data?.workspaces || []
          setWorkspaces(workspacesArray)
          setError(null)
        } else {
          const errorText = await response.text()
          console.log("[v0] Workspace fetch error response:", errorText)

          if (response.status === 401) {
            setError("Authentication failed. Please log in again.")
            authService.logout()
          } else {
            setError(`Failed to load workspaces (${response.status})`)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch workspaces:", error)
        const demoWorkspaces: Workspace[] = [
          {
            id: "demo-1",
            name: "Demo Project",
            description: "This is demo data - backend not connected",
            memberCount: 3,
            documentCount: 5,
            whiteboardCount: 2,
            role: "owner",
            createdAt: new Date().toISOString(),
          },
        ]
        setWorkspaces(demoWorkspaces)
        setError(
          `Backend connection failed. Showing demo data. Backend URL: ${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}`,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Your Workspaces</h2>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Connection Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Your Workspaces</h2>
      </div>

      {workspaces.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No workspaces yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first workspace to start collaborating with your team.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(workspaces) &&
            workspaces.map((workspace) => (
              <Card key={workspace.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
                    <CardDescription className="mt-1">{workspace.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={workspace.role === "owner" ? "default" : "secondary"}>{workspace.role}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open workspace</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/workspace/${workspace.id}/team`}>Manage team</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{workspace.memberCount} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{workspace.documentCount} docs</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Palette className="h-4 w-4" />
                        <span>{workspace.whiteboardCount} boards</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
