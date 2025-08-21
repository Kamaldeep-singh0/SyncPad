import { TeamManagement } from "@/components/team-management"
import { WorkspaceHeader } from "@/components/workspace-header"

interface TeamPageProps {
  params: {
    id: string
  }
}

export default function TeamPage({ params }: TeamPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <WorkspaceHeader workspaceId={params.id} />
      <div className="container mx-auto px-4 py-8">
        <TeamManagement workspaceId={params.id} />
      </div>
    </div>
  )
}
