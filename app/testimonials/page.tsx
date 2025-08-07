"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Quote } from "lucide-react"

export default function TestimonialsPage() {
  // Real customer testimonials from This is Africa - sorted by most recent first
  const testimonials = [
    // 2025 Testimonials
    {
      id: 1,
      name: "Stephanie and Emile",
      location: "Honeymoon",
      image: "/images/products/stephanie-emile.png",
      text: "We had the most incredible time—every destination you recommended was beyond beautiful, the hotels were absolutely stunning, and the safaris were truly out of this world.",
      fullText: "Hi Patrick I just wanted to say a huge thank you to you and the team at this is Africa for putting together the honeymoon of a lifetime for Emile and I. We had the most incredible time—every destination you recommended was beyond beautiful, the hotels were absolutely stunning, and the safaris were truly out of this world. Each experience felt so thoughtfully chosen, and the whole trip ran so seamlessly from start to finish. Africa completely stole our hearts. We've come home with memories that we'll treasure forever, and a deep love for the places, the culture, and the spirit of the continent. I've now made all my friends and family incredibly jealous—everyone wants to go to Africa after hearing about our trip! So I'll definitely be sending them your way for some amazing recommendations. Thank you again for making it all so special. We truly couldn't have asked for a more perfect start to our married life 🙂 Stephanie and Emile",
      rating: 5,
      trip: "Mauritius, South Africa, Botswana, Zimbabwe and Tanzania (Zanzibar)",
      date: "February & March 2025"
    },
    {
      id: 2,
      name: "Tim and Elizabeth Hely-Hammond",
      location: "Australia",
      image: "/images/products/brochure-cover.png",
      text: "Just a quick note to say thanks for organising our trip which was just fantastic, and provided us with lifelong memories.",
      fullText: "Hi Nikki Just a quick note to say thanks for organising our trip which was just fantastic, and provided us with lifelong memories...Sabi Sabi was just awesome, wonderfully well organised and the safari trips with our trusted guide Jan and the incredibly knowledgeable tracker Lazarus were just perfect. Please pass on our deepest thanks to the Sabi Sabi team...All in all it was the trip of a lifetime and we are already thinking of our next one! Kind Regards Tim and Elizabeth",
      rating: 5,
      trip: "South Africa",
      date: "March 2025"
    },
    {
      id: 3,
      name: "Bronwyn Elliott and John Winter",
      location: "Australia",
      image: "/images/products/brochure-cover.png",
      text: "Our driver/guide, Emanuel Manga, was excellent with a deep knowledge and passion for the landscape, wildlife and animal behaviour. The Ang'ata camps were very comfortable and quite luxurious.",
      fullText: "Some feedback, as discussed, about the recent Tanzania safari you organised for us…You promised to get us a good driver/guide and you certainly achieved that! Our driver/guide, Emanuel Manga, was excellent with a deep knowledge and passion for the landscape, wildlife and animal behaviour as well as John's needs for photography/videography. I would have no hesitation in recommending him…The Ang'ata camps were very comfortable and quite luxurious, but at the same time casual and relaxed. A nice balance for us and many Australians I would think. Everything felt fresh and clean and in a good state of repair at all the Ang'ata camps at Ngorongoro Crater, Central Serengeti and Ndutu (mobile camp). Anga'ata staff were, without exception, friendly, cheerful and welcoming. They are to be commended. The chefs do an amazing job in such remote locations, hours from the nearest market...The Miracle Balloon was fabulous, a really special experience, followed by champagne and a bountiful breakfast - once again far more food than we could eat…Nikki, from John and I, thank you to you and your team very much for organising our Tanzania safari for us. You did a wonderful job, meeting our brief exactly.",
      rating: 5,
      trip: "Tanzania",
      date: "February 2025"
    },
    // 2024 Testimonials
    {
      id: 4,
      name: "Paula Dock Family",
      location: "Australia",
      image: "/images/products/Paula-Dock-family.jpg",
      text: "The trip was amazing - we loved how it was all scheduled and were really happy with all the hotels and the game lodges were lovely.",
      fullText: "The trip was amazing - we loved how it was all scheduled and were really happy with all the hotels and the game lodges were lovely...Driving was all fine...and a good schedule and way more beautiful scenery than I'd imagined. A swim at Plettenburg Bay in 25 degree water was fab too!...In terms of the game lodges - the drives were best at Kariega, and the lodge was fabulous, then when we got to the Garden Route game lodge, that was even more fabulous - the drives were great…Thank you for the wonderful organisation....it was fabulous.",
      rating: 5,
      trip: "South Africa and Victoria Falls",
      date: "December 2024"
    },
    {
      id: 5,
      name: "Loaraine Guerrini and Family",
      location: "Australia",
      image: "/images/products/guerrini-family.jpg",
      text: "We had the most amazing time. The safari guide Christopher was really great, he had a wonderful sense of humour and was very knowledgeable.",
      fullText: "Hi Yvonne and Nikki I hope you're both well. I just wanted to thank you for arranging the tour. We had the most amazing time. The safari guide Christopher was really great, he had a wonderful sense of humour and was very knowledgeable. He definitely knew where to find the animals. The Sopa Lodges far exceeded my expectations, and the buffet food was exceptional every single day, I can't stop thinking about it! All the Kenyan people and guides were incredibly friendly, and all had a great sense of humour. I truly have nothing but praise for the whole tour and the country. I'm not sure I have another long flight left in me to Africa, but if I do, I would love to use your company again. Thank you once again for your time and effort and lovely approachable nature. Thank you also for staying in touch with flight updates, it was very much appreciated. Kind regards Lorraine",
      rating: 5,
      trip: "Kenya",
      date: "October 2024"
    },
    {
      id: 6,
      name: "Baines Family",
      location: "Australia",
      image: "/images/products/brochure-cover.png",
      text: "I find it hard to put into words how epic spectacular our trip was! Everything went off without a hitch. The attention to detail in the transfers was superb.",
      fullText: "I find it hard to put into words how epic spectacular our trip was! To tell the full story, we had originally thought we were going to plan a Europe trip. But after multiple failed attempts trying to get an agent to help us, we switched gears and decided to reach out to Africa travel agents. We put out a few emails to google-searched companies, and Nikki was the ONLY one to respond to us. From the very beginning, Nikki was attentive to our needs. We told her what the budget was, what the time frame was, and the type of experience we were looking for. She put together an itinerary for us, and the plan was in place! She responded to every concern we had, answered every email in detail, and took every phone call (at length sometimes!). In addition, we never actually attended the office or met Nikki in person, so if you are concerned about scams, This is Africa is legit. Now to our actual vacation: Everything went off without a hitch. The attention to detail in the transfers was superb, the places we stayed at were beyond our expectations and dreams! We had moments where we looked at each other and said \"This place is incredible! I want to freeze this moment in time!\" And the animals, oh the animals! It was like we were driving around in Jurassic Park, looking for elephants and giraffes. We definitely saw the big five and so much more! The trackers and guides are absolute experts, knowing every plant, animal, bird, and answering all of our many questions. All in all, we cannot thank Nikki, Von and This is Africa. Please do not hesitate to use their service, they are experts without a doubt! Thank you so much Tiffany and family",
      rating: 5,
      trip: "South Africa, Victoria Falls & Botswana",
      date: "July 2024"
    },
    {
      id: 7,
      name: "Sione Palu Family",
      location: "Australia",
      image: "/images/products/palu.jpg",
      text: "What a trip of a lifetime we had! Thanks to the team at This is Africa this will go down as one of the best trips ever.",
      fullText: "What a trip of a lifetime we had! Thanks to the team at This is Africa this will go down as one of the best trips ever. Our itinerary was well tailored for me and my two boys. Every place we stayed was perfect for us. Our trip had everything and I have fallen in love with Africa. I told my boys that they will be paying for our next trip back to Africa. So they better get working even though they are 9 and 12 years old hahaha. Thank you for turning a tragic year into one of joy, hope and beautiful memories. Kind regards Sione",
      rating: 5,
      trip: "South Africa",
      date: "July 2024"
    },
    // 2023 Testimonials
    {
      id: 8,
      name: "Deanne and Family",
      location: "Australia",
      image: "/images/products/deanne.jpg",
      text: "We cannot thank you enough for what was the most incredible holiday. On holidays like this you try not to let your expectations run away with you but on this one, we reached and absolutely exceeded all that we had hoped it would be.",
      fullText: "Nikki, we cannot thank you enough for what was the most incredible holiday. On holidays like this you try not to let your expectations run away with you but on this one, we reached and absolutely exceeded all that we had hoped it would be. Our short stint in Cape Town was enough to get us wanting to come back for more. Your recommendation on where to stay was perfect for what we needed. Onto safari we went and there are not enough superlatives to describe our joy and wonder at arriving at Sabi Sabi Bush Lodge. You told us to expect spectacular and it was. Your knowledge in helping us decide where to stay was invaluable. The lodge was nothing short of exceptional and service from the staff beyond fault, but that was nothing compared to the actual game drives with our knowledgeable tracker and ranger who I would recommend 100 times over. I think we were lucky enough to view 4 of the big 5 in our first 2 days – every day had something different – and up close – closer than we probably thought possible. We all now have a deep love and appreciation of the African Savannah. Our Mauritius leg was just as wonderous – what a truly beautiful island paradise. Your assistance with all our accommodation, transfers and flights was so helpful and we travelled without hiccup. After the holiday and experiences we had, I would gladly recommend you to anyone! Thank you Deanne",
      rating: 5,
      trip: "South Africa and Mauritius",
      date: "December 2023"
    },
    {
      id: 9,
      name: "Peter and Mary Lee",
      location: "Australia",
      image: "/images/products/Peter-and-Mary-Lee.jpg",
      text: "We enjoyed very much because they organised very well so we strongly recommend this company is the best of Africa tour. They have a great team and very kindly and patiently.",
      fullText: "My name is Peter with my wife ( Mary ) ,we joined '' This is a Africa '' company's tour travel to Africa on 18/9/2023--13/10/2023 We enjoyed very much because they organised very well so we strongly recommend this company is the best of Africa tour. They have a great team and very kindly and patiently. Peter and Mary",
      rating: 5,
      trip: "Kenya, South Africa, Botswana and Zimbabwe",
      date: "September 2023"
    },
    {
      id: 10,
      name: "Anthony and Louise",
      location: "Australia",
      image: "/images/products/anthony-louise.jpg",
      text: "What an incredible trip. It really did exceed our expectations. There were so many highlights From day one all transfers and all tours went to clockwork.",
      fullText: "What an incredible trip. It really did exceed our expectations. There were so many highlights From day one all transfers and all tours went to clockwork. Everyone was so friendly, professional and helpful. We stayed in a variety hotels and tents and all were clean and comfortable. Among the many highlights were the tented camps. The tents were spacious and so comfortable. The food was delicious. Nothing was too much trouble for the fantastic staff. They went above and beyond to ensure our stay was comfortable and an unforgettable experience. The farewell song was the icing on the cake. All this in the middle of the Serengeti; it was extraordinary. The game drives were so exciting. Every day was filled with multiple sightings of all the animals we came to see. We were so close to prides of lions, herds of elephants, zebras and giraffes. We had to pinch ourselves. The guides were amazing, so knowledgeable and informative. No two days were the same. By the end of our trip we became expert spotters of creatures great and small. Thank you Pat, for arranging an incredible itinerary and giving us such a unique experience. We'll definitely recommend This Is Africa to anyone travelling to Africa. Thank you, Anthony and Louise",
      rating: 5,
      trip: "Botswana, Tanzania, Victoria Falls, Zanzibar",
      date: "August 2023"
    },
    {
      id: 11,
      name: "Jaquie and Rod",
      location: "Australia",
      image: "/images/products/jaqui-rod.jpg",
      text: "Well, a beyond amazing adventure! The trip absolutely exceeded all my expectations – and that's saying something given how great the east African safari was a few years ago.",
      fullText: "Well, a beyond amazing adventure! The trip absolutely exceeded all my expectations – and that's saying something given how great the east African safari was a few years ago. The trip had everything: the Rovos train trip, Cape Town, the self-drive, the mountains, the coast, the Panorama Route, Victoria Falls, the river cruise and the safaris! The lodge in Thornybush Game Reserve with our open to the wild deck (outdoor bathroom had an electric fence!), the Chobe River cruise…Savuti in the Kalahari with so many lions, Xugana Island in the Okavango and our lodge near the Makgadikgadi Pans with The Hide (viewing platform accessed by way of a tunnel where you get really close to the animals). I even loved all the flights in tiny aircraft. Great fun. And loved landing on a sand airstrip, engine still running to see a sign \"Welcome to Savute International Airport, departure gate 3 – in the middle of nowhere!) The animals were amazing. We were lucky to see a baby rhino, a just born giraffe with the umbilical cord still attached, lion cubs (heaps), heaps of baby elephants, 3 leopards (previously only seen them asleep in trees. This time they were all out hunting), painted dogs, jackals making a kill, lions feeding on a kudu kill, crocodiles feeding on a buffalo, giraffes, elephants and hippos all fighting. We saw so many elephant river crossings. Nightly sundowners on safari made every fantastic sunset even more memorable! Loved it all! Jaquie and Rod",
      rating: 5,
      trip: "South Africa, Botswana, and Zimbabwe",
      date: "September 2023"
    },
    {
      id: 12,
      name: "Fran & Bart Geysen",
      location: "Australia",
      image: "/images/products/fran-bart.jpg",
      text: "I want to say thank you so very much - it was everything I'd hoped it would be and more! It was seamless and just perfect.",
      fullText: "Good morning Patrick We have returned from our amazing African trip that you organised for us. I want to say thank you so very much - it was everything I'd hoped it would be and more! It was seamless and just perfect. The variety of stays were wonderful...... from the camp style of Odd Balls Enclave to the luxury of Simbivati! The Trackers were amazing and so interesting and the service was truly incredible......everywhere. Every flight (we had 10 in total) was on time and every time there was someone to meet us when we landed. At no time did we feel lost or unsure of our bearings. Fantastic. Thank you once again for the trip of a lifetime. Kindest regards Fran Geysen",
      rating: 5,
      trip: "South Africa, Zimbabwe and Botswana",
      date: "September 2023"
    },
    {
      id: 13,
      name: "Gary & Sharon",
      location: "Australia",
      image: "/images/products/gary-sharon.jpeg",
      text: "Our travels started in Tanzania where our seven day Simba Safari trip exceeded our expectations – fantastic animal sightings, excellent accommodation & food options and extremely friendly & helpful staff.",
      fullText: "We first booked this trip in early 2020 but unfortunately due to Covid's interference it took us three attempts to finally get to Africa. This Is Africa were excellent in ensuring we did not lose out on our deposits and prepaid flights and were very helpful in re planning and booking our itinerary as needed. Many thanks to Nikki and all the This is Africa staff. Our travels started in Tanzania where our seven day Simba Safari trip exceeded our expectations – fantastic animal sightings, excellent accommodation & food options and extremely friendly & helpful staff. Met some wonderful people to share our experiences with and hopefully to see again on our future travels. Victoria Falls is definitely worth visiting and Ilala Lodge a great place to stay at. If you have the time & money a helicopter ride over the Falls is a must do to really experience the grandeur. The cultural dinner at the Victoria Falls Hotel was a must as well to not only see the view but step back into a time of colonial surroundings in the beauty of the Hotel. At Sabi Sands we stayed at Arathusa Safari Lodge in one of their bush facing suites. Luckily Federal Air Charters provide an easy & professional access option to the lodge with a charter flight from Johannesburg to the Arathusa Lodge airstrip. The lodge and surrounding grounds are gorgeous, the staff & food excellent, and the game drives superb with lots of close up encounters with animals including those who chose to wander through the grounds of the lodge itself. For us this was the highlight of our travels. All up – a brilliant holiday seeing lots and lots of animals in their native environments. Again thank you This is Africa for your help & suggestions in finalising our itinerary with a very special thank you to Nikki for helping us with every part of our planning. Regards Gary & Sharon.",
      rating: 5,
      trip: "Tanzania, Victoria Falls & Sabi Sands",
      date: "July 2023"
    },
    {
      id: 14,
      name: "Diogo and Bella Dos Santos",
      location: "Honeymoon",
      image: "/images/products/diogo-bella.jpg",
      text: "Our African honeymoon safari was nothing short of a dream come true. Bella had literally been dreaming about this since high school, more than 12years.",
      fullText: "Our African honeymoon safari was nothing short of a dream come true. Bella had literally been dreaming about this since high school, more than 12years. And your help to make it as perfect as possible was noticeable. All the transfers we got were on time, the trip went smoothly and what a bunch of nice people working there. All the hotels suggested were fantastic Raddison blue, Kuname ( I want to go back), The fancy tent in Zimbabwe.....All of them were insane great... The itinerary you suggested was perfect, exactly as we wanted. WE SAW ALL THE BIG FIVE!!!!!!! Most of them we saw multiple times. All the game drives were 10/10. Thank you so much for your help. Safe to say we are absolutely hooked, cannot wait for our next opportunity to go to Africa. It was magical & we are compelled to go back ASAP. Regards Diogo and Bella",
      rating: 5,
      trip: "South Africa, Zimbabwe, Botswana",
      date: "May & June 2023"
    },
    {
      id: 15,
      name: "Flynn Family",
      location: "Australia",
      image: "/images/products/flynn.jpg",
      text: "This holiday was AMAZING!! It far exceeded all of our expectations. From start to finish everything went perfectly, all of our transfers and tours were on time and the whole trip ran like clockwork.",
      fullText: "This holiday was AMAZING!! It far exceeded all of our expectations. From start to finish everything went perfectly, all of our transfers and tours were on time and the whole trip ran like clockwork. The accommodation was all fantastic with special mention to the lodges (Chobe Bakwena and Shiduli). I would highly recommend both of these to anyone traveling to these parts. In fact, I would highly recommend the whole itinerary to anyone looking for a family trip to Africa. Thanks for everything and please pass on our thanks and positive feedback to 'This is Africa' they obviously have a very good team here and over there to coordinate all this to such a high standard. Thank you Suzanne",
      rating: 5,
      trip: "South Africa, Botswana & Victoria Falls",
      date: "June 2023"
    },
    {
      id: 16,
      name: "Debbi and Dave Haesler",
      location: "Australia",
      image: "/images/products/brochure-cover.png",
      text: "Everything arranged by This Is Africa went perfectly to plan, many thanks. Bakwena Lodge was a great start. Their service was outstanding including tracking down luggage misplaced by Air Botswana.",
      fullText: "Dear Von and Nikki We are home safe and sound after our time in Africa and Egypt. Everything arranged by This Is Africa went perfectly to plan, many thanks. Bakwena Lodge was a great start. Their service was outstanding including tracking down luggage misplaced by Air Botswana. They set a standard that no one else could hope to achieve. We are still sorting through thousands of photos. Our trip was originally planned for 2020 but Covid intervened. This Is Africa honoured all of the deposits we had paid, were very helpful in re planning some of our itinerary and were always quick to respond to our many and varied requests. Again, many thanks. Debbie and Dave",
      rating: 5,
      trip: "Botswana Kenya, Tanzania and Victoria Falls",
      date: "June 2023"
    },
    {
      id: 17,
      name: "Kate & Daniel",
      location: "Honeymoon",
      image: "/images/products/kate-daniel.jpeg",
      text: "Daniel and I had the most incredible time! We fell in love with Nkuringo Bwindi Gorilla Lodge and the people there. Gorilla trekking was hands down THE MOST incredible experience we have ever had.",
      fullText: "Morning Nikki, Pat and Team! Now that life has started to settle down a bit and I finally have a spare second. I just wanted to reach out on behalf of Daniel and I and say thank you so so much for everything you did for our honeymoon. Daniel and I had the most incredible time! We fell in love with Nkuringo Bwindi Gorilla Lodge and the people there. Gorilla trekking was hands down THE MOST incredible experience we have ever had. Thank you for dealing with all of my ridiculous questions / painful phone calls and stressing moments. I am proud to say that Daniel is also now Africa obsessed and we cannot wait to go back. Thank you again! Kate & Daniel",
      rating: 5,
      trip: "Uganda and Rwanda",
      date: "April 2023"
    },
    {
      id: 18,
      name: "Leanne and Carl",
      location: "Australia",
      image: "/images/products/leanne-carl.jpg",
      text: "So many of my friends want to do what we have done. I did a daily FB update, and now everyone is ready to travel.",
      fullText: "So many of my friends want to do what we have done. I did a daily FB update, and now everyone is ready to travel. Uganda, and our guide Joseph and our amazing trekkers surpassed our expectations. Our tour through Namibia, Botswana and Zimbabwe was grand, and we covered a lot of ground. Adventures: well the silver-back kicked me and I still have a bruise on my leg to show for it. Was fine, and a great dinner party story forever more. We saw everything, all close up. Have a million photos to share. Lions doing rude things beside the road, so perfect viewing. A leopard deciding to go for a daytime wander, warthogs having a nap outside the supermarket. I loved Africa, and it exceeded all our expectations. Thank you for all your assistance, we didn't have any issues with travel, transfers etc. I will find some photos from my phone for you, but here is me happily resting after the Golden Monkeys with your cap on. Thank you Leanne",
      rating: 5,
      trip: "South Africa, Rwanda, Uganda, Namibia, Botswana and Zimbabwe",
      date: "March, April and May 2023"
    },
    {
      id: 19,
      name: "Greg and Cathy",
      location: "Australia",
      image: "/images/products/Greg-and-Cathy-Tavener.jpg",
      text: "Greg and I had another fabulous holiday in South Africa. Thank you both for putting together a wonderful itinerary we had a great holiday.",
      fullText: "Hi Patrick and Yvonne Greg and I had another fabulous holiday in South Africa Stellenbosch is beautiful and we enjoyed another stay in Cape Town The Garden Route is stunning and the tour was everything we expected Kariega was amazing and we were pleased to stay on the River Lodge as well as Ukhosi Lodge Johannesburg was interesting and we were happy to experience Soweto Thank you both for putting together a wonderful itinerary we had a great holiday. We will be in touch when we are ready to go somewhere else in Africa Kind regards Cathy and Greg",
      rating: 5,
      trip: "South Africa (Second time travellers with This is Africa)",
      date: "April 2023"
    },
    // Older testimonials for additional social proof
    {
      id: 20,
      name: "Olivia Mair",
      location: "Flight Centre Travel Group",
      image: "/images/products/brochure-cover.png",
      text: "Everything went off without a hitch and both my Mum and I thoroughly enjoyed ourselves. Mum had some pretty high expectations but miraculously we saw all that and more!",
      fullText: "Hi guys, I just thought I'd write you a note to say thanks very much for your help in organising my recent trip to Africa. Everything went off without a hitch and both my Mum and I thoroughly enjoyed ourselves. Mum had some pretty high (and unrealistic) expectations of what we would see (leopard up a tree, baby elephant having a mud bath, a giraffe drinking etc, etc) but miraculously we saw all that and more! So thanks again for a wonderful trip, I'll definitely be recommending you to anyone planning a trip to Africa. Cheers Olivia Commercial Manager Flight Centre Travel Group",
      rating: 5,
      trip: "Botswana, Zimbabwe and South Africa",
      date: "April 2017"
    },
    {
      id: 21,
      name: "Anya Hollstein",
      location: "Australia",
      image: "/images/products/Anya.jpg",
      text: "Everything was carefully and expertly arranged from start to finish. We were so lucky with our game viewing, jumping off the Elephant express and getting driven right to a lioness and her little cub - unforgettable!",
      fullText: "I just returned from a trip organised through This is Africa and I can't recommend them more highly. Everything was carefully and expertly arranged from start to finish. We were so lucky with our game viewing, jumping off the Elephant express and getting driven right to a lioness and her little cub - unforgettable! All our accommodation was beautiful and varied. A standout is definitely Nehimba. Having dinner or drinks on the deck while elephants drink from the swimming pool mere metres away. Chobe will always be an amazing memory for me as we were lucky enough to see a huge amount of animals but a lion and two lionesses walking past your vehicle is something you won't forget quickly. No matter where in Africa and what style you like to travel I would recommend This is Africa.",
      rating: 5,
      trip: "Hwange, Chobe and Victoria Falls",
      date: "May 2019"
    },
    {
      id: 22,
      name: "Mark Carlson",
      location: "Australia",
      image: "/images/products/Mark-100x100.png",
      text: "I was fortunate enough to do a trip of a lifetime through This Is Africa, I have been waiting 10years for my opportunity to travel to Africa to see game and the local experience.",
      fullText: "I was fortunate enough to do a trip of a lifetime through This Is Africa, I have been waiting 10years for my opportunity to travel to Africa to see game and the local experience. The itinerary put together was second to none, my experience has left me with the most amazing memories and wanting to go back for more!! I will be booking my next Africa adventure through you thanks again!!",
      rating: 5,
      trip: "Namibia, Botswana, Zimbabwe and South Africa",
      date: "June 2019"
    },
    {
      id: 23,
      name: "Makaylee Little",
      location: "Australia",
      image: "/images/products/Makaylee-e1561875223502-100x100.jpg",
      text: "WOW!! I can't thank This Is Africa enough! I have just returned from a 9 day safari through Zimbabwe and Botswana and it completely blew my mind.",
      fullText: "WOW!! I can't thank This Is Africa enough! I have just returned from a 9 day safari through Zimbabwe and Botswana and it completely blew my mind. The whole trip was seamless from start to end due to the amazing team putting together a fab itinerary giving us a bit of everything. We stayed at some of the most beautiful properties on private concessions, and on the water so we got to see all of the animals we wanted providing land and water based experiences and even got to visit a local village and school. The guides used were all so knowledgeable, excellent spotters, super friendly and really helped us to understand Africa better as a whole. For anyone wanting to have an authentic Africa experience This Is Africa is the way to go!",
      rating: 5,
      trip: "Namibia, Botswana, Zimbabwe and South Africa",
      date: "June 2019"
    },
    {
      id: 24,
      name: "Beth Hawtrey",
      location: "Australia",
      image: "/images/products/Beth-.jpg",
      text: "This is Africa is such an amazing company, I can't fault them at all! We just returned from an 8 night trip with them and it was the best trip I've ever had.",
      fullText: "This is Africa is such an amazing company, I can't fault them at all! We just returned from an 8 night trip with them and it was the best trip I've ever had. Everything ran smoothly, the accommodation was amazing and the game drives were next level. When you're booking your trip, the staff from res are so knowledgeable and helpful. Don't go anywhere else to book your dream holiday.",
      rating: 5,
      trip: "Namibia, Botswana, Zimbabwe and South Africa",
      date: "June 2019"
    },
    {
      id: 25,
      name: "Alana Hassett",
      location: "Australia",
      image: "/images/products/Alana-.jpeg",
      text: "What a great company to organise your Africa trip! Everything ran smoothly and was looked after from start to finish across 9 days.",
      fullText: "What a great company to organise your Africa trip! Everything ran smoothly and was looked after from start to finish across 9 days. Each guide was knowledgeable and provided an exciting and engaging game drive. One a day is never enough! We stayed at some of the most luxe properties I have experienced and will find it hard to go back to a normal 4 star. I would highly recommend consulting with, and booking through This Is Africa.",
      rating: 5,
      trip: "Namibia, Zimbabwe & Botswana",
      date: "May 2019"
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh]">
        <Image
          src="/images/products/testimonial-banner-1-1-1.jpg"
          alt="Customer Testimonials - This is Africa"
          fill
          priority
          className="object-cover"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Testimonials</h1>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
              Hear from our satisfied customers about their incredible African adventures
            </p>
          </div>
        </div>
      </section>

      {/* Quick Quotes Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Quote className="h-8 w-8 text-amber-500 mb-3" />
                <p className="text-gray-700 italic font-medium">
                  "Simply amazing...fabulous. We will definitely recommend your company"
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Quote className="h-8 w-8 text-amber-500 mb-3" />
                <p className="text-gray-700 italic font-medium">
                  "It was fabulous. Everything was exactly as you'd prepared and all your recommendations were spot on."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Quote className="h-8 w-8 text-amber-500 mb-3" />
                <p className="text-gray-700 italic font-medium">
                  "I have just returned from Rwanda and Tanzania and you guys did a FAB job!!!"
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Quote className="h-8 w-8 text-amber-500 mb-3" />
                <p className="text-gray-700 italic font-medium">
                  "I certainly want to go back and do Gorilla trekking and will 100% be going through you guys again."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Quote className="h-8 w-8 text-amber-500 mb-3" />
                <p className="text-gray-700 italic font-medium">
                  "We know it is just a snapshot of Africa but for us it just such a perfect one."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Quote className="h-8 w-8 text-amber-500 mb-3" />
                <p className="text-gray-700 italic font-medium">
                  "What can I say? Our trip to Southern Africa was absolutely BRILLIANT!!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Customer Reviews</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Read detailed experiences from our travelers about their African adventures with This is Africa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                      <p className="text-amber-600 text-sm font-medium">{testimonial.trip}</p>
                      {testimonial.date && (
                        <p className="text-gray-500 text-xs">{testimonial.date}</p>
                      )}
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className="h-8 w-8 text-amber-500/20 absolute -top-2 -left-2" />
                    <p className="text-gray-700 leading-relaxed italic pl-6">
                      "{testimonial.fullText}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Create Your Own African Story?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have experienced the magic of Africa with This is Africa. 
            Let us help you plan your unforgettable journey.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-amber-500 hover:bg-amber-600">
                Start Planning Your Trip
              </Button>
            </Link>
            <Link href="/packages">
              <Button variant="outline">
                Browse Our Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}