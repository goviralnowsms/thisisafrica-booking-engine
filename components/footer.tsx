export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-4">This is Africa</h3>
            <p className="text-gray-300">Your gateway to authentic African experiences and unforgettable adventures.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/" className="hover:text-orange-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/tours" className="hover:text-orange-500 transition-colors">
                  Tours
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-orange-500 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Kenya
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Tanzania
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  South Africa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Botswana
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="text-gray-300 space-y-2">
              <p>Email: info@thisisafrica.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Safari Street, Adventure City</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 This is Africa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
