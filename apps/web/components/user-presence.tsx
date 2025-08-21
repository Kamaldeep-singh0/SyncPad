"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"

interface UserPresenceProps {
  documentId: string
}

interface PresenceUser {
  id: string
  name: string
  email: string
  cursor?: { x: number; y: number }
}

export function UserPresence({ documentId }: UserPresenceProps) {
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([])
  const authService = AuthService.getInstance()

  useEffect(() => {
    // Mock active users for now - in real implementation, this would come from Socket.IO
    const mockUsers: PresenceUser[] = [
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
    ]
    setActiveUsers(mockUsers)
  }, [documentId])

  if (activeUsers.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
            <AvatarImage src="/placeholder.svg" alt={user.name} />
            <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      {activeUsers.length > 3 && (
        <Badge variant="secondary" className="text-xs">
          +{activeUsers.length - 3}
        </Badge>
      )}
      <span className="text-sm text-muted-foreground">{activeUsers.length} active</span>
    </div>
  )
}
