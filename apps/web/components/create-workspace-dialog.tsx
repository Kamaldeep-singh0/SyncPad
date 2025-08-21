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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/auth"
import { Plus } from "lucide-react"

export function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const authService = AuthService.getInstance()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      const token = authService.getToken()
      console.log("[v0] Token exists:", !!token)
      console.log("[v0] Is authenticated:", authService.isAuthenticated())

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a workspace",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      console.log("[v0] Making request to:", `${backendUrl}/api/workspace`)

      const response = await fetch(`${backendUrl}/api/workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (response.ok) {
        toast({
          title: "Success",
          description: "Workspace created successfully",
        })
        setOpen(false)
        // Refresh the page to show the new workspace
        window.location.reload()
      } else {
        if (response.status === 401) {
          toast({
            title: "Authentication Failed",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          })
          authService.logout()
        } else {
          const data = await response.json().catch(() => ({ message: "Unknown error" }))
          toast({
            title: "Error",
            description: data.message || `Failed to create workspace (${response.status})`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("[v0] Network error:", error)
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to collaborate with your team on documents and whiteboards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input id="name" name="name" placeholder="Enter workspace name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe your workspace (optional)" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
