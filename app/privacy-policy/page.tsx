'use client';

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <Image
          src="/images/products/wildebeest.jpeg"
          alt="Privacy Policy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl">
            How we protect and handle your personal information
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-2xl font-bold text-amber-600 mb-4">Who we are</h2>
                <p className="mb-6">
                  Our website address is: https://thisisafrica.com.au.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">What personal data we collect and why we collect it</h3>
                
                <h4 className="text-lg font-semibold mt-6 mb-3">Comments</h4>
                <p className="mb-4">
                  When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
                </p>
                <p className="mb-6">
                  An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" className="text-amber-600 hover:text-amber-700 underline" target="_blank" rel="noopener noreferrer">https://automattic.com/privacy/</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Media</h4>
                <p className="mb-6">
                  If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Contact forms</h4>
                <p className="mb-6">
                  When you submit a contact form or booking inquiry, we collect the information you provide to respond to your request and process any booking arrangements.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Cookies</h4>
                <p className="mb-4">
                  If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
                </p>
                <p className="mb-4">
                  If you have an account and you log in to this site, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                </p>
                <p className="mb-4">
                  When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
                </p>
                <p className="mb-6">
                  If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">Embedded content from other websites</h3>
                <p className="mb-4">
                  Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                </p>
                <p className="mb-6">
                  These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracing your interaction with the embedded content if you have an account and are logged in to that website.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">Analytics</h3>
                <p className="mb-6">
                  We use website analytics tools to understand how visitors use our site. This helps us improve our services and user experience. These tools may collect information about your browsing behavior in an anonymized format.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">Who we share your data with</h3>
                <p className="mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy. We may share your information with trusted partners who assist us in operating our website, conducting our business, or serving you, as long as they agree to keep this information confidential.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">How long we retain your data</h3>
                <p className="mb-4">
                  If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                </p>
                <p className="mb-6">
                  For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">What rights you have over your data</h3>
                <p className="mb-6">
                  If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">Where we send your data</h3>
                <p className="mb-6">
                  Visitor comments may be checked through an automated spam detection service.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">Your contact information</h3>
                <p className="mb-6">
                  If you have any questions about this privacy policy or how we handle your personal information, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="mb-2"><strong>This is Africa Pty Ltd</strong></p>
                  <p className="mb-2">Email: info@thisisafrica.com.au</p>
                  <p className="mb-2">Phone: +61 2 9664 9187</p>
                  <p>Address: Australia</p>
                </div>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">Additional information</h3>
                
                <h4 className="text-lg font-semibold mt-6 mb-3">How we protect your data</h4>
                <p className="mb-6">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes secure servers, encryption of sensitive data, and regular security reviews.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">What data breach procedures we have in place</h4>
                <p className="mb-6">
                  In the unlikely event of a data breach, we have procedures in place to respond quickly and appropriately. We will notify affected users and relevant authorities as required by law and take immediate steps to secure the breach and prevent further unauthorized access.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">What third parties we receive data from</h4>
                <p className="mb-6">
                  We may receive data from travel suppliers, booking systems, and payment processors as necessary to fulfill our services. All third parties are required to maintain appropriate privacy and security standards.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">What automated decision making and/or profiling we do with user data</h4>
                <p className="mb-6">
                  We may use automated systems to help prevent spam and fraud, and to improve our services. This may include automated content filtering and basic user behavior analysis for security purposes.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Industry regulatory disclosure requirements</h4>
                <p className="mb-6">
                  As a travel agency, we may be required to share certain information with regulatory bodies, travel insurance providers, or other industry partners as required by law or industry standards to ensure safe and compliant travel arrangements.
                </p>

                <p className="mb-6 text-sm text-gray-600">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Back to Top Button */}
              <div className="mt-12 text-center">
                <Link 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="inline-flex items-center text-amber-600 hover:text-amber-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 rotate-90" />
                  Back to Top
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}