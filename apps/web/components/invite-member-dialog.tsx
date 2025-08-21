"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/auth"
import { UserPlus, Copy, Check } from "lucide-react"

interface InviteMemberDialogProps {
  workspaceId: string
}

export function InviteMemberDialog({ workspaceId }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const { toast } = useToast()
  const authService = AuthService.getInstance()

  const handleEmailInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({ email, role }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invitation sent successfully",
        })
        setOpen(false)
        // Refresh the page to show the new invitation
        window.location.reload()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to send invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateInviteLink = async (role: string) => {
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}/invite-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        const data = await response.json()
        setInviteLink(data.inviteLink)
      } else {
        toast({
          title: "Error",
          description: "Failed to generate invite link",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error generating link",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setLinkCopied(true)
      toast({
        title: "Success",
        description: "Invite link copied to clipboard",
      })
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>Add new members to your workspace by email or shareable link.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email Invitation</TabsTrigger>
            <TabsTrigger value="link">Invite Link</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleEmailInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="colleague@company.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="viewer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor - Can edit documents and whiteboards</SelectItem>
                    <SelectItem value="viewer">Viewer - Can view but not edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Role for invited members</Label>
                <Select onValueChange={(value) => generateInviteLink(value)} defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role to generate link" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor - Can edit documents and whiteboards</SelectItem>
                    <SelectItem value="viewer">Viewer - Can view but not edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inviteLink && (
                <div className="space-y-2">
                  <Label>Shareable Link</Label>
                  <div className="flex space-x-2">
                    <Input value={inviteLink} readOnly className="flex-1" />
                    <Button variant="outline" onClick={copyInviteLink}>
                      {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Anyone with this link can join your workspace with the selected role.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
