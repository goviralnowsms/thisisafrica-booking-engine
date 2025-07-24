import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4 mx-auto" />
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
