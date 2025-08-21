import { WhiteboardCanvas } from "@/components/whiteboard-canvas"
import { WhiteboardHeader } from "@/components/whiteboard-header"

interface WhiteboardPageProps {
  params: {
    id: string
  }
}

export default function WhiteboardPage({ params }: WhiteboardPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <WhiteboardHeader whiteboardId={params.id} />
      <WhiteboardCanvas whiteboardId={params.id} />
    </div>
  )
}
