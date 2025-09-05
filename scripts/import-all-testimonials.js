// Complete script to import ALL testimonials into Sanity
// Run with: node scripts/import-all-testimonials.js

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-09-04',
  useCdn: false
});

// Quick Reviews (6 reviews)
const quickReviews = [
  {
    name: "Anonymous Customer 1",
    location: "Australia",
    tourProduct: "Africa Tour",
    rating: 5,
    testimonial: "Simply amazing...fabulous. We will definitely recommend your company",
    date: "2023-01-01",
    featured: false,
    verified: true
  },
  {
    name: "Anonymous Customer 2",
    location: "Australia",
    tourProduct: "Africa Tour",
    rating: 5,
    testimonial: "It was fabulous. Everything was exactly as you'd prepared and all your recommendations were spot on.",
    date: "2023-01-01",
    featured: false,
    verified: true
  },
  {
    name: "Anonymous Customer 3",
    location: "Australia",
    tourProduct: "Rwanda and Tanzania",
    rating: 5,
    testimonial: "I have just returned from Rwanda and Tanzania and you guys did a FAB job!!!",
    date: "2023-01-01",
    featured: false,
    verified: true
  },
  {
    name: "Anonymous Customer 4",
    location: "Australia",
    tourProduct: "Gorilla Trekking",
    rating: 5,
    testimonial: "I certainly want to go back and do Gorilla trekking and will 100% be going through you guys again.",
    date: "2023-01-01",
    featured: false,
    verified: true
  },
  {
    name: "Anonymous Customer 5",
    location: "Australia",
    tourProduct: "Africa Tour",
    rating: 5,
    testimonial: "We know it is just a snapshot of Africa but for us it just such a perfect one.",
    date: "2023-01-01",
    featured: false,
    verified: true
  },
  {
    name: "Anonymous Customer 6",
    location: "Australia",
    tourProduct: "Southern Africa",
    rating: 5,
    testimonial: "What can I say? Our trip to Southern Africa was absolutely BRILLIANT!!",
    date: "2023-01-01",
    featured: false,
    verified: true
  }
];

// Detailed testimonials (25 reviews)
const detailedTestimonials = [
  // 2025 Testimonials
  {
    name: "Stephanie and Emile",
    location: "Honeymoon",
    tourProduct: "Mauritius, South Africa, Botswana, Zimbabwe and Tanzania (Zanzibar)",
    rating: 5,
    testimonial: "Hi Patrick I just wanted to say a huge thank you to you and the team at this is Africa for putting together the honeymoon of a lifetime for Emile and I. We had the most incredible time—every destination you recommended was beyond beautiful, the hotels were absolutely stunning, and the safaris were truly out of this world. Each experience felt so thoughtfully chosen, and the whole trip ran so seamlessly from start to finish. Africa completely stole our hearts. We've come home with memories that we'll treasure forever, and a deep love for the places, the culture, and the spirit of the continent. I've now made all my friends and family incredibly jealous—everyone wants to go to Africa after hearing about our trip! So I'll definitely be sending them your way for some amazing recommendations. Thank you again for making it all so special. We truly couldn't have asked for a more perfect start to our married life 🙂 Stephanie and Emile",
    date: "2025-03-01",
    featured: true,
    verified: true
  },
  {
    name: "Tim and Elizabeth Hely-Hammond",
    location: "Australia",
    tourProduct: "South Africa",
    rating: 5,
    testimonial: "Hi Nikki Just a quick note to say thanks for organising our trip which was just fantastic, and provided us with lifelong memories...Sabi Sabi was just awesome, wonderfully well organised and the safari trips with our trusted guide Jan and the incredibly knowledgeable tracker Lazarus were just perfect. Please pass on our deepest thanks to the Sabi Sabi team...All in all it was the trip of a lifetime and we are already thinking of our next one! Kind Regards Tim and Elizabeth",
    date: "2025-03-01",
    featured: true,
    verified: true
  },
  {
    name: "Bronwyn Elliott and John Winter",
    location: "Australia",
    tourProduct: "Tanzania",
    rating: 5,
    testimonial: "Some feedback, as discussed, about the recent Tanzania safari you organised for us…You promised to get us a good driver/guide and you certainly achieved that! Our driver/guide, Emanuel Manga, was excellent with a deep knowledge and passion for the landscape, wildlife and animal behaviour as well as John's needs for photography/videography. I would have no hesitation in recommending him…The Ang'ata camps were very comfortable and quite luxurious, but at the same time casual and relaxed. A nice balance for us and many Australians I would think. Everything felt fresh and clean and in a good state of repair at all the Ang'ata camps at Ngorongoro Crater, Central Serengeti and Ndutu (mobile camp). Anga'ata staff were, without exception, friendly, cheerful and welcoming. They are to be commended. The chefs do an amazing job in such remote locations, hours from the nearest market...The Miracle Balloon was fabulous, a really special experience, followed by champagne and a bountiful breakfast - once again far more food than we could eat…Nikki, from John and I, thank you to you and your team very much for organising our Tanzania safari for us. You did a wonderful job, meeting our brief exactly.",
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
    testimonial: "The trip was amazing - we loved how it was all scheduled and were really happy with all the hotels and the game lodges were lovely...Driving was all fine...and a good schedule and way more beautiful scenery than I'd imagined. A swim at Plettenburg Bay in 25 degree water was fab too!...In terms of the game lodges - the drives were best at Kariega, and the lodge was fabulous, then when we got to the Garden Route game lodge, that was even more fabulous - the drives were great…Thank you for the wonderful organisation....it was fabulous.",
    date: "2024-12-01",
    featured: false,
    verified: true
  },
  {
    name: "Loaraine Guerrini and Family",
    location: "Australia",
    tourProduct: "Kenya",
    rating: 5,
    testimonial: "Hi Yvonne and Nikki I hope you're both well. I just wanted to thank you for arranging the tour. We had the most amazing time. The safari guide Christopher was really great, he had a wonderful sense of humour and was very knowledgeable. He definitely knew where to find the animals. The Sopa Lodges far exceeded my expectations, and the buffet food was exceptional every single day, I can't stop thinking about it! All the Kenyan people and guides were incredibly friendly, and all had a great sense of humour. I truly have nothing but praise for the whole tour and the country. I'm not sure I have another long flight left in me to Africa, but if I do, I would love to use your company again. Thank you once again for your time and effort and lovely approachable nature. Thank you also for staying in touch with flight updates, it was very much appreciated. Kind regards Lorraine",
    date: "2024-10-01",
    featured: false,
    verified: true
  },
  {
    name: "Baines Family",
    location: "Australia",
    tourProduct: "South Africa, Victoria Falls & Botswana",
    rating: 5,
    testimonial: "I find it hard to put into words how epic spectacular our trip was! To tell the full story, we had originally thought we were going to plan a Europe trip. But after multiple failed attempts trying to get an agent to help us, we switched gears and decided to reach out to Africa travel agents. We put out a few emails to google-searched companies, and Nikki was the ONLY one to respond to us. From the very beginning, Nikki was attentive to our needs. We told her what the budget was, what the time frame was, and the type of experience we were looking for. She put together an itinerary for us, and the plan was in place! She responded to every concern we had, answered every email in detail, and took every phone call (at length sometimes!). In addition, we never actually attended the office or met Nikki in person, so if you are concerned about scams, This is Africa is legit. Now to our actual vacation: Everything went off without a hitch. The attention to detail in the transfers was superb, the places we stayed at were beyond our expectations and dreams! We had moments where we looked at each other and said \"This place is incredible! I want to freeze this moment in time!\" And the animals, oh the animals! It was like we were driving around in Jurassic Park, looking for elephants and giraffes. We definitely saw the big five and so much more! The trackers and guides are absolute experts, knowing every plant, animal, bird, and answering all of our many questions. All in all, we cannot thank Nikki, Von and This is Africa. Please do not hesitate to use their service, they are experts without a doubt! Thank you so much Tiffany and family",
    date: "2024-07-01",
    featured: true,
    verified: true
  },
  {
    name: "Sione Palu Family",
    location: "Australia",
    tourProduct: "South Africa",
    rating: 5,
    testimonial: "What a trip of a lifetime we had! Thanks to the team at This is Africa this will go down as one of the best trips ever. Our itinerary was well tailored for me and my two boys. Every place we stayed was perfect for us. Our trip had everything and I have fallen in love with Africa. I told my boys that they will be paying for our next trip back to Africa. So they better get working even though they are 9 and 12 years old hahaha. Thank you for turning a tragic year into one of joy, hope and beautiful memories. Kind regards Sione",
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
    testimonial: "Nikki, we cannot thank you enough for what was the most incredible holiday. On holidays like this you try not to let your expectations run away with you but on this one, we reached and absolutely exceeded all that we had hoped it would be. Our short stint in Cape Town was enough to get us wanting to come back for more. Your recommendation on where to stay was perfect for what we needed. Onto safari we went and there are not enough superlatives to describe our joy and wonder at arriving at Sabi Sabi Bush Lodge. You told us to expect spectacular and it was. Your knowledge in helping us decide where to stay was invaluable. The lodge was nothing short of exceptional and service from the staff beyond fault, but that was nothing compared to the actual game drives with our knowledgeable tracker and ranger who I would recommend 100 times over. I think we were lucky enough to view 4 of the big 5 in our first 2 days – every day had something different – and up close – closer than we probably thought possible. We all now have a deep love and appreciation of the African Savannah. Our Mauritius leg was just as wonderous – what a truly beautiful island paradise. Your assistance with all our accommodation, transfers and flights was so helpful and we travelled without hiccup. After the holiday and experiences we had, I would gladly recommend you to anyone! Thank you Deanne",
    date: "2023-12-01",
    featured: false,
    verified: true
  },
  {
    name: "Peter and Mary Lee",
    location: "Australia",
    tourProduct: "Kenya, South Africa, Botswana and Zimbabwe",
    rating: 5,
    testimonial: "My name is Peter with my wife ( Mary ) ,we joined '' This is a Africa '' company's tour travel to Africa on 18/9/2023--13/10/2023 We enjoyed very much because they organised very well so we strongly recommend this company is the best of Africa tour. They have a great team and very kindly and patiently. Peter and Mary",
    date: "2023-09-01",
    featured: false,
    verified: true
  },
  {
    name: "Anthony and Louise",
    location: "Australia",
    tourProduct: "Botswana, Tanzania, Victoria Falls, Zanzibar",
    rating: 5,
    testimonial: "What an incredible trip. It really did exceed our expectations. There were so many highlights From day one all transfers and all tours went to clockwork. Everyone was so friendly, professional and helpful. We stayed in a variety hotels and tents and all were clean and comfortable. Among the many highlights were the tented camps. The tents were spacious and so comfortable. The food was delicious. Nothing was too much trouble for the fantastic staff. They went above and beyond to ensure our stay was comfortable and an unforgettable experience. The farewell song was the icing on the cake. All this in the middle of the Serengeti; it was extraordinary. The game drives were so exciting. Every day was filled with multiple sightings of all the animals we came to see. We were so close to prides of lions, herds of elephants, zebras and giraffes. We had to pinch ourselves. The guides were amazing, so knowledgeable and informative. No two days were the same. By the end of our trip we became expert spotters of creatures great and small. Thank you Pat, for arranging an incredible itinerary and giving us such a unique experience. We'll definitely recommend This Is Africa to anyone travelling to Africa. Thank you, Anthony and Louise",
    date: "2023-08-01",
    featured: false,
    verified: true
  },
  {
    name: "Jaquie and Rod",
    location: "Australia",
    tourProduct: "South Africa, Botswana, and Zimbabwe",
    rating: 5,
    testimonial: "Well, a beyond amazing adventure! The trip absolutely exceeded all my expectations – and that's saying something given how great the east African safari was a few years ago. The trip had everything: the Rovos train trip, Cape Town, the self-drive, the mountains, the coast, the Panorama Route, Victoria Falls, the river cruise and the safaris! The lodge in Thornybush Game Reserve with our open to the wild deck (outdoor bathroom had an electric fence!), the Chobe River cruise…Savuti in the Kalahari with so many lions, Xugana Island in the Okavango and our lodge near the Makgadikgadi Pans with The Hide (viewing platform accessed by way of a tunnel where you get really close to the animals). I even loved all the flights in tiny aircraft. Great fun. And loved landing on a sand airstrip, engine still running to see a sign \"Welcome to Savute International Airport, departure gate 3 – in the middle of nowhere!) The animals were amazing. We were lucky to see a baby rhino, a just born giraffe with the umbilical cord still attached, lion cubs (heaps), heaps of baby elephants, 3 leopards (previously only seen them asleep in trees. This time they were all out hunting), painted dogs, jackals making a kill, lions feeding on a kudu kill, crocodiles feeding on a buffalo, giraffes, elephants and hippos all fighting. We saw so many elephant river crossings. Nightly sundowners on safari made every fantastic sunset even more memorable! Loved it all! Jaquie and Rod",
    date: "2023-09-01",
    featured: true,
    verified: true
  },
  {
    name: "Fran & Bart Geysen",
    location: "Australia",
    tourProduct: "South Africa, Zimbabwe and Botswana",
    rating: 5,
    testimonial: "Good morning Patrick We have returned from our amazing African trip that you organised for us. I want to say thank you so very much - it was everything I'd hoped it would be and more! It was seamless and just perfect. The variety of stays were wonderful...... from the camp style of Odd Balls Enclave to the luxury of Simbivati! The Trackers were amazing and so interesting and the service was truly incredible......everywhere. Every flight (we had 10 in total) was on time and every time there was someone to meet us when we landed. At no time did we feel lost or unsure of our bearings. Fantastic. Thank you once again for the trip of a lifetime. Kindest regards Fran Geysen",
    date: "2023-09-01",
    featured: false,
    verified: true
  },
  {
    name: "Gary & Sharon",
    location: "Australia",
    tourProduct: "Tanzania, Victoria Falls & Sabi Sands",
    rating: 5,
    testimonial: "We first booked this trip in early 2020 but unfortunately due to Covid's interference it took us three attempts to finally get to Africa. This Is Africa were excellent in ensuring we did not lose out on our deposits and prepaid flights and were very helpful in re planning and booking our itinerary as needed. Many thanks to Nikki and all the This is Africa staff. Our travels started in Tanzania where our seven day Simba Safari trip exceeded our expectations – fantastic animal sightings, excellent accommodation & food options and extremely friendly & helpful staff. Met some wonderful people to share our experiences with and hopefully to see again on our future travels. Victoria Falls is definitely worth visiting and Ilala Lodge a great place to stay at. If you have the time & money a helicopter ride over the Falls is a must do to really experience the grandeur. The cultural dinner at the Victoria Falls Hotel was a must as well to not only see the view but step back into a time of colonial surroundings in the beauty of the Hotel. At Sabi Sands we stayed at Arathusa Safari Lodge in one of their bush facing suites. Luckily Federal Air Charters provide an easy & professional access option to the lodge with a charter flight from Johannesburg to the Arathusa Lodge airstrip. The lodge and surrounding grounds are gorgeous, the staff & food excellent, and the game drives superb with lots of close up encounters with animals including those who chose to wander through the grounds of the lodge itself. For us this was the highlight of our travels. All up – a brilliant holiday seeing lots and lots of animals in their native environments. Again thank you This is Africa for your help & suggestions in finalising our itinerary with a very special thank you to Nikki for helping us with every part of our planning. Regards Gary & Sharon.",
    date: "2023-07-01",
    featured: true,
    verified: true
  },
  {
    name: "Diogo and Bella Dos Santos",
    location: "Honeymoon",
    tourProduct: "South Africa, Zimbabwe, Botswana",
    rating: 5,
    testimonial: "Our African honeymoon safari was nothing short of a dream come true. Bella had literally been dreaming about this since high school, more than 12years. And your help to make it as perfect as possible was noticeable. All the transfers we got were on time, the trip went smoothly and what a bunch of nice people working there. All the hotels suggested were fantastic Raddison blue, Kuname ( I want to go back), The fancy tent in Zimbabwe.....All of them were insane great... The itinerary you suggested was perfect, exactly as we wanted. WE SAW ALL THE BIG FIVE!!!!!!! Most of them we saw multiple times. All the game drives were 10/10. Thank you so much for your help. Safe to say we are absolutely hooked, cannot wait for our next opportunity to go to Africa. It was magical & we are compelled to go back ASAP. Regards Diogo and Bella",
    date: "2023-06-01",
    featured: true,
    verified: true
  },
  {
    name: "Flynn Family",
    location: "Australia",
    tourProduct: "South Africa, Botswana & Victoria Falls",
    rating: 5,
    testimonial: "This holiday was AMAZING!! It far exceeded all of our expectations. From start to finish everything went perfectly, all of our transfers and tours were on time and the whole trip ran like clockwork. The accommodation was all fantastic with special mention to the lodges (Chobe Bakwena and Shiduli). I would highly recommend both of these to anyone traveling to these parts. In fact, I would highly recommend the whole itinerary to anyone looking for a family trip to Africa. Thanks for everything and please pass on our thanks and positive feedback to 'This is Africa' they obviously have a very good team here and over there to coordinate all this to such a high standard. Thank you Suzanne",
    date: "2023-06-01",
    featured: false,
    verified: true
  },
  {
    name: "Debbi and Dave Haesler",
    location: "Australia",
    tourProduct: "Botswana Kenya, Tanzania and Victoria Falls",
    rating: 5,
    testimonial: "Dear Von and Nikki We are home safe and sound after our time in Africa and Egypt. Everything arranged by This Is Africa went perfectly to plan, many thanks. Bakwena Lodge was a great start. Their service was outstanding including tracking down luggage misplaced by Air Botswana. They set a standard that no one else could hope to achieve. We are still sorting through thousands of photos. Our trip was originally planned for 2020 but Covid intervened. This Is Africa honoured all of the deposits we had paid, were very helpful in re planning some of our itinerary and were always quick to respond to our many and varied requests. Again, many thanks. Debbie and Dave",
    date: "2023-06-01",
    featured: false,
    verified: true
  },
  {
    name: "Kate & Daniel",
    location: "Honeymoon",
    tourProduct: "Uganda and Rwanda",
    rating: 5,
    testimonial: "Morning Nikki, Pat and Team! Now that life has started to settle down a bit and I finally have a spare second. I just wanted to reach out on behalf of Daniel and I and say thank you so so much for everything you did for our honeymoon. Daniel and I had the most incredible time! We fell in love with Nkuringo Bwindi Gorilla Lodge and the people there. Gorilla trekking was hands down THE MOST incredible experience we have ever had. Thank you for dealing with all of my ridiculous questions / painful phone calls and stressing moments. I am proud to say that Daniel is also now Africa obsessed and we cannot wait to go back. Thank you again! Kate & Daniel",
    date: "2023-04-01",
    featured: true,
    verified: true
  },
  {
    name: "Leanne and Carl",
    location: "Australia",
    tourProduct: "South Africa, Rwanda, Uganda, Namibia, Botswana and Zimbabwe",
    rating: 5,
    testimonial: "So many of my friends want to do what we have done. I did a daily FB update, and now everyone is ready to travel. Uganda, and our guide Joseph and our amazing trekkers surpassed our expectations. Our tour through Namibia, Botswana and Zimbabwe was grand, and we covered a lot of ground. Adventures: well the silver-back kicked me and I still have a bruise on my leg to show for it. Was fine, and a great dinner party story forever more. We saw everything, all close up. Have a million photos to share. Lions doing rude things beside the road, so perfect viewing. A leopard deciding to go for a daytime wander, warthogs having a nap outside the supermarket. I loved Africa, and it exceeded all our expectations. Thank you for all your assistance, we didn't have any issues with travel, transfers etc. I will find some photos from my phone for you, but here is me happily resting after the Golden Monkeys with your cap on. Thank you Leanne",
    date: "2023-05-01",
    featured: false,
    verified: true
  },
  {
    name: "Greg and Cathy",
    location: "Australia",
    tourProduct: "South Africa (Second time travellers with This is Africa)",
    rating: 5,
    testimonial: "Hi Patrick and Yvonne Greg and I had another fabulous holiday in South Africa Stellenbosch is beautiful and we enjoyed another stay in Cape Town The Garden Route is stunning and the tour was everything we expected Kariega was amazing and we were pleased to stay on the River Lodge as well as Ukhosi Lodge Johannesburg was interesting and we were happy to experience Soweto Thank you both for putting together a wonderful itinerary we had a great holiday. We will be in touch when we are ready to go somewhere else in Africa Kind regards Cathy and Greg",
    date: "2023-04-01",
    featured: false,
    verified: true
  },
  // Older testimonials
  {
    name: "Olivia Mair",
    location: "Flight Centre Travel Group",
    tourProduct: "Botswana, Zimbabwe and South Africa",
    rating: 5,
    testimonial: "Hi guys, I just thought I'd write you a note to say thanks very much for your help in organising my recent trip to Africa. Everything went off without a hitch and both my Mum and I thoroughly enjoyed ourselves. Mum had some pretty high (and unrealistic) expectations of what we would see (leopard up a tree, baby elephant having a mud bath, a giraffe drinking etc, etc) but miraculously we saw all that and more! So thanks again for a wonderful trip, I'll definitely be recommending you to anyone planning a trip to Africa. Cheers Olivia Commercial Manager Flight Centre Travel Group",
    date: "2017-04-01",
    featured: false,
    verified: true
  },
  {
    name: "Anya Hollstein",
    location: "Australia",
    tourProduct: "Hwange, Chobe and Victoria Falls",
    rating: 5,
    testimonial: "I just returned from a trip organised through This is Africa and I can't recommend them more highly. Everything was carefully and expertly arranged from start to finish. We were so lucky with our game viewing, jumping off the Elephant express and getting driven right to a lioness and her little cub - unforgettable! All our accommodation was beautiful and varied. A standout is definitely Nehimba. Having dinner or drinks on the deck while elephants drink from the swimming pool mere metres away. Chobe will always be an amazing memory for me as we were lucky enough to see a huge amount of animals but a lion and two lionesses walking past your vehicle is something you won't forget quickly. No matter where in Africa and what style you like to travel I would recommend This is Africa.",
    date: "2019-05-01",
    featured: false,
    verified: true
  },
  {
    name: "Mark Carlson",
    location: "Australia",
    tourProduct: "Namibia, Botswana, Zimbabwe and South Africa",
    rating: 5,
    testimonial: "I was fortunate enough to do a trip of a lifetime through This Is Africa, I have been waiting 10years for my opportunity to travel to Africa to see game and the local experience. The itinerary put together was second to none, my experience has left me with the most amazing memories and wanting to go back for more!! I will be booking my next Africa adventure through you thanks again!!",
    date: "2019-06-01",
    featured: false,
    verified: true
  },
  {
    name: "Makaylee Little",
    location: "Australia",
    tourProduct: "Namibia, Botswana, Zimbabwe and South Africa",
    rating: 5,
    testimonial: "WOW!! I can't thank This Is Africa enough! I have just returned from a 9 day safari through Zimbabwe and Botswana and it completely blew my mind. The whole trip was seamless from start to end due to the amazing team putting together a fab itinerary giving us a bit of everything. We stayed at some of the most beautiful properties on private concessions, and on the water so we got to see all of the animals we wanted providing land and water based experiences and even got to visit a local village and school. The guides used were all so knowledgeable, excellent spotters, super friendly and really helped us to understand Africa better as a whole. For anyone wanting to have an authentic Africa experience This Is Africa is the way to go!",
    date: "2019-06-01",
    featured: false,
    verified: true
  },
  {
    name: "Beth Hawtrey",
    location: "Australia",
    tourProduct: "Namibia, Botswana, Zimbabwe and South Africa",
    rating: 5,
    testimonial: "This is Africa is such an amazing company, I can't fault them at all! We just returned from an 8 night trip with them and it was the best trip I've ever had. Everything ran smoothly, the accommodation was amazing and the game drives were next level. When you're booking your trip, the staff from res are so knowledgeable and helpful. Don't go anywhere else to book your dream holiday.",
    date: "2019-06-01",
    featured: false,
    verified: true
  },
  {
    name: "Alana Hassett",
    location: "Australia",
    tourProduct: "Namibia, Zimbabwe & Botswana",
    rating: 5,
    testimonial: "What a great company to organise your Africa trip! Everything ran smoothly and was looked after from start to finish across 9 days. Each guide was knowledgeable and provided an exciting and engaging game drive. One a day is never enough! We stayed at some of the most luxe properties I have experienced and will find it hard to go back to a normal 4 star. I would highly recommend consulting with, and booking through This Is Africa.",
    date: "2019-05-01",
    featured: false,
    verified: true
  }
];

// Combine all testimonials
const allTestimonials = [...quickReviews, ...detailedTestimonials];

async function importTestimonials() {
  console.log('Starting testimonials import...');
  console.log(`Total testimonials to import: ${allTestimonials.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const testimonial of allTestimonials) {
    try {
      const doc = {
        _type: 'testimonial',
        ...testimonial
      };
      
      const result = await client.create(doc);
      console.log(`✓ Imported testimonial from ${testimonial.name}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error importing testimonial from ${testimonial.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n========================================');
  console.log(`Import Complete!`);
  console.log(`✅ Successfully imported: ${successCount} testimonials`);
  if (errorCount > 0) {
    console.log(`❌ Failed to import: ${errorCount} testimonials`);
  }
  console.log('========================================');
}

// Run the import
importTestimonials();