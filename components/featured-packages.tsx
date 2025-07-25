import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users } from "lucide-react"

export function FeaturedPackages() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative h-48">
          <Image
            src="/images/safari-lion.png"
            alt="Safari experience with lion and vehicle"
            fill
            className="object-cover"
          />
          <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600">All Inclusive</Badge>
        </div>
        <CardHeader>
          <CardTitle>Luxury Safari Experience</CardTitle>
          <CardDescription>10 days of ultimate African adventure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-amber-500" />
              <span>Kenya & Tanzania</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              <span>10 Days / 9 Nights</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-amber-500" />
              <span>Max 8 travelers</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-xl font-bold">$3,499</p>
            </div>
            <div className="flex items-center">
              <div className="flex">
                <span className="sr-only">4.8 out of 5 stars</span>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "text-amber-500" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">48 reviews</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-amber-500 hover:bg-amber-600">View Details</Button>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative h-48">
          <Image src="/placeholder.svg?height=300&width=500" alt="Zambezi River Cruise" fill className="object-cover" />
          <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">Honeymoon</Badge>
        </div>
        <CardHeader>
          <CardTitle>Zambezi Queen River Cruise</CardTitle>
          <CardDescription>Luxury river safari on the Chobe River</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-amber-500" />
              <span>Botswana & Namibia</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              <span>4 Days / 3 Nights</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-amber-500" />
              <span>Max 28 guests</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-xl font-bold">$2,150</p>
            </div>
            <div className="flex items-center">
              <div className="flex">
                <span className="sr-only">5 out of 5 stars</span>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">36 reviews</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-amber-500 hover:bg-amber-600">View Details</Button>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative h-48">
          <Image src="/placeholder.svg?height=300&width=500" alt="Victoria Falls" fill className="object-cover" />
          <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600">Fly-in Safari</Badge>
        </div>
        <CardHeader>
          <CardTitle>Victoria Falls Adventure</CardTitle>
          <CardDescription>Experience the smoke that thunders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-amber-500" />
              <span>Zimbabwe & Zambia</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              <span>7 Days / 6 Nights</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-amber-500" />
              <span>Max 12 travelers</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-xl font-bold">$2,899</p>
            </div>
            <div className="flex items-center">
              <div className="flex">
                <span className="sr-only">4.9 out of 5 stars</span>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < 5 ? "text-amber-500" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">52 reviews</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-amber-500 hover:bg-amber-600">View Details</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
