"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InviteMemberDialog } from "@/components/invite-member-dialog"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Crown, Edit, Eye, MoreHorizontal, Mail, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
  joinedAt: string
  avatar?: string
}

interface PendingInvite {
  id: string
  email: string
  role: "owner" | "editor" | "viewer"
  invitedBy: string
  invitedAt: string
  status: "pending" | "accepted" | "expired"
}

interface TeamManagementProps {
  workspaceId: string
}

export function TeamManagement({ workspaceId }: TeamManagementProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserRole, setCurrentUserRole] = useState<string>("viewer")
  const authService = AuthService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        const [membersResponse, invitesResponse] = await Promise.all([
          fetch(`${backendUrl}/api/workspaces/${workspaceId}/members`, {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`,
            },
          }),
          fetch(`${backendUrl}/api/workspaces/${workspaceId}/invites`, {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`,
            },
          }),
        ])

        if (membersResponse.ok) {
          const membersData = await membersResponse.json()
          setMembers(membersData.members || [])
          setCurrentUserRole(membersData.currentUserRole || "viewer")
        }

        if (invitesResponse.ok) {
          const invitesData = await invitesResponse.json()
          setPendingInvites(invitesData || [])
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load team data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [workspaceId])

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({ memberId, role: newRole }),
      })

      if (response.ok) {
        setMembers((prev) =>
          prev.map((member) => (member.id === memberId ? { ...member, role: newRole as any } : member)),
        )
        toast({
          title: "Success",
          description: "Member role updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update member role",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error updating role",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      })

      if (response.ok) {
        setMembers((prev) => prev.filter((member) => member.id !== memberId))
        toast({
          title: "Success",
          description: "Member removed successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to remove member",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error removing member",
        variant: "destructive",
      })
    }
  }

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}/invites/${inviteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      })

      if (response.ok) {
        setPendingInvites((prev) => prev.filter((invite) => invite.id !== inviteId))
        toast({
          title: "Success",
          description: "Invitation cancelled",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to cancel invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error cancelling invitation",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  const canManageMembers = currentUserRole === "owner" || currentUserRole === "editor"

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage workspace members and permissions</p>
        </div>
        {canManageMembers && <InviteMemberDialog workspaceId={workspaceId} />}
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Team Members</span>
            <Badge variant="secondary">{members.length}</Badge>
          </CardTitle>
          <CardDescription>People who have access to this workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canManageMembers && member.role !== "owner" ? (
                    <Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">
                          <div className="flex items-center space-x-2">
                            <Edit className="h-4 w-4" />
                            <span>Editor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>Viewer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </div>
                    </Badge>
                  )}

                  {canManageMembers && member.role !== "owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRemoveMember(member.id)}>
                          Remove from workspace
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Pending Invitations</span>
              <Badge variant="secondary">{pendingInvites.length}</Badge>
            </CardTitle>
            <CardDescription>Invitations that haven't been accepted yet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invite.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited {new Date(invite.invitedAt).toLocaleDateString()} by {invite.invitedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleBadgeVariant(invite.role)}>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(invite.role)}
                        <span className="capitalize">{invite.role}</span>
                      </div>
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>

                    {canManageMembers && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Resend invitation</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCancelInvite(invite.id)}>
                            Cancel invitation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
