import { DashboardHeader } from "@/components/dashboard-header"
import { WorkspaceGrid } from "@/components/workspace-grid"
import { RecentActivity } from "@/components/recent-activity"
import { CreateWorkspaceDialog } from "@/components/create-workspace-dialog"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your workspaces and collaborate with your team</p>
          </div>
          <CreateWorkspaceDialog />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WorkspaceGrid />
          </div>
          <div>
           
          </div>
        </div>
      </main>
    </div>
  )
}
