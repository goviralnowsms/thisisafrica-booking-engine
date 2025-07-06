import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              This is Africa
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link href="/tours" className="text-gray-700 hover:text-orange-500 transition-colors">
              Tours
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-500 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
