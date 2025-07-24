"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingIntegration } from "@/lib/booking-integration"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void
  className?: string
  category?: string
  redirectToBooking?: boolean
}

interface SearchParams {
  startingCountry: string
  destination: string
  class: string
  category?: string
}

export default function SearchBar({
  onSearch,
  className = "",
  category = "general",
  redirectToBooking = true,
}: SearchBarProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    startingCountry: "",
    destination: "",
    class: "",
    category: category,
  })

  const handleSearch = () => {
    const searchData = {
      ...searchParams,
      category: category,
    }

    if (redirectToBooking) {
      BookingIntegration.handleSearchSubmission(searchData, category)
    } else if (onSearch) {
      onSearch(searchData)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-2 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex flex-col lg:flex-row flex-1 gap-2">
          <div className="flex flex-col lg:flex-row flex-1 gap-2">
            <div className="gradient-orange text-white px-6 py-4 font-semibold h-14 flex items-center justify-center text-sm rounded-xl lg:rounded-l-xl lg:rounded-r-none min-w-[160px]">
              Starting country
            </div>
            <Select
              value={searchParams.startingCountry}
              onValueChange={(value) => setSearchParams((prev) => ({ ...prev, startingCountry: value }))}
            >
              <SelectTrigger className="bg-gray-50 border-0 rounded-xl px-6 min-w-[200px] h-14 text-sm font-medium hover:bg-gray-100 transition-colors">
                <SelectValue placeholder="Botswana" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-2xl">
                <SelectItem value="botswana">Botswana</SelectItem>
                <SelectItem value="south-africa">South Africa</SelectItem>
                <SelectItem value="namibia">Namibia</SelectItem>
                <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                <SelectItem value="kenya">Kenya</SelectItem>
                <SelectItem value="tanzania">Tanzania</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 gap-2">
            <div className="gradient-orange text-white px-6 py-4 font-semibold h-14 flex items-center justify-center text-sm rounded-xl min-w-[160px]">
              Starting destination
            </div>
            <Select
              value={searchParams.destination}
              onValueChange={(value) => setSearchParams((prev) => ({ ...prev, destination: value }))}
            >
              <SelectTrigger className="bg-gray-50 border-0 rounded-xl px-6 min-w-[200px] h-14 text-sm font-medium hover:bg-gray-100 transition-colors">
                <SelectValue placeholder="(Select option)" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-2xl">
                <SelectItem value="chobe">Chobe</SelectItem>
                <SelectItem value="okavango">Okavango Delta</SelectItem>
                <SelectItem value="kalahari">Kalahari</SelectItem>
                <SelectItem value="serengeti">Serengeti</SelectItem>
                <SelectItem value="masai-mara">Masai Mara</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 gap-2">
            <div className="gradient-orange text-white px-6 py-4 font-semibold h-14 flex items-center justify-center text-sm rounded-xl min-w-[120px]">
              Class
            </div>
            <Select
              value={searchParams.class}
              onValueChange={(value) => setSearchParams((prev) => ({ ...prev, class: value }))}
            >
              <SelectTrigger className="bg-gray-50 border-0 rounded-xl px-6 min-w-[200px] h-14 text-sm font-medium hover:bg-gray-100 transition-colors">
                <SelectValue placeholder="(Select option)" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-2xl">
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          className="gradient-orange hover:shadow-lg text-white px-8 rounded-xl font-semibold h-14 flex items-center justify-center text-sm transition-all duration-300 hover:scale-105 min-w-[140px]"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  )
}
