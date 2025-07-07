export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">This is Africa</h3>
            <p className="text-gray-300 text-sm">
              Your trusted partner for authentic African adventures. Book with confidence using our secure booking
              engine.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Phone: +61 (0) 2 96649187</p>
              <p>Email: info@thisisafrica.com.au</p>
              <p>Business Hours: Mon-Fri 9AM-5PM AEST</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Demo Features</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Real-time tour search & filtering</p>
              <p>• Complete booking process</p>
              <p>• Secure payment simulation</p>
              <p>• Mobile-responsive design</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; 2024 This is Africa. All rights reserved. |
            <span className="text-orange-400 ml-2">Live Demo - Powered by Tourplan API Integration</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
