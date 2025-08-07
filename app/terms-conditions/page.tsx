import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <Image
          src="/images/products/terms-conditions-hero.jpg"
          alt="Terms and Conditions"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl">
            Booking Terms & Conditions for This is Africa
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Terms & Conditions</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-2xl font-bold text-amber-600 mb-4">BOOKING TERMS & CONDITIONS</h2>
                <p className="mb-6">
                  These Booking Conditions set out the terms on which you contract with us for the arrangement and delivery of travel arrangements for your trip. By making a booking with us, you acknowledge that you have read, understood and agree to be bound by these Booking Conditions. We reserve the right to change these Booking Conditions at any time prior to you making a booking request. "You" and "Your" means all persons named in a booking (including anyone who is added or substituted at a later date). "We", "us", "our" and This is Africa means This is Africa Pty Ltd.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">BOOKINGS</h3>
                <p className="mb-6">
                  A booking request is accepted when we issue a written booking confirmation and you have paid your deposit. It is at this point that a contract between us and you comes into existence subject to these Booking Conditions. We reserve the right to decline any booking at our discretion. No employee of ours other than a director has the authority to vary or omit any of these Booking Conditions or to promise any discount, refund or credit.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">SERVICES</h3>
                <p className="mb-6">
                  The services we provide to you are limited to (a) the arrangement and coordination of your travel arrangements; and (b) the delivery of travel arrangements which we directly control. This includes (often significant) work undertaken prior to travel to arrange and coordinate the delivery of your travel arrangements.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">PRICES & EXCLUSIONS</h3>
                <p className="mb-4">
                  Prices stated are in Australian Dollars ($AUD), unless stated otherwise and are current at the time of publication. The price includes accommodation, transportation and other inclusions as per the published itinerary.
                </p>
                <p className="mb-6">
                  International and domestic airfares and airport/hotel transfers are not included unless specifically stated. Costs associated with passports, visas, vaccinations, insurance, meals (other than those stipulated), emergency evacuation costs, gratuities, and all items of a personal nature are not included.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">PRICE SURCHARGES</h3>
                <p className="mb-4">
                  We reserve the right to surcharge the cost of your booked travel arrangements prior to commencement for circumstances beyond our control such as currency devaluation, fuel or air fare surcharges, or the imposition of new or amended Government charges.
                </p>
                <p className="mb-6">
                  We will not surcharge for currency fluctuations once full payment has been received by us.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">DEPOSIT</h3>
                <p className="mb-4">
                  A 30% deposit per person, or a specified amount as per invoice, is required within 7 days (unless otherwise stated) of us accepting your booking. The deposit represents a fee payable to us for services associated with the processing and confirmation of your booking and any consultations on travel arrangements that we may provide to you. Because these services are provided as soon as we confirm your booking, the deposit is non-refundable other than where we cancel your travel arrangements for reasons other than Force Majeure (see below).
                </p>
                <p className="mb-6">
                  Please note that we may not hold any services for you until we receive payment of your deposit, meaning that services may become unavailable or prices may increase, in which case you will be responsible for paying the increased price, and we will not be responsible if services become unavailable.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">FINAL PAYMENT</h3>
                <p className="mb-4">
                  Payment in full must be received by the date(s) reflected on your invoice OR no less than 60 days before commencement of your trip. We are under no obligation to remind you of a payment becoming due. If we fail to receive a payment from you by the due date for payment in clear funds, then this will be deemed a cancellation by you (see below). Note: some trips may require payment (including full payment) earlier or in additional instalments and this will be advised with the booking confirmation.
                </p>
                <p className="mb-6">
                  For late bookings (bookings within 60 days of departure), full payment is required at the time of request. You acknowledge that we may not be able to confirm services, in which case we will provide you with a refund.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">CANCELLATIONS BY YOU</h3>
                
                <h4 className="text-lg font-semibold mt-6 mb-3">Covid-19 credit redemptions</h4>
                <p className="mb-4">
                  If: (a) we issued you with a credit due to your original travel arrangements being disrupted by Covid-19 and associated restrictions; and (b) you have redeemed that credit for new travel arrangements; then (c) you agree that we will not be obliged to refund you the value of the credit if you cancel your new travel arrangements.
                </p>
                <p className="mb-6">
                  If you cancel travel arrangements that have a value which exceeds the value of your credit (Excess Payment), then we will refund you the Excess Payment, less cancellation fees in accordance with the table below, calculated from the date which we receive written notice of cancellation:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>60+ days before departure of our booked services – 30% of trip cost or deposit amount, whichever is greater</li>
                  <li>59 – 45 days before departure of our booked services – 50% of trip cost</li>
                  <li>45 – 31 days before departure of our booked services – 75% of trip cost</li>
                  <li>Within 30 days before departure of our booked services – 100% of trip cost</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">New or changed quarantine requirements</h4>
                <p className="mb-4">
                  If after we confirm your booking: (a) new or changed quarantine requirements are imposed by government authorities either in a destination you are due to visit or in your home State or county and these remain in effect 60 days before commencement of travel arrangements booked with us; and (b) these new or changed quarantine requirements make it reasonably impractical for you to travel; then (c) you may give us written notice to cancel your trip not less than 45 days prior to commencement of the first arrangement.
                </p>
                <p className="mb-6">
                  If you cancel travel arrangements in these circumstances, then we will refund payments made by you less: (a) unrecoverable third party costs and other expenses incurred by us in relation to your travel arrangements; (b) overhead charges incurred by us relative to the price of your travel arrangements; and (c) fair compensation for work undertaken by us in relation to your travel arrangements until the time of cancellation and in connection with the processing of any refund.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Other Cancellations</h4>
                <p className="mb-4">
                  If you wish to cancel your trip for other reasons, we require written notice and will make refunds to you less cancellation fees in accordance with the table below, calculated from the date which we receive written notice:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>60+ days before departure of our booked services – 30% of trip cost or deposit amount, whichever is greater</li>
                  <li>59 – 45 days before departure of our booked services – 50% of trip cost</li>
                  <li>45 – 31 days before departure of our booked services – 75% of trip cost</li>
                  <li>Within 30 days before departure of our booked services – 100% of trip cost</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">General</h4>
                <p className="mb-4">
                  You agree that the deductions and cancellation charges specified above are reasonable, represent a genuine pre-estimate of our loss and are required to protect our legitimate business interests.
                </p>
                <p className="mb-6">
                  For group departures, a transfer of a confirmed booking to another departure date at your request is deemed to be cancellation of the original booking.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">ILLNESS OR VACCINATION STATUS PREVENTING TRAVEL</h3>
                <p className="mb-4">
                  If due to any illness, suspected illness or failure to satisfy any required tests (such as a PCR or rapid antigen test in relation to Covid-19) or vaccination requirements:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>an airline or other common carrier refuses you carriage;</li>
                  <li>a hotel or vessel refuses to accommodate you; or</li>
                  <li>we or our suppliers (acting reasonably) exclude you from the trip</li>
                </ul>
                <p className="mb-4">
                  and you are consequently prevented from commencing or continuing your trip, then:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>if you have already commenced your trip, we will provide you with reasonable assistance to arrange alternative travel arrangements or to continue the trip. This will be at your cost.</li>
                  <li>if you have not commenced your trip then we regret we will not be in a position to provide such assistance.</li>
                </ul>
                <p className="mb-4">
                  We will not be liable to refund the cost of your trip (or any part of it) because we would have already paid (or committed to pay) suppliers and we would have already performed significant work preparing for the delivery of your trip and servicing your booking.
                </p>
                <p className="mb-6">
                  We will not be responsible for any other loss or losses you incur in connection with your booking (for example, airfares and visa expenses) if you are prevented from commencing or continuing your trip in these circumstances.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">CANCELLATIONS OR RESCHEDULING BY US</h3>
                <p className="mb-6">
                  In these Booking Conditions, the term Force Majeure means an event or events beyond our control and which we could not have reasonably prevented, and includes but is not limited to: (a) natural disasters (including not limited to flooding, fire, earthquake, landslide, volcanic eruption), adverse weather conditions (including hurricane or cyclone), high or low water levels; (b) war, armed conflict, industrial dispute, civil strife, terrorist activity or the threat of such acts; epidemic, pandemic; (d) any new or change in law, order, decree, rule or regulation of any government authority (including travel advisories and restrictions).
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Force Majeure – Prior to travel</h4>
                <p className="mb-4">
                  If in our reasonable opinion we (either directly or through our employees, contractors, suppliers or agents) consider that your travel arrangements cannot safely or lawfully proceed due to a Force Majeure Event then we at our discretion may elect to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>reschedule your travel arrangements (in whole or in part); and/or</li>
                  <li>cancel your travel arrangements (in whole or in part), in which case our contract with you will terminate (in whole or in part).</li>
                </ul>
                <p className="mb-6">
                  If we cancel any of your travel arrangements, neither of us will have any claim for damages against the other for the cancelled arrangements. However, we will refund payments attributable to the cancelled travel arrangements less: (a) unrecoverable third party costs and other expenses incurred by us for the cancelled travel arrangements; (b) overhead charges incurred by us relative to the price of the cancelled travel arrangements; and (c) fair compensation for work undertaken by us in relation to the cancelled travel arrangements until the time of cancellation and in connection with the processing of any refund.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">TRAVEL INSURANCE</h3>
                <p className="mb-6">
                  It is a condition of your booking that you are adequately insured for the duration of your trip. We recommend comprehensive travel insurance to cover cancellation, medical requirements, luggage, repatriations and additional expenses. The choice of insurer is yours. We strongly suggest you purchase insurance at the time you pay your deposit. This is because cancellation fees and charges are payable from that time.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">PASSPORTS, VISAS</h3>
                <p className="mb-6">
                  It is a requirement that you hold a valid passport and any required visas for your trip. It is your responsibility to ensure that you are in possession of the necessary documentation to comply with the laws and regulations of the countries to be visited.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">HEALTH & FITNESS</h3>
                <p className="mb-4">
                  It is your responsibility to ensure that you have a suitable level of health and fitness to undertake the trip of your choice.
                </p>
                <p className="mb-4">
                  If you suffer from a medical condition which may reasonably be expected to increase your risk of needing medical attention, or which may affect the normal conduct of the trip, then you must advise us at the time you make your booking request.
                </p>
                <p className="mb-6">
                  We may request you to provide an assessment of your medical condition from a qualified medical practitioner. If the assessment indicates that you will require special assistance from personnel which we cannot reasonably provide, then we may cancel your booking. Provided you notified us of your medical condition at the time you made your booking request, we will provide you with a full of refund of payments made. If you fail to notify us at that time or if you fail to provide a medical assessment within a reasonable time of our request, then this will be considered a cancellation by you.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">COMPLAINTS</h3>
                <p className="mb-4">
                  In the event of a problem with any aspect of your travel arrangements you must tell us or make our representative or our local supplier aware of such problems immediately.
                </p>
                <p className="mb-6">
                  We will only consider and be responsible for claims made against us where we or our suppliers have had the opportunity to put things right on the ground. If you notify us of a problem during travel and we haven't resolved it to your satisfaction, then you must make any claim in writing within 30 days from the end of your travel arrangements.
                </p>

                <h3 className="text-xl font-bold text-amber-600 mt-8 mb-4">GENERAL</h3>
                <p className="mb-4">
                  The contract between This is Africa trading as This is Africa Pty Ltd and you is governed by the laws of the State of New South Wales. Any disputes shall be dealt with by a court with the appropriate jurisdiction in NSW.
                </p>
                <p className="mb-4">
                  If any provision of these Booking Conditions is found to be unenforceable, then to the extent possible it will be severed without affecting the remaining provisions.
                </p>
                <p className="mb-6 text-sm text-gray-600">
                  <strong>Updated:</strong> 10 January 2023
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