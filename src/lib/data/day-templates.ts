/**
 * Day templates — pre-built thematic day plans for each destination.
 * Activity IDs reference the catalog in seed-activities.ts using the
 * "{destination_slug}-{activity-slug}" convention.
 */

import type { InterestTag, TripPace } from "@/types";

export interface DayTemplate {
  id: string;
  destination_slug: string;
  name: string;
  description: string;
  target_interests: InterestTag[];
  activity_ids: string[];
  suggested_pace: TripPace;
}

export const DAY_TEMPLATES: DayTemplate[] = [
  // ============================================================
  // TOKYO
  // ============================================================
  {
    id: "tokyo-classic-day",
    destination_slug: "tokyo",
    name: "Classic Tokyo Day",
    description:
      "The quintessential first-timer route hitting Senso-ji, Meiji Shrine, Shibuya Crossing, and Harajuku in one satisfying sweep.",
    target_interests: ["culture", "shopping", "temples"],
    activity_ids: [
      "tokyo-senso-ji",
      "tokyo-meiji-shrine",
      "tokyo-shibuya-crossing",
      "tokyo-harajuku",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "tokyo-foodie-day",
    destination_slug: "tokyo",
    name: "Tokyo Eats & Beats",
    description:
      "A dawn-to-dark feast through Tsukiji Market, Tokyo Ramen Street, and Golden Gai's intimate bars.",
    target_interests: ["food", "nightlife", "culture"],
    activity_ids: [
      "tokyo-tsukiji-outer-market",
      "tokyo-ramen-street",
      "tokyo-ebisu-bars",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "tokyo-pop-culture-day",
    destination_slug: "tokyo",
    name: "Neon & Pixels",
    description:
      "Dive into Tokyo's pop-culture universe with Akihabara arcades, TeamLab immersive art, and a stroll through Shinjuku Gyoen.",
    target_interests: ["shopping", "culture", "nightlife"],
    activity_ids: [
      "tokyo-akihabara",
      "tokyo-teamlab-borderless",
      "tokyo-shibuya-crossing",
      "tokyo-shinjuku-nightlife",
    ],
    suggested_pace: "packed",
  },

  {
    id: "tokyo-nightlife-day",
    destination_slug: "tokyo",
    name: "Tokyo After Dark",
    description:
      "Shibuya Crossing at twilight, then dive into Shinjuku's neon-drenched nightlife and wind down at Ebisu's cocktail bars.",
    target_interests: ["nightlife", "food"],
    activity_ids: [
      "tokyo-shibuya-crossing",
      "tokyo-shinjuku-nightlife",
      "tokyo-ebisu-bars",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // KYOTO
  // ============================================================
  {
    id: "kyoto-zen-day",
    destination_slug: "kyoto",
    name: "Zen Kyoto",
    description:
      "A serene morning at Fushimi Inari, the golden gleam of Kinkaku-ji, and a quiet tea ceremony to close the day.",
    target_interests: ["temples", "culture"],
    activity_ids: [
      "kyoto-fushimi-inari",
      "kyoto-kinkakuji",
      "kyoto-tea-ceremony",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "kyoto-iconic-day",
    destination_slug: "kyoto",
    name: "Iconic Kyoto",
    description:
      "All the greatest hits in a single ambitious day — Kiyomizu-dera, Nishiki Market, and an evening stroll through Gion.",
    target_interests: ["temples", "food", "culture"],
    activity_ids: [
      "kyoto-kiyomizudera",
      "kyoto-nishiki-market",
      "kyoto-gion-walk",
      "kyoto-pontocho",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "kyoto-nature-day",
    destination_slug: "kyoto",
    name: "Bamboo & Beyond",
    description:
      "Lose yourself in the towering bamboo of Arashiyama, then wander the mossy trails and iconic torii gates of Fushimi Inari.",
    target_interests: ["nature", "culture", "temples"],
    activity_ids: [
      "kyoto-arashiyama-bamboo",
      "kyoto-fushimi-inari",
      "kyoto-kinkakuji",
    ],
    suggested_pace: "relaxed",
  },

  {
    id: "kyoto-by-night",
    destination_slug: "kyoto",
    name: "Kyoto by Night",
    description:
      "Catch a maiko in Gion at dusk, dine along the Pontocho canal, then bar-hop the Kiyamachi backstreets.",
    target_interests: ["nightlife", "culture", "food"],
    activity_ids: [
      "kyoto-gion-walk",
      "kyoto-pontocho",
      "kyoto-kiyamachi-bars",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // OSAKA
  // ============================================================
  {
    id: "osaka-foodie-day",
    destination_slug: "osaka",
    name: "Foodie's Osaka",
    description:
      "Graze from Kuromon Market through Shinsekai's kushikatsu joints, and end under the neon glow of Dotonbori.",
    target_interests: ["food", "nightlife"],
    activity_ids: [
      "osaka-kuromon-market",
      "osaka-shinsekai",
      "osaka-dotonbori",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "osaka-culture-day",
    destination_slug: "osaka",
    name: "Castle & Culture",
    description:
      "Explore Osaka Castle's storied grounds, browse Amerikamura's shops, and close with street food along Dotonbori.",
    target_interests: ["culture", "shopping", "food"],
    activity_ids: [
      "osaka-castle",
      "osaka-amerikamura",
      "osaka-dotonbori",
      "osaka-namba-nightlife",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "osaka-thrill-day",
    destination_slug: "osaka",
    name: "Thrills & Eats",
    description:
      "Spend the day at Universal Studios Japan, then refuel with takoyaki and ramen in the neon heart of the city.",
    target_interests: ["adventure", "food", "nightlife"],
    activity_ids: [
      "osaka-usj",
      "osaka-dotonbori",
      "osaka-namba-nightlife",
    ],
    suggested_pace: "packed",
  },

  {
    id: "osaka-nightlife-day",
    destination_slug: "osaka",
    name: "Osaka After Dark",
    description:
      "Shinsekai's retro neon bars, hidden cocktail spots in Ura-Namba, then full-send at Namba's clubs and karaoke joints.",
    target_interests: ["nightlife", "food"],
    activity_ids: [
      "osaka-shinsekai-nightlife",
      "osaka-hozenji-bars",
      "osaka-namba-nightlife",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // HAKONE
  // ============================================================
  {
    id: "hakone-onsen-day",
    destination_slug: "hakone",
    name: "Soak & Scenery",
    description:
      "A lazy loop of Lake Ashi cruises, Owakudani's volcanic steam, and a sunset soak in a mountain ryokan onsen.",
    target_interests: ["onsen", "nature"],
    activity_ids: [
      "hakone-lake-ashi",
      "hakone-owakudani",
      "hakone-ryokan-onsen",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "hakone-art-nature-day",
    destination_slug: "hakone",
    name: "Art in the Mountains",
    description:
      "Wander the Open-Air Museum's sculpture garden, visit the lakeside shrine, and enjoy Mt. Fuji views from the lake.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "hakone-open-air-museum",
      "hakone-shrine",
      "hakone-lake-ashi",
      "hakone-owakudani",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "hakone-shrine-soak-day",
    destination_slug: "hakone",
    name: "Shrine, Steam & Soak",
    description:
      "Photograph Hakone Shrine's lakeside torii, taste volcanic black eggs at Owakudani, and melt into a ryokan onsen at sunset.",
    target_interests: ["temples", "onsen", "food"],
    activity_ids: [
      "hakone-shrine",
      "hakone-owakudani",
      "hakone-ryokan-onsen",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // HIROSHIMA
  // ============================================================
  {
    id: "hiroshima-peace-day",
    destination_slug: "hiroshima",
    name: "Peace & Remembrance",
    description:
      "A reflective morning at the Peace Memorial Park, a stroll through Shukkeien Garden, and Hiroshima's legendary okonomiyaki.",
    target_interests: ["culture", "food"],
    activity_ids: [
      "hiroshima-peace-park",
      "hiroshima-shukkeien",
      "hiroshima-okonomiyaki",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "hiroshima-miyajima-day",
    destination_slug: "hiroshima",
    name: "Miyajima Island Escape",
    description:
      "Ferry to Miyajima to see the floating torii gate, explore the island, and taste freshly grilled oysters by the water.",
    target_interests: ["temples", "nature", "food"],
    activity_ids: [
      "hiroshima-miyajima",
      "hiroshima-okonomiyaki",
      "hiroshima-peace-park",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "hiroshima-garden-foodie-day",
    destination_slug: "hiroshima",
    name: "Gardens & Griddles",
    description:
      "Stroll the serene Shukkeien Garden, dive into Hiroshima-style okonomiyaki, then reflect at the Peace Park at dusk.",
    target_interests: ["nature", "food", "culture"],
    activity_ids: [
      "hiroshima-shukkeien",
      "hiroshima-okonomiyaki",
      "hiroshima-peace-park",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // NARA
  // ============================================================
  {
    id: "nara-deer-temples-day",
    destination_slug: "nara",
    name: "Deer Park & Ancient Temples",
    description:
      "Feed the bowing deer, stand beneath the Great Buddha at Todai-ji, and explore the lantern-lined paths of Kasuga Shrine.",
    target_interests: ["temples", "nature", "culture"],
    activity_ids: [
      "nara-deer-park",
      "nara-todaiji",
      "nara-kasuga-shrine",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "nara-full-day",
    destination_slug: "nara",
    name: "Complete Nara",
    description:
      "A thorough exploration pairing all the major shrines with quiet strolls through the old merchant quarter of Naramachi.",
    target_interests: ["temples", "culture", "nature"],
    activity_ids: [
      "nara-todaiji",
      "nara-kasuga-shrine",
      "nara-naramachi",
      "nara-deer-park",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "nara-naramachi-stroll-day",
    destination_slug: "nara",
    name: "Naramachi & Deer Snacks",
    description:
      "Browse machiya craft shops in Naramachi, feed the bowing deer, and graze on mochi and street food along the way.",
    target_interests: ["food", "shopping", "culture"],
    activity_ids: [
      "nara-naramachi",
      "nara-deer-park",
      "nara-kasuga-shrine",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // KAMAKURA
  // ============================================================
  {
    id: "kamakura-temple-day",
    destination_slug: "kamakura",
    name: "Temple Trail to the Sea",
    description:
      "Walk from the Great Buddha through Hasedera temple's gardens, ending with a stroll along Komachi-dori shopping street.",
    target_interests: ["temples", "culture", "nature"],
    activity_ids: [
      "kamakura-great-buddha",
      "kamakura-hasedera",
      "kamakura-komachi-dori",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "kamakura-beach-day",
    destination_slug: "kamakura",
    name: "Surf & Shrine",
    description:
      "Mix sacred with seaside — the Great Buddha in the morning, Enoshima Island in the afternoon, and sunset over the Pacific.",
    target_interests: ["beach", "temples", "nature"],
    activity_ids: [
      "kamakura-great-buddha",
      "kamakura-enoshima",
      "kamakura-hasedera",
    ],
    suggested_pace: "relaxed",
  },

  {
    id: "kamakura-enoshima-eats-day",
    destination_slug: "kamakura",
    name: "Island Eats & Seaside Shops",
    description:
      "Explore Enoshima's sea caves and shirasu restaurants, then browse the snack-filled Komachi-dori on the way back.",
    target_interests: ["food", "beach", "shopping"],
    activity_ids: [
      "kamakura-enoshima",
      "kamakura-komachi-dori",
      "kamakura-hasedera",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // NIKKO
  // ============================================================
  {
    id: "nikko-shrine-day",
    destination_slug: "nikko",
    name: "Gilded Shrines of Nikko",
    description:
      "Marvel at the ornate Toshogu Shrine complex, then head up to the dramatic Kegon Falls.",
    target_interests: ["temples", "culture"],
    activity_ids: [
      "nikko-toshogu",
      "nikko-kegon-falls",
      "nikko-lake-chuzenji",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "nikko-nature-day",
    destination_slug: "nikko",
    name: "Waterfalls & Highland Lakes",
    description:
      "Head up to Lake Chuzenji and Kegon Falls for a day immersed in mountain scenery.",
    target_interests: ["nature", "culture"],
    activity_ids: [
      "nikko-kegon-falls",
      "nikko-lake-chuzenji",
      "nikko-toshogu",
    ],
    suggested_pace: "relaxed",
  },

  {
    id: "nikko-full-day",
    destination_slug: "nikko",
    name: "Shrines, Falls & Lake Loop",
    description:
      "Hit all three highlights in one ambitious day -- Toshogu's gilded halls, Kegon Falls, and a lakeside stroll at Chuzenji.",
    target_interests: ["temples", "nature", "adventure"],
    activity_ids: [
      "nikko-toshogu",
      "nikko-kegon-falls",
      "nikko-lake-chuzenji",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // NAGOYA
  // ============================================================
  {
    id: "nagoya-classic-day",
    destination_slug: "nagoya",
    name: "Nagoya Highlights",
    description:
      "Nagoya Castle in the morning, hitsumabushi eel for lunch, then browse Osu Kannon's quirky shopping arcades.",
    target_interests: ["culture", "food", "shopping"],
    activity_ids: [
      "nagoya-castle",
      "nagoya-hitsumabushi",
      "nagoya-osu-kannon",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "nagoya-foodie-day",
    destination_slug: "nagoya",
    name: "Nagoya Meshi Tour",
    description:
      "A day devoted to Nagoya's unique food culture — hitsumabushi eel, miso katsu, tebasaki wings, and Sakae nightlife.",
    target_interests: ["food", "nightlife"],
    activity_ids: [
      "nagoya-atsuta-shrine",
      "nagoya-hitsumabushi",
      "nagoya-miso-katsu",
      "nagoya-sakae-nightlife",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "nagoya-castle-industry-day",
    destination_slug: "nagoya",
    name: "Castle to Factory Floor",
    description:
      "Pair Nagoya Castle's golden dolphins with the Toyota Museum's robotic marvels, then refuel with miso katsu.",
    target_interests: ["culture", "food"],
    activity_ids: [
      "nagoya-castle",
      "nagoya-toyota-museum",
      "nagoya-miso-katsu",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // TAKAYAMA
  // ============================================================
  {
    id: "takayama-old-town-day",
    destination_slug: "takayama",
    name: "Edo-era Morning to Night",
    description:
      "Browse the morning market at dawn, stroll the dark-wood merchant streets, and feast on melt-in-your-mouth Hida beef.",
    target_interests: ["culture", "food"],
    activity_ids: [
      "takayama-morning-market",
      "takayama-old-town",
      "takayama-hida-beef",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "takayama-heritage-day",
    destination_slug: "takayama",
    name: "Alpine Heritage",
    description:
      "Explore thatched-roof farmhouses at Hida Folk Village and learn about mountain life in the Japanese Alps.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "takayama-folk-village",
      "takayama-old-town",
      "takayama-morning-market",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "takayama-wagyu-sake-day",
    destination_slug: "takayama",
    name: "Wagyu & Sake Trail",
    description:
      "Graze on Hida beef sushi from street vendors, taste fresh sake at old-town breweries, and browse the morning market.",
    target_interests: ["food", "culture", "shopping"],
    activity_ids: [
      "takayama-hida-beef",
      "takayama-old-town",
      "takayama-morning-market",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // KANAZAWA
  // ============================================================
  {
    id: "kanazawa-garden-culture-day",
    destination_slug: "kanazawa",
    name: "Gardens & Geisha Streets",
    description:
      "Wander Kenroku-en at its seasonal best and sip gold-leaf tea in the geisha quarter.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "kanazawa-kenrokuen",
      "kanazawa-higashi-chaya",
      "kanazawa-21st-century-museum",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "kanazawa-food-art-day",
    destination_slug: "kanazawa",
    name: "Market Fresh & Modern Art",
    description:
      "Start with the freshest seafood at Omicho Market, then explore the boundary-pushing 21st Century Museum of Contemporary Art.",
    target_interests: ["food", "culture", "shopping"],
    activity_ids: [
      "kanazawa-omicho-market",
      "kanazawa-21st-century-museum",
      "kanazawa-higashi-chaya",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "kanazawa-seafood-garden-day",
    destination_slug: "kanazawa",
    name: "Crab, Gardens & Gold Leaf",
    description:
      "Feast on winter crab at Omicho Market, wander snow-dusted Kenroku-en, and sip gold-leaf tea in the geisha quarter.",
    target_interests: ["food", "nature", "culture"],
    activity_ids: [
      "kanazawa-omicho-market",
      "kanazawa-kenrokuen",
      "kanazawa-higashi-chaya",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // SAPPORO
  // ============================================================
  {
    id: "sapporo-taste-of-hokkaido",
    destination_slug: "sapporo",
    name: "Taste of Hokkaido",
    description:
      "Feast your way through Nijo Market crab and uni, slurp legendary miso ramen on Ramen Alley, and finish with Sapporo beer at the brewery.",
    target_interests: ["food", "culture"],
    activity_ids: [
      "sapporo-nijo-market",
      "sapporo-ramen-alley",
      "sapporo-beer-museum",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "sapporo-city-day",
    destination_slug: "sapporo",
    name: "Sapporo City Explorer",
    description:
      "Stroll Odori Park, visit the Beer Museum, and sample fresh seafood at Nijo Market.",
    target_interests: ["culture", "food"],
    activity_ids: [
      "sapporo-odori-park",
      "sapporo-beer-museum",
      "sapporo-nijo-market",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "sapporo-nightlife-day",
    destination_slug: "sapporo",
    name: "Sapporo After Dark",
    description:
      "Miso ramen on Ramen Alley, craft beers at Hokkaido's best taprooms, then lose yourself in the neon maze of Susukino.",
    target_interests: ["nightlife", "food"],
    activity_ids: [
      "sapporo-ramen-alley",
      "sapporo-craft-beer",
      "sapporo-susukino",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // NISEKO
  // ============================================================
  {
    id: "niseko-powder-day",
    destination_slug: "niseko",
    name: "Legendary Powder Day",
    description:
      "Carve through Niseko's world-famous dry powder and thaw in a steaming outdoor onsen.",
    target_interests: ["skiing", "onsen"],
    activity_ids: [
      "niseko-powder-skiing",
      "niseko-onsen-hopping",
    ],
    suggested_pace: "packed",
  },
  {
    id: "niseko-relax-day",
    destination_slug: "niseko",
    name: "Mountain Relaxation",
    description:
      "Take a lighter day on the slopes then spend the afternoon soaking in multiple outdoor onsens with mountain views.",
    target_interests: ["onsen", "skiing"],
    activity_ids: [
      "niseko-onsen-hopping",
      "niseko-powder-skiing",
    ],
    suggested_pace: "relaxed",
  },

  {
    id: "niseko-apres-ski-day",
    destination_slug: "niseko",
    name: "Powder to Onsen",
    description:
      "Morning laps through waist-deep powder, then a long soak in an outdoor onsen watching the snow fall.",
    target_interests: ["skiing", "onsen", "adventure"],
    activity_ids: [
      "niseko-powder-skiing",
      "niseko-onsen-hopping",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // FUKUOKA
  // ============================================================
  {
    id: "fukuoka-yatai-night",
    destination_slug: "fukuoka",
    name: "Yatai Street Food Crawl",
    description:
      "Spend the evening hopping between riverfront yatai stalls for tonkotsu ramen, gyoza, and yakitori under the lanterns.",
    target_interests: ["food", "nightlife"],
    activity_ids: [
      "fukuoka-yatai",
      "fukuoka-hakata-ramen",
      "fukuoka-canal-city",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "fukuoka-culture-day",
    destination_slug: "fukuoka",
    name: "Shrines, Parks & Ramen",
    description:
      "Day-trip to Dazaifu Tenmangu shrine, explore Canal City, and circle back for a bowl of Hakata's finest.",
    target_interests: ["culture", "food", "nature"],
    activity_ids: [
      "fukuoka-dazaifu",
      "fukuoka-canal-city",
      "fukuoka-hakata-ramen",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "fukuoka-nightlife-day",
    destination_slug: "fukuoka",
    name: "Fukuoka After Dark",
    description:
      "Yatai stalls by the river, then bar-hop through Nakasu's neon streets and Daimyo's hidden cocktail alleys.",
    target_interests: ["nightlife", "food"],
    activity_ids: [
      "fukuoka-yatai",
      "fukuoka-nakasu-bars",
      "fukuoka-tenjin-underground",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // OKINAWA
  // ============================================================
  {
    id: "okinawa-beach-day",
    destination_slug: "okinawa-main",
    name: "Tropical Beach Day",
    description:
      "Snorkel the Blue Cave in the morning, then explore Kokusai Street for Okinawan crafts and cuisine.",
    target_interests: ["beach", "adventure", "nature"],
    activity_ids: [
      "okinawa-blue-cave",
      "okinawa-kokusai-street",
      "okinawa-churaumi-aquarium",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "okinawa-culture-day",
    destination_slug: "okinawa-main",
    name: "Ryukyu Kingdom",
    description:
      "Explore the rebuilt Shuri Castle, browse Kokusai Street for Okinawan crafts, and taste unique island cuisine.",
    target_interests: ["culture", "food", "shopping"],
    activity_ids: [
      "okinawa-shuri-castle",
      "okinawa-kokusai-street",
      "okinawa-blue-cave",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "okinawa-ocean-day",
    destination_slug: "okinawa-main",
    name: "Ocean Giants & Island Flavors",
    description:
      "Watch whale sharks glide at Churaumi Aquarium, then head to Kokusai Street for Okinawan street food and awamori.",
    target_interests: ["nature", "food", "culture"],
    activity_ids: [
      "okinawa-churaumi-aquarium",
      "okinawa-kokusai-street",
      "okinawa-shuri-castle",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // KOBE
  // ============================================================
  {
    id: "kobe-beef-sake-day",
    destination_slug: "kobe",
    name: "Beef, Sake & Kitano",
    description:
      "Tour the Nada sake breweries by morning, savor Kobe beef at lunch, and stroll the cosmopolitan Kitano district.",
    target_interests: ["food", "culture"],
    activity_ids: [
      "kobe-nada-sake",
      "kobe-beef-dinner",
      "kobe-kitano",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "kobe-city-stroll-day",
    destination_slug: "kobe",
    name: "Port City Stroll",
    description:
      "Wander the Kitano foreign quarter, sample Kobe beef, and explore the Nada sake district.",
    target_interests: ["culture", "food"],
    activity_ids: [
      "kobe-kitano",
      "kobe-beef-dinner",
      "kobe-nada-sake",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "kobe-after-dark",
    destination_slug: "kobe",
    name: "Kobe After Dark",
    description:
      "Feast on Kobe beef, then bar-hop through Sannomiya's backstreets and finish with harbor night views.",
    target_interests: ["food", "nightlife"],
    activity_ids: [
      "kobe-beef-dinner",
      "kobe-sannomiya-bars",
      "kobe-harborland-night",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // MT. FUJI AREA
  // ============================================================
  {
    id: "mt-fuji-lakeside-day",
    destination_slug: "mt-fuji",
    name: "Fuji Five Lakes",
    description:
      "Circle Lake Kawaguchiko by bike, photograph the Chureito Pagoda framing Mt. Fuji, and visit the springs of Oshino Hakkai.",
    target_interests: ["nature", "culture"],
    activity_ids: [
      "mt-fuji-area-kawaguchiko",
      "mt-fuji-area-chureito-pagoda",
      "mt-fuji-area-oshino-hakkai",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "mt-fuji-village-day",
    destination_slug: "mt-fuji",
    name: "Villages at Fuji's Feet",
    description:
      "Wander the crystal-clear springs of Oshino Hakkai, catch the iconic pagoda view, and take in Fuji views from every angle.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "mt-fuji-area-oshino-hakkai",
      "mt-fuji-area-chureito-pagoda",
      "mt-fuji-area-kawaguchiko",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "mt-fuji-sunrise-chase-day",
    destination_slug: "mt-fuji",
    name: "Sunrise Fuji Chase",
    description:
      "Climb Chureito Pagoda at dawn for the iconic shot, then cruise Kawaguchiko and wander the springs of Oshino Hakkai.",
    target_interests: ["nature", "temples"],
    activity_ids: [
      "mt-fuji-area-chureito-pagoda",
      "mt-fuji-area-kawaguchiko",
      "mt-fuji-area-oshino-hakkai",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // BEPPU
  // ============================================================
  {
    id: "beppu-onsen-tour",
    destination_slug: "beppu",
    name: "Hell Tour & Hot Springs",
    description:
      "Tour the surreal Beppu Hells, bury yourself in a volcanic sand bath, and cap the day with an open-air onsen under the stars.",
    target_interests: ["onsen", "nature"],
    activity_ids: [
      "beppu-hells",
      "beppu-sand-bath",
      "beppu-onsen-hopping",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "beppu-relaxation-day",
    destination_slug: "beppu",
    name: "Steam & Soak",
    description:
      "A leisurely day hopping between Beppu's many onsen, with a sand bath on the beach and a visit to the colorful Hells.",
    target_interests: ["onsen", "nature", "culture"],
    activity_ids: [
      "beppu-onsen-hopping",
      "beppu-sand-bath",
      "beppu-hells",
    ],
    suggested_pace: "relaxed",
  },

  {
    id: "beppu-sand-and-steam-day",
    destination_slug: "beppu",
    name: "Buried in Sand, Bathed in Steam",
    description:
      "Get buried in hot volcanic sand on the beach, tour the colorful Hells, and finish with a classic public onsen.",
    target_interests: ["onsen", "adventure", "nature"],
    activity_ids: [
      "beppu-sand-bath",
      "beppu-hells",
      "beppu-onsen-hopping",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // NAOSHIMA
  // ============================================================
  {
    id: "naoshima-art-day",
    destination_slug: "naoshima",
    name: "Art Island Immersion",
    description:
      "Descend into Chichu Art Museum's subterranean Monets, hunt outdoor sculptures, and pose with Kusama's iconic pumpkin at sunset.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "naoshima-chichu-museum",
      "naoshima-art-house-project",
      "naoshima-pumpkin",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "naoshima-island-hop-day",
    destination_slug: "naoshima",
    name: "Island Gallery Hop",
    description:
      "Spend the day cycling between the Chichu Museum, village art installations, and the iconic pumpkin sculptures on the Seto Inland Sea.",
    target_interests: ["culture"],
    activity_ids: [
      "naoshima-chichu-museum",
      "naoshima-pumpkin",
      "naoshima-art-house-project",
    ],
    suggested_pace: "relaxed",
  },

  {
    id: "naoshima-village-art-day",
    destination_slug: "naoshima",
    name: "Honmura Village Crawl",
    description:
      "Spend the day exploring transformed village houses in the Art House Project, then catch the pumpkin at golden hour.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "naoshima-art-house-project",
      "naoshima-pumpkin",
      "naoshima-chichu-museum",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // YAKUSHIMA
  // ============================================================
  {
    id: "yakushima-jomon-sugi-day",
    destination_slug: "yakushima",
    name: "Ancient Forest Trek",
    description:
      "An epic full-day hike through moss-draped rainforest to the 7,000-year-old Jomon Sugi cedar, Japan's oldest living tree.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "yakushima-jomon-sugi",
      "yakushima-shiratani",
    ],
    suggested_pace: "packed",
  },
  {
    id: "yakushima-mononoke-day",
    destination_slug: "yakushima",
    name: "Princess Mononoke's Forest",
    description:
      "Wander the ethereal moss-covered Shiratani Unsuikyo ravine that inspired Studio Ghibli.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "yakushima-shiratani",
      "yakushima-jomon-sugi",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "yakushima-easy-trail-day",
    destination_slug: "yakushima",
    name: "Mossy Ravine & Cedar Giants",
    description:
      "Take the easier Shiratani Unsuikyo loop through the moss-draped forest, then push on to see ancient cedars on the Jomon trail.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "yakushima-shiratani",
      "yakushima-jomon-sugi",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // SHIRAKAWA-GO
  // ============================================================
  {
    id: "shirakawa-go-village-day",
    destination_slug: "shirakawa-go",
    name: "Thatched-Roof Village Walk",
    description:
      "Step inside preserved gassho-zukuri farmhouses and climb to the viewpoint for the postcard panorama of the village.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "shirakawa-go-village",
      "shirakawa-go-viewpoint",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "shirakawa-go-full-day",
    destination_slug: "shirakawa-go",
    name: "Complete Shirakawa-go",
    description:
      "Explore the village thoroughly — visit multiple farmhouses, take in the hilltop viewpoint, and experience rural mountain hospitality.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "shirakawa-go-viewpoint",
      "shirakawa-go-village",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "shirakawa-go-viewpoint-walk-day",
    destination_slug: "shirakawa-go",
    name: "Postcard Panorama",
    description:
      "Hike to the Shiroyama viewpoint at dawn for the classic village panorama, then explore the farmhouses up close.",
    target_interests: ["nature", "culture"],
    activity_ids: [
      "shirakawa-go-viewpoint",
      "shirakawa-go-village",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // KOYA-SAN
  // ============================================================
  {
    id: "koyasan-spiritual-day",
    destination_slug: "koyasan",
    name: "Mountaintop Monastery",
    description:
      "Walk through the otherworldly Okunoin cemetery, visit Kongobu-ji temple, and stay overnight in a temple lodging.",
    target_interests: ["temples", "culture"],
    activity_ids: [
      "koya-san-okunoin",
      "koya-san-kongobuji",
      "koya-san-temple-stay",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "koyasan-temple-circuit-day",
    destination_slug: "koyasan",
    name: "Sacred Circuit",
    description:
      "Explore Kongobu-ji's rock garden, walk among the ancient graves of Okunoin, and experience temple lodging on the sacred mountain.",
    target_interests: ["temples", "culture", "nature"],
    activity_ids: [
      "koya-san-kongobuji",
      "koya-san-okunoin",
      "koya-san-temple-stay",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "koyasan-night-walk-day",
    destination_slug: "koyasan",
    name: "Lanterns & Lodging",
    description:
      "Walk Okunoin's lantern-lit cemetery at dusk, then settle into a temple stay for evening chanting and shojin ryori.",
    target_interests: ["temples", "culture", "food"],
    activity_ids: [
      "koya-san-okunoin",
      "koya-san-temple-stay",
      "koya-san-kongobuji",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // MATSUMOTO
  // ============================================================
  {
    id: "matsumoto-castle-day",
    destination_slug: "matsumoto",
    name: "Black Castle & Art Streets",
    description:
      "Tour Matsumoto's striking black castle and stroll the frog-themed Nawate-dori shopping street.",
    target_interests: ["culture"],
    activity_ids: [
      "matsumoto-castle",
      "matsumoto-nawate-dori",
      "matsumoto-kamikochi",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "matsumoto-alpine-day",
    destination_slug: "matsumoto",
    name: "Kamikochi Alpine Escape",
    description:
      "Bus into the pristine Kamikochi valley for a day of riverside hikes beneath soaring Northern Alps peaks.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "matsumoto-kamikochi",
      "matsumoto-castle",
      "matsumoto-nawate-dori",
    ],
    suggested_pace: "packed",
  },

  {
    id: "matsumoto-town-stroll-day",
    destination_slug: "matsumoto",
    name: "Castle Town Wanderer",
    description:
      "Tour the black castle at dawn, browse Nawate-dori's frog-themed shops, and catch Alpine views from the craft quarter.",
    target_interests: ["culture", "shopping", "nature"],
    activity_ids: [
      "matsumoto-castle",
      "matsumoto-nawate-dori",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // SENDAI
  // ============================================================
  {
    id: "sendai-food-culture-day",
    destination_slug: "sendai",
    name: "Beef Tongue & Boulevard Strolls",
    description:
      "Try Sendai's signature charcoal-grilled gyutan, visit the ornate Zuihoden mausoleum, and cruise Matsushima Bay.",
    target_interests: ["food", "culture"],
    activity_ids: [
      "sendai-gyutan",
      "sendai-zuihoden",
      "sendai-matsushima",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "sendai-matsushima-day",
    destination_slug: "sendai",
    name: "Matsushima Bay Cruise",
    description:
      "Take a scenic boat ride among the pine-clad islands of Matsushima Bay, one of Japan's three most celebrated views.",
    target_interests: ["nature", "culture"],
    activity_ids: [
      "sendai-matsushima",
      "sendai-gyutan",
      "sendai-zuihoden",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "sendai-history-food-day",
    destination_slug: "sendai",
    name: "Samurai Lord & Sizzling Tongue",
    description:
      "Visit Date Masamune's ornate mausoleum, feast on thick-cut charcoal gyutan, and cruise Matsushima at sunset.",
    target_interests: ["culture", "food", "nature"],
    activity_ids: [
      "sendai-zuihoden",
      "sendai-gyutan",
      "sendai-matsushima",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // FURANO & BIEI
  // ============================================================
  {
    id: "furano-biei-flower-day",
    destination_slug: "furano-biei",
    name: "Lavender Fields Forever",
    description:
      "Breathe in endless purple at the lavender farms, drive the Patchwork Road past rolling technicolor hills.",
    target_interests: ["nature"],
    activity_ids: [
      "furano-biei-lavender",
      "furano-biei-patchwork",
      "furano-biei-blue-pond",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "furano-biei-blue-pond-day",
    destination_slug: "furano-biei",
    name: "Blue Pond & Back Roads",
    description:
      "Photograph the surreal Blue Pond, cruise Biei's panoramic back roads, and catch golden hour over the flower fields.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "furano-biei-blue-pond",
      "furano-biei-patchwork",
      "furano-biei-lavender",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "furano-biei-cycling-day",
    destination_slug: "furano-biei",
    name: "Patchwork Hills by Bike",
    description:
      "Cycle Biei's rolling patchwork hills, stop at the Blue Pond, and finish with lavender soft serve at Farm Tomita.",
    target_interests: ["adventure", "nature"],
    activity_ids: [
      "furano-biei-patchwork",
      "furano-biei-blue-pond",
      "furano-biei-lavender",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // ONOMICHI
  // ============================================================
  {
    id: "onomichi-cycling-day",
    destination_slug: "onomichi",
    name: "Shimanami Kaido Ride",
    description:
      "Pedal across the Seto Inland Sea on Japan's most spectacular cycling route, hopping between islands connected by soaring bridges.",
    target_interests: ["adventure", "nature"],
    activity_ids: [
      "onomichi-shimanami-kaido",
      "onomichi-temple-walk",
      "onomichi-ramen",
    ],
    suggested_pace: "packed",
  },
  {
    id: "onomichi-temple-walk-day",
    destination_slug: "onomichi",
    name: "Hillside Temple Walk",
    description:
      "Climb the winding temple trail past cats dozing on stone walls and slurp Onomichi ramen with a harbor view.",
    target_interests: ["culture", "food", "nature"],
    activity_ids: [
      "onomichi-temple-walk",
      "onomichi-ramen",
      "onomichi-shimanami-kaido",
    ],
    suggested_pace: "moderate",
  },

  {
    id: "onomichi-ramen-temples-day",
    destination_slug: "onomichi",
    name: "Noodles & Hilltop Temples",
    description:
      "Slurp the city's famous soy-pork-fat ramen, then climb the winding temple trail for Inland Sea views.",
    target_interests: ["food", "temples", "culture"],
    activity_ids: [
      "onomichi-ramen",
      "onomichi-temple-walk",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // ITO
  // ============================================================
  {
    id: "ito-onsen-nightlife",
    destination_slug: "ito",
    name: "Soak & Night Out in Ito",
    description:
      "Relax in hot springs during the day, feast on fresh kinmedai, then hit the local nightlife scene.",
    target_interests: ["onsen", "nightlife", "food"],
    activity_ids: [
      "ito-onsen",
      "ito-marine-town",
      "ito-joynt",
      "ito-craps",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "ito-nature-day",
    destination_slug: "ito",
    name: "Coastal Nature Day",
    description:
      "Hike the dramatic Jogasaki volcanic coastline, then unwind with onsen and fresh seafood.",
    target_interests: ["nature", "onsen", "food"],
    activity_ids: [
      "ito-jogasaki-coast",
      "ito-onsen",
      "ito-marine-town",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "ito-coast-and-craft-beer",
    destination_slug: "ito",
    name: "Cliffs, Craft Beer & Bars",
    description:
      "Hike the Jogasaki coast in the morning, grab kinmedai at Marine Town, then bar-hop Ito's nightlife scene.",
    target_interests: ["nature", "nightlife", "food"],
    activity_ids: [
      "ito-jogasaki-coast",
      "ito-marine-town",
      "ito-joynt",
      "ito-craps",
    ],
    suggested_pace: "moderate",
  },
];

/**
 * Returns all day templates for a given destination slug.
 */
export function getTemplatesForDestination(slug: string): DayTemplate[] {
  return DAY_TEMPLATES.filter((t) => t.destination_slug === slug);
}
