"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService } from "@/lib/auth"
import { FileText, Palette, Users, Clock } from "lucide-react"

interface ActivityItem {
  id: string
  type: "document" | "whiteboard" | "workspace" | "invite"
  title: string
  workspace: string
  user: string
  timestamp: string
  action: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authService = AuthService.getInstance()

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        console.log("[v0] Attempting to fetch activity from:", `${backendUrl}/api/dashboard`)

        const response = await fetch(`${backendUrl}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
            "Content-Type": "application/json",
          },
        })

        console.log("[v0] Activity fetch response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Activity data received:", data)
          setActivities(data.recentActivity || [])
          setError(null)
        } else {
          const errorText = await response.text()
          console.log("[v0] Activity fetch error response:", errorText)
          setError(`Failed to load activity (${response.status})`)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch recent activity:", error)
        const demoActivities: ActivityItem[] = [
          {
            id: "demo-1",
            type: "document",
            title: "Demo Document",
            workspace: "Demo Project",
            user: "Demo User",
            timestamp: new Date().toISOString(),
            action: "created",
          },
          {
            id: "demo-2",
            type: "whiteboard",
            title: "Demo Whiteboard",
            workspace: "Demo Project",
            user: "Demo User",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            action: "edited",
          },
        ]
        setActivities(demoActivities)
        setError(`Backend connection failed. Showing demo data.`)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "whiteboard":
        return <Palette className="h-4 w-4" />
      case "workspace":
        return <Users className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800"
      case "whiteboard":
        return "bg-purple-100 text-purple-800"
      case "workspace":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        {error && <p className="text-xs text-muted-foreground text-orange-600">{error}</p>}
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getTypeColor(activity.type)}`}>{getIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.action} by {activity.user} in {activity.workspace}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
