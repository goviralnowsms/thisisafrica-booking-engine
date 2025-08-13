import { Loader2 } from "lucide-react"

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-amber-500 animate-spin mx-auto mb-4" />
        <p className="text-lg text-gray-600">Preparing search results...</p>
      </div>
    </div>
  )
}