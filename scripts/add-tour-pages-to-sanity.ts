// Script to add all tour pages and My Bookings to Sanity CMS
// Run with: npx tsx scripts/add-tour-pages-to-sanity.ts

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Define all the tour pages and My Bookings
const tourPages = [
  {
    title: 'My Bookings',
    slug: { current: 'my-bookings' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'My Bookings',
      subtitle: 'Manage and view your African travel bookings',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Your Travel Dashboard' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Welcome to your personal travel dashboard. Here you can view all your bookings, check travel dates, download documents, and manage your African adventures.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'How to Use My Bookings' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Search your bookings by reference number or destination' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• View booking details, dates, and travel arrangements' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Download booking confirmations and travel documents' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Check booking status and payment information' },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Need Help with Your Booking?',
        description: 'If you can\'t find your booking or need assistance, our travel experts are here to help.',
        showPhone: true,
        showEmail: true,
      },
    ],
    seoSettings: {
      metaTitle: 'My Bookings | This Is Africa',
      metaDescription: 'View and manage your African safari bookings. Check travel dates, download documents, and access your travel dashboard.',
    },
  },
  {
    title: 'African Group Tours',
    slug: { current: 'group-tours' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'African Group Tours',
      subtitle: 'Join like-minded travelers on unforgettable African adventures',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Discover Africa with Fellow Travelers' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Our group tours offer the perfect balance of adventure, comfort, and camaraderie. Travel with small groups of like-minded explorers while enjoying expert guides, carefully planned itineraries, and the shared excitement of discovering Africa together.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'infoBox',
        style: 'info',
        title: 'Why Choose Group Tours?',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: '✓ Small groups (maximum 16 people) for personalized experiences\n' },
              { _type: 'span', text: '✓ Expert local guides with extensive knowledge\n' },
              { _type: 'span', text: '✓ All logistics handled - just focus on enjoying your adventure\n' },
              { _type: 'span', text: '✓ Meet fellow travelers and make lifelong friendships\n' },
              { _type: 'span', text: '✓ Better value than private tours with premium experiences' },
            ],
            markDefs: [],
          },
        ],
        icon: 'users',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Popular Group Tour Destinations' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Kenya & Tanzania - The classic East African safari experience' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• South Africa - From Cape Town to Kruger National Park' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Botswana - Pristine wilderness and diverse ecosystems' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Uganda & Rwanda - Mountain gorilla trekking adventures' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Zimbabwe & Zambia - Victoria Falls and river safaris' },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Join Our Next Group Adventure',
        description: 'Ready to embark on an African group tour? Contact us to learn about upcoming departures and find your perfect adventure.',
        showPhone: true,
        showEmail: true,
      },
    ],
    seoSettings: {
      metaTitle: 'African Group Tours | Small Group Safaris | This Is Africa',
      metaDescription: 'Join small group African safaris and tours. Expert guides, like-minded travelers, and unforgettable adventures across Kenya, Tanzania, South Africa and more.',
    },
  },
  {
    title: 'African Safari Packages',
    slug: { current: 'packages' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'African Safari Packages',
      subtitle: 'Comprehensive African adventures with everything included',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'All-Inclusive African Experiences' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Our safari packages are thoughtfully designed to provide seamless African adventures. Each package includes accommodation, meals, game drives, transfers, and expert guides - everything you need for an unforgettable journey.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Package Categories' }],
        markDefs: [],
      },
      {
        _type: 'infoBox',
        style: 'success',
        title: 'Luxury Packages',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Stay in premium lodges and camps with exceptional service, gourmet dining, and exclusive experiences. Perfect for special celebrations and discerning travelers.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'star',
      },
      {
        _type: 'infoBox',
        style: 'info',
        title: 'Standard Packages',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Comfortable accommodations with great wildlife viewing and authentic experiences. Excellent value for couples and families seeking quality safaris.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'package',
      },
      {
        _type: 'infoBox',
        style: 'warning',
        title: 'Budget-Friendly Packages',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Essential African experiences without compromising on adventure. Basic but comfortable accommodations with full safari activities included.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'check-circle',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'What\'s Typically Included' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• All accommodation (lodges, camps, hotels)' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• All meals (breakfast, lunch, dinner)' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Game drives and safari activities' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Professional safari guide and driver' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Transportation and transfers' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• National park entrance fees' },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Find Your Perfect Package',
        description: 'Browse our safari packages or let us create a custom package tailored to your preferences and budget.',
        showPhone: true,
        showEmail: true,
      },
    ],
    seoSettings: {
      metaTitle: 'African Safari Packages | All-Inclusive Tours | This Is Africa',
      metaDescription: 'Discover comprehensive African safari packages. Luxury, standard, and budget-friendly options with accommodation, meals, and activities included.',
    },
  },
  {
    title: 'Special Offers',
    slug: { current: 'special-offers' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'Special Offers',
      subtitle: 'Exclusive deals and discounts on African adventures',
    },
    content: [
      {
        _type: 'infoBox',
        style: 'warning',
        title: 'Limited Time Offers',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Take advantage of our exclusive special offers and save on your African adventure. These deals are available for a limited time and subject to availability.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'star',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Types of Special Offers' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Early Bird Specials' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Book your safari 6+ months in advance and save up to 15% on selected tours. Perfect for planners who like to secure their dream vacation early.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Last Minute Deals' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Spontaneous travelers can save significantly on departures within 60 days. Great value for flexible travel schedules.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Seasonal Promotions' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Special pricing during shoulder seasons (April-May, November) when wildlife viewing is still excellent but crowds are smaller.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Group Discounts' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Traveling with friends or family? Groups of 6+ people can enjoy special group rates on most of our safari packages.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'How to Stay Updated' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Subscribe to our newsletter for exclusive offers' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Follow us on social media for flash sales' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Contact us directly to be notified of deals for your preferred destinations' },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Don\'t Miss Out!',
        description: 'Contact us today to learn about current special offers and secure your African adventure at the best possible price.',
        showPhone: true,
        showEmail: true,
      },
    ],
    seoSettings: {
      metaTitle: 'African Safari Special Offers | Deals & Discounts | This Is Africa',
      metaDescription: 'Save on African safaris with our special offers. Early bird specials, last minute deals, seasonal promotions and group discounts available.',
    },
  },
  {
    title: 'African River Cruises',
    slug: { current: 'cruises' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'African River Cruises',
      subtitle: 'Explore Africa\'s waterways in comfort and style',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Discover Africa from the Water' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Experience Africa from a unique perspective aboard luxury river cruises. Glide along pristine waterways while enjoying exceptional wildlife viewing, comfortable accommodations, and world-class service.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Popular Cruise Destinations' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Zambezi River (Zimbabwe/Zambia)' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Cruise the mighty Zambezi River near Victoria Falls. Watch elephants, hippos, and crocodiles while enjoying sunset cocktails on deck. The perfect complement to your Victoria Falls experience.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Chobe River (Botswana)' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'The Chobe River offers some of Africa\'s best wildlife viewing from the water. Famous for large elephant herds that come to drink, plus incredible bird life and aquatic species.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'infoBox',
        style: 'info',
        title: 'What to Expect',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: '• Comfortable cabins with en-suite facilities\n' },
              { _type: 'span', text: '• All meals and beverages included\n' },
              { _type: 'span', text: '• Daily game viewing from the water\n' },
              { _type: 'span', text: '• Expert guides and naturalists\n' },
              { _type: 'span', text: '• Optional land-based activities\n' },
              { _type: 'span', text: '• Small ship experience (maximum 28 guests)' },
            ],
            markDefs: [],
          },
        ],
        icon: 'anchor',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Cruise Lengths' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• 2-3 Day Mini Cruises - Perfect addition to safari itineraries' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• 4-5 Day Explorer Cruises - Comprehensive river experience' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• 7+ Day Extended Cruises - Ultimate river safari adventure' },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Set Sail on Your African Adventure',
        description: 'Ready to experience Africa from the water? Contact us to learn about available cruise dates and create your perfect river safari.',
        showPhone: true,
        showEmail: true,
      },
    ],
    seoSettings: {
      metaTitle: 'African River Cruises | Zambezi & Chobe River Safaris | This Is Africa',
      metaDescription: 'Luxury African river cruises on the Zambezi and Chobe Rivers. Small ship experiences with wildlife viewing, all-inclusive service, and expert guides.',
    },
  },
  {
    title: 'African Rail Journeys',
    slug: { current: 'rail' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'African Rail Journeys',
      subtitle: 'Luxury train travel through Africa\'s most spectacular landscapes',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Travel in Elegant Style' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Step aboard Africa\'s most luxurious trains for an unforgettable journey through breathtaking landscapes. Our rail experiences combine the golden age of train travel with modern comfort and exceptional service.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Luxury Train Experiences' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Rovos Rail' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Experience the "Pride of Africa" on meticulously restored vintage carriages. Journey from Cape Town to Pretoria, or embark on longer adventures to Victoria Falls and beyond.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Blue Train' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Travel South Africa\'s most famous luxury train between Cape Town and Pretoria. Enjoy world-class cuisine, elegant suites, and panoramic views of the African landscape.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'infoBox',
        style: 'success',
        title: 'What\'s Included',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: '• Luxury suite accommodations with en-suite facilities\n' },
              { _type: 'span', text: '• All gourmet meals and premium beverages\n' },
              { _type: 'span', text: '• Off-train excursions and sightseeing\n' },
              { _type: 'span', text: '• Professional tour escorts and historians\n' },
              { _type: 'span', text: '• Observation car for scenic viewing\n' },
              { _type: 'span', text: '• Evening entertainment and dining car service' },
            ],
            markDefs: [],
          },
        ],
        icon: 'star',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Popular Rail Routes' }],
        markDefs: [],
      },
      {
        _type: 'table',
        title: 'Rail Journey Options',
        headers: ['Route', 'Duration', 'Highlights'],
        rows: [
          { cells: ['Cape Town to Pretoria', '2 days/1 night', 'Table Mountain to Jacaranda City'] },
          { cells: ['Pretoria to Victoria Falls', '3 days/2 nights', 'Big Five country to Wonder of the World'] },
          { cells: ['Cape Town to Dar es Salaam', '15 days/14 nights', 'Epic trans-African adventure'] },
          { cells: ['Golf Safari Special', '4 days/3 nights', 'Combine luxury rail with championship golf'] },
        ],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Best Time to Travel' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Rail journeys operate year-round, but the best weather for scenic viewing is during the dry season (April to October). Book well in advance as these exclusive experiences have limited capacity.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'All Aboard!',
        description: 'Ready to experience the romance of African rail travel? Contact us to reserve your luxury train journey.',
        showPhone: true,
        showEmail: true,
      },
    ],
    seoSettings: {
      metaTitle: 'Luxury African Rail Journeys | Rovos Rail & Blue Train | This Is Africa',
      metaDescription: 'Experience luxury African train travel on Rovos Rail and Blue Train. Cape Town to Pretoria, Victoria Falls routes with all-inclusive service.',
    },
  },
  {
    title: 'African Accommodation',
    slug: { current: 'accommodation' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'African Accommodation',
      subtitle: 'From luxury lodges to intimate camps, find your perfect African stay',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Where Comfort Meets Adventure' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Choose from an exceptional selection of African accommodations, from world-renowned luxury lodges to intimate bush camps. Each property is carefully selected for its location, service, and authentic African experience.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Accommodation Types' }],
        markDefs: [],
      },
      {
        _type: 'infoBox',
        style: 'success',
        title: 'Luxury Safari Lodges',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Ultra-luxurious lodges with spacious suites, private decks, fine dining, spa services, and personalized butler service. Perfect for special occasions and discerning travelers.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'star',
      },
      {
        _type: 'infoBox',
        style: 'info',
        title: 'Boutique Safari Camps',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Intimate camps with 6-20 tents offering authentic bush experiences. Comfortable accommodations with excellent game viewing and personalized attention.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'home',
      },
      {
        _type: 'infoBox',
        style: 'warning',
        title: 'City Hotels & Resorts',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Premium hotels in major cities like Cape Town, Nairobi, and Cairo. Perfect for extending your safari with urban exploration, cultural experiences, and relaxation.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'building',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Featured Destinations' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'South Africa' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'From the luxury lodges of Sabi Sand to the boutique hotels of Cape Town. Stay at world-class properties in Kruger National Park, the Garden Route, and wine regions.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Kenya & Tanzania' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Experience the Great Migration from luxury tented camps in the Masai Mara and Serengeti. Historic lodges, modern camps, and exclusive conservancies available.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Botswana' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Exclusive camps in the Okavango Delta, Chobe, and Kalahari. Small, intimate properties offering exceptional game viewing and pristine wilderness experiences.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Find Your Perfect Stay',
        description: 'Let us match you with the ideal African accommodation for your style, budget, and travel dates.',
        showPhone: true,
        showEmail: true,
      },
    ],
    seoSettings: {
      metaTitle: 'African Safari Accommodation | Luxury Lodges & Camps | This Is Africa',
      metaDescription: 'Book African safari accommodation from luxury lodges to intimate bush camps. South Africa, Kenya, Tanzania, Botswana properties available.',
    },
  },
]

async function addTourPagesToSanity() {
  console.log('📄 Adding tour pages and My Bookings to Sanity...\n')

  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (const page of tourPages) {
    try {
      // Check if page already exists
      const existingDoc = await client.fetch(
        `*[_type == "staticPage" && slug.current == $slug][0]`,
        { slug: page.slug.current }
      )

      if (existingDoc) {
        // Update existing document
        const result = await client
          .patch(existingDoc._id)
          .set(page)
          .commit()
        console.log(`✅ Updated "${page.title}" page`)
        successCount++
      } else {
        // Create new document
        const doc = {
          _type: 'staticPage',
          ...page,
        }
        const result = await client.create(doc)
        console.log(`✅ Created "${page.title}" page`)
        successCount++
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`❌ Error processing "${page.title}":`, error)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`✅ Successfully processed: ${successCount}`)
  console.log(`⏭️  Skipped: ${skippedCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📋 Total pages: ${tourPages.length}`)

  console.log('\n🎉 All tour pages added to Sanity!')
  console.log('\nPages created:')
  tourPages.forEach(page => {
    console.log(`  • ${page.title} (/${page.slug.current})`)
  })
}

// Run the script
addTourPagesToSanity()
  .then(() => {
    console.log('\n✨ All tour pages added successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })