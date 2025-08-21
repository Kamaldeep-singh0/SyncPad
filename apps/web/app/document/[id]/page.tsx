import { DocumentEditor } from "@/components/document-editor"
import { DocumentHeader } from "@/components/document-header"

interface DocumentPageProps {
  params: {
    id: string
  }
}

export default function DocumentPage({ params }: DocumentPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <DocumentHeader documentId={params.id} />
      <DocumentEditor documentId={params.id} />
    </div>
  )
}
