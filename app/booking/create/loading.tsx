import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mr-3" />
              <span className="text-lg">Loading booking form...</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
