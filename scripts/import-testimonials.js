// Script to import testimonials into Sanity
// Run with: node scripts/import-testimonials.js

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // You'll need to add this to .env.local
  apiVersion: '2024-09-04',
  useCdn: false
});

// Testimonials data
const testimonials = [
  // 2025 Testimonials
  {
    name: "Stephanie and Emile",
    location: "Honeymoon",
    tourProduct: "Mauritius, South Africa, Botswana, Zimbabwe and Tanzania (Zanzibar)",
    rating: 5,
    testimonial: "We had the most incredible time—every destination you recommended was beyond beautiful, the hotels were absolutely stunning, and the safaris were truly out of this world.\n\nHi Patrick I just wanted to say a huge thank you to you and the team at this is Africa for putting together the honeymoon of a lifetime for Emile and I. We had the most incredible time—every destination you recommended was beyond beautiful, the hotels were absolutely stunning, and the safaris were truly out of this world. Each experience felt so thoughtfully chosen, and the whole trip ran so seamlessly from start to finish. Africa completely stole our hearts. We've come home with memories that we'll treasure forever, and a deep love for the places, the culture, and the spirit of the continent. I've now made all my friends and family incredibly jealous—everyone wants to go to Africa after hearing about our trip! So I'll definitely be sending them your way for some amazing recommendations. Thank you again for making it all so special. We truly couldn't have asked for a more perfect start to our married life 🙂 Stephanie and Emile",
    date: "2025-03-01",
    featured: true,
    verified: true
  },
  {
    name: "Tim and Elizabeth Hely-Hammond",
    location: "Australia",
    tourProduct: "South Africa",
    rating: 5,
    testimonial: "Just a quick note to say thanks for organising our trip which was just fantastic, and provided us with lifelong memories.\n\nHi Nikki Just a quick note to say thanks for organising our trip which was just fantastic, and provided us with lifelong memories...Sabi Sabi was just awesome, wonderfully well organised and the safari trips with our trusted guide Jan and the incredibly knowledgeable tracker Lazarus were just perfect. Please pass on our deepest thanks to the Sabi Sabi team...All in all it was the trip of a lifetime and we are already thinking of our next one! Kind Regards Tim and Elizabeth",
    date: "2025-03-01",
    featured: true,
    verified: true
  },
  {
    name: "Bronwyn Elliott and John Winter",
    location: "Australia",
    tourProduct: "Tanzania",
    rating: 5,
    testimonial: "Our driver/guide, Emanuel Manga, was excellent with a deep knowledge and passion for the landscape, wildlife and animal behaviour. The Ang'ata camps were very comfortable and quite luxurious.\n\nSome feedback, as discussed, about the recent Tanzania safari you organised for us…You promised to get us a good driver/guide and you certainly achieved that! Our driver/guide, Emanuel Manga, was excellent with a deep knowledge and passion for the landscape, wildlife and animal behaviour as well as John's needs for photography/videography. I would have no hesitation in recommending him…The Ang'ata camps were very comfortable and quite luxurious, but at the same time casual and relaxed. A nice balance for us and many Australians I would think. Everything felt fresh and clean and in a good state of repair at all the Ang'ata camps at Ngorongoro Crater, Central Serengeti and Ndutu (mobile camp). Anga'ata staff were, without exception, friendly, cheerful and welcoming. They are to be commended. The chefs do an amazing job in such remote locations, hours from the nearest market...The Miracle Balloon was fabulous, a really special experience, followed by champagne and a bountiful breakfast - once again far more food than we could eat…Nikki, from John and I, thank you to you and your team very much for organising our Tanzania safari for us. You did a wonderful job, meeting our brief exactly.",
    date: "2025-02-01",
    featured: false,
    verified: true
  },
  // 2024 Testimonials
  {
    name: "Paula Dock Family",
    location: "Australia",
    tourProduct: "South Africa and Victoria Falls",
    rating: 5,
    testimonial: "The trip was amazing - we loved how it was all scheduled and were really happy with all the hotels and the game lodges were lovely.\n\nThe trip was amazing - we loved how it was all scheduled and were really happy with all the hotels and the game lodges were lovely...Driving was all fine...and a good schedule and way more beautiful scenery than I'd imagined. A swim at Plettenburg Bay in 25 degree water was fab too!...In terms of the game lodges - the drives were best at Kariega, and the lodge was fabulous, then when we got to the Garden Route game lodge, that was even more fabulous - the drives were great…Thank you for the wonderful organisation....it was fabulous.",
    date: "2024-12-01",
    featured: false,
    verified: true
  },
  {
    name: "Loaraine Guerrini and Family",
    location: "Australia",
    tourProduct: "Kenya",
    rating: 5,
    testimonial: "We had the most amazing time. The safari guide Christopher was really great, he had a wonderful sense of humour and was very knowledgeable.\n\nHi Yvonne and Nikki I hope you're both well. I just wanted to thank you for arranging the tour. We had the most amazing time. The safari guide Christopher was really great, he had a wonderful sense of humour and was very knowledgeable. He definitely knew where to find the animals. The Sopa Lodges far exceeded my expectations, and the buffet food was exceptional every single day, I can't stop thinking about it! All the Kenyan people and guides were incredibly friendly, and all had a great sense of humour. I truly have nothing but praise for the whole tour and the country. I'm not sure I have another long flight left in me to Africa, but if I do, I would love to use your company again. Thank you once again for your time and effort and lovely approachable nature. Thank you also for staying in touch with flight updates, it was very much appreciated. Kind regards Lorraine",
    date: "2024-10-01",
    featured: false,
    verified: true
  },
  {
    name: "Baines Family",
    location: "Australia",
    tourProduct: "South Africa, Victoria Falls & Botswana",
    rating: 5,
    testimonial: "I find it hard to put into words how epic spectacular our trip was! Everything went off without a hitch. The attention to detail in the transfers was superb.\n\nI find it hard to put into words how epic spectacular our trip was! To tell the full story, we had originally thought we were going to plan a Europe trip. But after multiple failed attempts trying to get an agent to help us, we switched gears and decided to reach out to Africa travel agents. We put out a few emails to google-searched companies, and Nikki was the ONLY one to respond to us. From the very beginning, Nikki was attentive to our needs. We told her what the budget was, what the time frame was, and the type of experience we were looking for. She put together an itinerary for us, and the plan was in place! She responded to every concern we had, answered every email in detail, and took every phone call (at length sometimes!). In addition, we never actually attended the office or met Nikki in person, so if you are concerned about scams, This is Africa is legit. Now to our actual vacation: Everything went off without a hitch. The attention to detail in the transfers was superb, the places we stayed at were beyond our expectations and dreams! We had moments where we looked at each other and said \"This place is incredible! I want to freeze this moment in time!\" And the animals, oh the animals! It was like we were driving around in Jurassic Park, looking for elephants and giraffes. We definitely saw the big five and so much more! The trackers and guides are absolute experts, knowing every plant, animal, bird, and answering all of our many questions. All in all, we cannot thank Nikki, Von and This is Africa. Please do not hesitate to use their service, they are experts without a doubt! Thank you so much Tiffany and family",
    date: "2024-07-01",
    featured: true,
    verified: true
  },
  {
    name: "Sione Palu Family",
    location: "Australia",
    tourProduct: "South Africa",
    rating: 5,
    testimonial: "What a trip of a lifetime we had! Thanks to the team at This is Africa this will go down as one of the best trips ever.\n\nWhat a trip of a lifetime we had! Thanks to the team at This is Africa this will go down as one of the best trips ever. Our itinerary was well tailored for me and my two boys. Every place we stayed was perfect for us. Our trip had everything and I have fallen in love with Africa. I told my boys that they will be paying for our next trip back to Africa. So they better get working even though they are 9 and 12 years old hahaha. Thank you for turning a tragic year into one of joy, hope and beautiful memories. Kind regards Sione",
    date: "2024-07-01",
    featured: false,
    verified: true
  },
  // 2023 Testimonials
  {
    name: "Deanne and Family",
    location: "Australia",
    tourProduct: "South Africa and Mauritius",
    rating: 5,
    testimonial: "We cannot thank you enough for what was the most incredible holiday. On holidays like this you try not to let your expectations run away with you but on this one, we reached and absolutely exceeded all that we had hoped it would be.\n\nNikki, we cannot thank you enough for what was the most incredible holiday. On holidays like this you try not to let your expectations run away with you but on this one, we reached and absolutely exceeded all that we had hoped it would be. Our short stint in Cape Town was enough to get us wanting to come back for more. Your recommendation on where to stay was perfect for what we needed. Onto safari we went and there are not enough superlatives to describe our joy and wonder at arriving at Sabi Sabi Bush Lodge. You told us to expect spectacular and it was. Your knowledge in helping us decide where to stay was invaluable. The lodge was nothing short of exceptional and service from the staff beyond fault, but that was nothing compared to the actual game drives with our knowledgeable tracker and ranger who I would recommend 100 times over. I think we were lucky enough to view 4 of the big 5 in our first 2 days – every day had something different – and up close – closer than we probably thought possible. We all now have a deep love and appreciation of the African Savannah. Our Mauritius leg was just as wonderous – what a truly beautiful island paradise. Your assistance with all our accommodation, transfers and flights was so helpful and we travelled without hiccup. After the holiday and experiences we had, I would gladly recommend you to anyone! Thank you Deanne",
    date: "2023-12-01",
    featured: false,
    verified: true
  }
  // Add more testimonials here as needed...
];

async function importTestimonials() {
  console.log('Starting testimonials import...');
  
  try {
    for (const testimonial of testimonials) {
      const doc = {
        _type: 'testimonial',
        ...testimonial
      };
      
      const result = await client.create(doc);
      console.log(`✓ Imported testimonial from ${testimonial.name}`);
    }
    
    console.log(`\n✅ Successfully imported ${testimonials.length} testimonials!`);
  } catch (error) {
    console.error('Error importing testimonials:', error);
  }
}

// Run the import
importTestimonials();